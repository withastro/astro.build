// @ts-check
import { BackgroundHandler } from '@netlify/functions'
import { Octokit } from '@octokit/rest'
import fs from 'fs'
import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import { kebabCase } from 'lodash-es'
import { tmpdir } from 'os'
import path from 'path'
import { literal, number, object, string, union } from 'zod'

const now = Date.now()

const repoUrl = 'https://github.com/withastro/astro.build.git'
const repoFolder = path.join(tmpdir(), `astro.build-${now}`)

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

export const handler: BackgroundHandler = async (event) => {
    try {
        const body = event.isBase64Encoded
            ? JSON.parse(Buffer.from(event.body, 'base64').toString())
            : JSON.parse(event.body)

        const themeData = themeDataSchema.parse(body?.data)

        const branchName = `theme-submissions/${kebabCase(
            themeData.themeName
        )}-${now}`

        const themeFileName = `${kebabCase(themeData.themeName)}-${now}.json`

        await fs.promises.mkdir(path.dirname(repoFolder), { recursive: true })

        // await execa('git', ['clone', repoUrl, repoFolder])
        await git.clone({
            fs,
            http,
            url: repoUrl,
            dir: repoFolder,
            singleBranch: true,
            depth: 1
        })

        // await execa('git', ['switch', '-c', branchName], { cwd: repoFolder })
        await git.checkout({
            fs,
            dir: repoFolder,
            ref: branchName
        })

        await fs.promises.writeFile(
            path.join(repoFolder, 'src/data/themes', themeFileName),
            JSON.stringify(themeData, undefined, 2)
        )

        // await execa('git', ['add', '.'], { cwd: repoFolder })
        await git.add({
            fs,
            dir: repoFolder,
            filepath: '.'
        })

        // await execa(
        //     'git',
        //     ['commit', '-m', `Add theme ${themeData.themeName}`],
        //     { cwd: repoFolder }
        // )
        await git.commit({
            fs,
            dir: repoFolder,
            message: `Add theme ${themeData.themeName}`
        })

        // await execa('git', ['push', 'origin', branchName], { cwd: repoFolder })
        await git.push({
            fs,
            http,
            dir: repoFolder,
            remote: 'origin',
            ref: branchName
        })

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
    } finally {
        await fs.promises.rm(repoFolder, { recursive: true, force: true })
    }
}
