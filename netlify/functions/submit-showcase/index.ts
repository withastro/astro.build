import { InputFormat } from '@astrojs/image/dist/loaders/index.js'
import { Handler } from '@netlify/functions'
import { Response } from '@netlify/functions/dist/function/response.js'
import { File } from 'node-fetch'
import { object, string } from 'zod'
import { ShowcaseSite } from '../../../src/types.js'
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
        Location: `/showcase/submit/error?errorMessage=${encodeURIComponent(
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

    const websiteName = getStringOrUndefined('websiteName')
    if (!websiteName) {
        return errorRedirect('Website name required')
    }

    const websiteUrl = getStringOrUndefined('websiteUrl')
    if (!websiteUrl) {
        return errorRedirect('Website URL required')
    }

    let message: DiscordWebhookMessage
    try {
        message = await executeDiscordWebhook(env.DISCORD_WEBHOOK_URL, {
            threadId: env.DISCORD_WEBHOOK_THREAD_ID,
            content: 'New showcase submission!',
            files: form
                .getAll('images')
                .filter((value): value is File => value instanceof File)
        })
    } catch (error: unknown) {
        return errorRedirect(
            `Initial webhook failed: ${toError(error).message}`
        )
    }

    const [image, ...images] = message.attachments.flatMap((attachment) => {
        if (!attachment.content_type?.startsWith('image/')) return []

        const format = attachment.content_type.replace(
            /^image\//,
            ''
        ) as InputFormat

        if (!attachment.width) return []
        if (!attachment.height) return []

        return {
            src: attachment.url,
            alt: attachment.filename,
            width: attachment.width,
            height: attachment.height,
            format
        }
    })

    if (!image) {
        return errorRedirect('No image')
    }

    const siteData: ShowcaseSite = {
        slug: slugify(websiteName),
        title: websiteName,
        image,
        url: { href: websiteUrl, text: 'Visit' }
    }

    const files = [
        new File([JSON.stringify(siteData, null, 2)], `${siteData.slug}.json`, {
            type: 'application/json'
        }),
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
