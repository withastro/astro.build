import { Handler } from '@netlify/functions'
import { Response } from '@netlify/functions/dist/function/response.js'
import fetch, { File, FormData } from 'node-fetch'
import { array, object, string } from 'zod'
import { type ThemeData } from '../../../src/data/themes/index.js'
import { parseMultipartForm } from './parse-multipart-form.js'

const env = object({
    DISCORD_WEBHOOK_URL: string()
}).parse(process.env)

const discordWebhookMessageSchema = object({
    id: string(),
    content: string(),
    attachments: array(object({ filename: string(), url: string() }))
})

const slugify = (str: string) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

const redirect = (url: string): Response => ({
    headers: { Location: url },
    statusCode: 303
})

const errorRedirect = (message: string): Response => ({
    statusCode: 303,
    headers: {
        Location: `/themes/submit/error?errorMessage=${encodeURIComponent(
            message
        )}`
    }
})

export const handler: Handler = async (event) => {
    if (!event.body) {
        return errorRedirect('No body')
    }

    const form = await parseMultipartForm(
        event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body,
        event.headers
    )

    const getString = (name: string) => {
        const value = form.get(name)
        return typeof value === 'string' ? value : undefined
    }

    // rickroll the bots
    if (form.get('botField')) {
        return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    }

    const initialMessageBody = new FormData()

    for (const [index, value] of form.getAll('images').entries()) {
        if (value instanceof File) {
            initialMessageBody.append(`files[${index}]`, value, value.name)
        }
    }

    initialMessageBody.append(
        'payload_json',
        JSON.stringify({ content: 'New theme submission!' })
    )

    const webhookResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        body: initialMessageBody
    })
    if (!webhookResponse.ok) {
        return errorRedirect(
            `Initial webhook failed: ${webhookResponse.statusText}`
        )
    }

    const webhookMessageJson = discordWebhookMessageSchema.parse(
        await webhookResponse.json()
    )

    const [image, ...images] = webhookMessageJson.attachments.map(
        (attachment) => ({
            src: attachment.url,
            alt: attachment.filename
        })
    )

    if (!image) {
        return errorRedirect('No image')
    }

    const themeName = getString('themeName')
    if (!themeName) {
        return errorRedirect('Theme name required')
    }

    const repoUrl = getString('repoUrl')
    const demoUrl = getString('demoUrl')
    const themeData: ThemeData = {
        title: themeName,
        description: getString('shortDescription') ?? '',
        image,
        images,
        repoUrl: repoUrl ? { href: repoUrl, text: 'Repo URL' } : undefined,
        demoUrl: demoUrl ? { href: demoUrl, text: 'Demo URL' } : undefined,
        categories: [],
        slug: slugify(themeName),
        fullDescription: getString('fullDescription') ?? '',
        PREVIEW: true
    }

    const discordFormData = new FormData()
    discordFormData.append(
        'files[0]',
        new File(
            [JSON.stringify(themeData, null, 2)],
            `${themeData.slug}.json`,
            { type: 'application/json' }
        )
    )
    discordFormData.append(
        'files[1]',
        new File(
            [JSON.stringify(Object.fromEntries(form), null, 2)],
            'submission.json',
            { type: 'application/json' }
        )
    )

    const discordResponse = await fetch(
        `${env.DISCORD_WEBHOOK_URL.replace(/\/$/, '')}/messages/${
            webhookMessageJson.id
        }`,
        {
            method: 'PATCH',
            body: discordFormData
        }
    )

    if (!discordResponse.ok) {
        return errorRedirect(
            `Message update failed failed: ${discordResponse.statusText}`
        )
    }

    return redirect('/themes/submit/success')
}
