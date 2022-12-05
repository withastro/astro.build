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

export const handler: Handler = async (event) => {
    if (!event.body) {
        throw new Error('No body')
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
        throw new Error(`Initial webhook failed: ${webhookResponse.statusText}`)
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
        throw new Error('No image')
    }

    const themeName = getString('themeName')
    if (!themeName) {
        throw new Error('Theme name required')
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
        throw new Error(
            `Message update failed failed: ${discordResponse.statusText}`
        )
    }

    return redirect('/themes/submit/success')

    /* 
    try {

        const themeData: ThemeData = {
            title: body.textFields.themeName?.[0] ?? '',
            description: body.textFields.shortDescription?.[0] ?? '',
            fullDescription: body.textFields.fullDescription?.[0] ?? ''
        }

        console.log(
            'Theme data:',
            inspect(themeData, { depth: Infinity, colors: true })
        )

        const branchName = `theme-submissions/${kebabCase(
            themeData.themeName
        )}-${now}`
        console.log('Branch name:', branchName)

        const themeFileName = `${kebabCase(themeData.themeName)}-${now}.json`
        console.log('Theme file name:', themeFileName)

        console.log('mkdir', path.dirname(repoFolder))
        await fs.promises.mkdir(path.dirname(repoFolder), { recursive: true })

        console.log('git.clone', repoUrl, repoFolder)
        await git.clone({
            fs,
            http,
            url: repoUrl,
            dir: repoFolder,
            singleBranch: true,
            depth: 1
        })

        console.log('git.branch', branchName)
        await git.branch({
            fs,
            dir: repoFolder,
            ref: branchName
        })

        console.log('git.checkout', branchName)
        await git.checkout({
            fs,
            dir: repoFolder,
            ref: branchName
        })

        console.log(
            'write',
            path.join(repoFolder, 'src/data/themes', themeFileName)
        )

        const localThemeData: ThemeData = getLocalThemeData(themeData)

        await fs.promises.writeFile(
            path.join(repoFolder, 'src/data/themes', themeFileName),
            JSON.stringify(localThemeData, undefined, 2)
        )

        console.log('git.add .')
        await git.add({
            fs,
            dir: repoFolder,
            filepath: path.join(repoFolder, 'src/data/themes', themeFileName)
        })

        console.log('git.commit')
        await git.commit({
            fs,
            dir: repoFolder,
            author: {
                name: 'astrobot',
                email: 'astrobot@astro.build'
            },
            message: `Add theme ${themeData.themeName}`
        })

        console.log('git.push')
        await git.push({
            fs,
            http,
            dir: repoFolder,
            remote: 'origin',
            ref: branchName,
            onAuth: () => ({
                username: 'astrobot',
                password: process.env.GITHUB_TOKEN
            })
        })

        console.log('create PR')
        await octokit.pulls.create({
            owner: 'withastro',
            repo: 'astro.build',
            title: `THEME: ${themeData.themeName ?? ''}`,
            body: [
                `**Author**: ${themeData.authorName ?? 'N/A'}`,
                `**Paid or Free**: ${themeData.paidStatus ?? 'N/A'}`,
                `**Repo Link**: ${themeData.repoUrl ?? 'N/A'}`,
                `**Purchase Link**: ${themeData.purchaseUrl ?? 'N/A'}`,
                `**Live Demo Link**: ${themeData.liveDemoUrl ?? 'N/A'}`,
                `**Preview Image**: ${
                    themeData.mainPreviewImage?.url ?? 'N/A'
                }`,
                ``,
                themeData.shortDescription ?? ''
            ].join('\n'),
            head: branchName,
            base: 'main'
        })

        console.log('done!')
    } finally {
        await fs.promises.rm(repoFolder, { recursive: true, force: true })
    } */
}
/* 
function getLocalThemeData(
    themeData: z.infer<typeof themeDataSchema>
): ThemeData {
    const themeImages: Image[] = []
    if (themeData.previewImage1) {
        themeImages.push({
            src: themeData.previewImage1.url,
            alt: ''
        })
    }
    if (themeData.previewImage2) {
        themeImages.push({
            src: themeData.previewImage2.url,
            alt: ''
        })
    }
    if (themeData.previewImage3) {
        themeImages.push({
            src: themeData.previewImage3.url,
            alt: ''
        })
    }
    if (themeData.previewImage4) {
        themeImages.push({
            src: themeData.previewImage4.url,
            alt: ''
        })
    }

    const links: Link[] = []
    if (themeData.purchaseUrl) {
        links.push({
            href: themeData.purchaseUrl,
            text: 'Purchase'
        })
    }

    const localThemeData: ThemeData = {
        title: themeData.themeName,
        description: themeData.shortDescription,
        fullDescription: '',
        image: {
            src: themeData.mainPreviewImage.url,
            alt: `Preview for ${themeData.themeName}`
        },
        images: themeImages,
        categories: [],
        slug: ''
    }

    if (themeData.repoUrl) {
        localThemeData.repoUrl = {
            href: themeData.repoUrl,
            text: 'View Repo'
        }
    }

    if (themeData.liveDemoUrl) {
        localThemeData.demoUrl = {
            href: themeData.liveDemoUrl,
            text: 'View Demo'
        }
    }

    return localThemeData
}
 */
