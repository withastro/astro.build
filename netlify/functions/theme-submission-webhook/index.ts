// @ts-check
import { Handler } from '@netlify/functions'
import { Octokit } from '@octokit/rest'
import { execa } from 'execa'
import { mkdir, rm, writeFile } from 'fs/promises'
import { kebabCase } from 'lodash-es'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import { literal, number, object, string, union } from 'zod'

const now = Date.now()

const repoUrl = 'https://github.com/withastro/astro.build.git'
const repoFolder = join(tmpdir(), `astro.build-${now}`)

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const formImageSchema = object({
    filename: string(),
    type: string(),
    size: number(),
    url: string()
})

const themeDataSchema = object({
    mainPreviewImage: formImageSchema,
    previewImage1: union([formImageSchema, literal('')]),
    previewImage2: union([formImageSchema, literal('')]),
    previewImage3: union([formImageSchema, literal('')]),
    previewImage4: union([formImageSchema, literal('')]),
    authorName: string(),
    authorEmail: string(),
    themeName: string(),
    paidStatus: string(),
    repoUrl: string(),
    purchaseUrl: string(),
    liveDemoUrl: string(),
    shortDescription: string()
}).partial()

export const handler: Handler = async (event) => {
    try {
        const body = event.isBase64Encoded
            ? JSON.parse(Buffer.from(event.body, 'base64').toString())
            : JSON.parse(event.body)

        const themeData = themeDataSchema.parse(body?.data)

        const branchName = `theme-submissions/${kebabCase(
            themeData.themeName
        )}-${now}`

        const themeFileName = `${kebabCase(themeData.themeName)}-${now}.json`

        await mkdir(dirname(repoFolder), { recursive: true })
        await execa('git', ['clone', repoUrl, repoFolder])
        await execa('cd', [repoFolder])

        await execa('git', ['switch', '-c', branchName])

        await writeFile(
            join(repoFolder, 'src/data/themes', themeFileName),
            JSON.stringify(themeData, undefined, 2)
        )

        await execa('git', ['add', '.'])
        await execa('git', ['commit', '-m', `Add theme ${themeData.themeName}`])
        await execa('git', ['push', 'origin', branchName])

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

        return {
            statusCode: 200
        }
    } finally {
        await rm(repoFolder, { recursive: true, force: true })
    }
}
