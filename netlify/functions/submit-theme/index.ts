import { Handler } from '@netlify/functions'
import { Response } from '@netlify/functions/dist/function/response.js'
import { File } from 'node-fetch'
import { object, string } from 'astro/zod'
import { type ThemeData } from '../../../src/data/themes/index.js'
import {
    DiscordWebhookMessage,
    editDiscordWebhookMessage,
    executeDiscordWebhook
} from '../../../src/utils/discord.js'
import { toError } from '../../../src/utils/errors.js'
import { parseMultipartForm } from '../../../src/utils/parseMultipartForm.js'

const env = object({
    DISCORD_WEBHOOK_URL: string(),
    DISCORD_WEBHOOK_THREAD_ID: string()
}).parse(process.env)

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

    const getStringOrUndefined = (name: string) => {
        const value = form.get(name)
        return typeof value === 'string' ? value : undefined
    }

    // rickroll the bots
    if (form.get('botField')) {
        return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    }

    let message: DiscordWebhookMessage
    try {
        message = await executeDiscordWebhook(env.DISCORD_WEBHOOK_URL, {
            threadId: env.DISCORD_WEBHOOK_THREAD_ID,
            content: 'New theme submission!',
            files: form
                .getAll('images')
                .filter((value): value is File => value instanceof File)
        })
    } catch (error: unknown) {
        return errorRedirect(
            `Initial webhook failed: ${toError(error).message}`
        )
    }

    const [image, ...images] = message.attachments.map((attachment) => ({
        src: attachment.url,
        alt: attachment.filename
    }))

    if (!image) {
        return errorRedirect('No image')
    }

    const themeName = getStringOrUndefined('themeName')
    if (!themeName) {
        return errorRedirect('Theme name required')
    }

    const repoUrl = getStringOrUndefined('repoUrl')
    const demoUrl = getStringOrUndefined('demoUrl')
    const themeData: ThemeData = {
        title: themeName,
        description: getStringOrUndefined('shortDescription') ?? '',
        image,
        images,
        repoUrl: repoUrl ? { href: repoUrl, text: 'Repo URL' } : undefined,
        demoUrl: demoUrl ? { href: demoUrl, text: 'Demo URL' } : undefined,
        categories: [],
        slug: slugify(themeName),
        fullDescription: getStringOrUndefined('fullDescription') ?? ''
    }

    const files = [
        new File(
            [JSON.stringify(themeData, null, 2)],
            `${themeData.slug}.json`,
            { type: 'application/json' }
        ),
        new File(
            [JSON.stringify(Object.fromEntries(form), null, 2)],
            'submission.json',
            { type: 'application/json' }
        )
    ]

    try {
        await editDiscordWebhookMessage(env.DISCORD_WEBHOOK_URL, message.id, {
            threadId: env.DISCORD_WEBHOOK_THREAD_ID,
            files
        })
    } catch (error: unknown) {
        return errorRedirect(
            `Editing webhook failed: ${toError(error).message}`
        )
    }

    return redirect('/themes/submit/success')
}
