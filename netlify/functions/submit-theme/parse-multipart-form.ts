import { Event } from '@netlify/functions/dist/function/event.js'
import Busboy from 'busboy'
import { File, FormData } from 'node-fetch'

export type FileInfo = {
    filename: string
    mimeType: string
    encoding: string
    data: Buffer
}

export type ParsedMultipartForm = {
    textFields: Record<string, string[]>
    files: Record<string, FileInfo[]>
}

// https://netlify.app/blog/2021/07/29/how-to-process-multipart-form-data-with-a-netlify-function/
export function parseMultipartForm(
    body: string | Buffer,
    headers: Event['headers']
) {
    return new Promise<FormData>((resolve, reject) => {
        const formData = new FormData()

        Busboy({ headers })
            .on('file', (name, stream, info) => {
                const chunks: Buffer[] = []

                stream.on('data', (chunk) => {
                    chunks.push(chunk)
                })

                stream.on('end', () => {
                    if (chunks.length === 0) return
                    formData.append(
                        name,
                        new File(chunks, info.filename, { type: info.mimeType })
                    )
                })
            })
            .on('field', (name, value) => {
                formData.append(name, value)
            })
            .on('finish', () => {
                resolve(formData)
            })
            .on('error', reject)
            .end(body)
    })
}
