import { Event } from '@netlify/functions/dist/function/event.js'
import Busboy from 'busboy'

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
export function parseMultipartForm(event: Event) {
    return new Promise<ParsedMultipartForm>((resolve, reject) => {
        const textFields: Record<string, string[]> = {}
        const files: Record<string, FileInfo[]> = {}

        const busboy = Busboy({
            headers: event.headers
        })

        busboy.on('file', (name, stream, info) => {
            const chunks: Buffer[] = []

            stream.on('data', (chunk) => {
                chunks.push(chunk)
            })

            stream.on('end', () => {
                if (chunks.length === 0) return
                files[name] ??= []
                files[name].push({
                    filename: info.filename,
                    mimeType: info.mimeType,
                    encoding: info.encoding,
                    data: Buffer.concat(chunks)
                })
            })
        })

        busboy.on('field', (fieldName, value) => {
            textFields[fieldName] ??= []
            textFields[fieldName].push(value)
        })

        busboy.on('finish', () => {
            resolve({ textFields, files })
        })

        busboy.on('error', reject)

        if (event.isBase64Encoded) {
            busboy.end(Buffer.from(event.body, 'base64'))
        } else {
            busboy.end(event.body)
        }
    })
}
