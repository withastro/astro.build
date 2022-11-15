import { Handler } from '@netlify/functions'
import { literal, number, object, string, union } from 'zod'

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

export const handler: Handler = async (event, context) => {
    // const themeJson = {
    //     title: getTextField('themeName'),
    //     description: getTextField('shortDescription'),
    //     image: getTextField('mainPreviewImage'),
    //     repoUrl: getTextField('repoUrl'),
    //     purchaseUrl: getTextField('purchaseUrl'),
    //     demoUrl: getTextField('liveDemoUrl'),
    //     paidStatus: getTextField('paidStatus'),
    //     authorName: getTextField('authorName'),
    //     authorEmail: getTextField('authorEmail')
    // }

    let body
    if (event.isBase64Encoded) {
        body = Buffer.from(event.body, 'base64').toString()
    } else {
        body = event.body
    }
    console.log(event.body)

    return {
        statusCode: 200
    }
}
