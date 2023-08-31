import fetch, { FormData, Headers, type Response } from "node-fetch"
import { posix } from "node:path"
import { z } from "zod"

const discordMessageAttachmentSchema = z.object({
	filename: z.string(),
	url: z.string(),
	width: z.number().optional(),
	height: z.number().optional(),
	content_type: z.string().optional(),
})

const discordWebhookMessageSchema = z.object({
	id: z.string(),
	content: z.string(),
	attachments: z.array(discordMessageAttachmentSchema),
})
export type DiscordWebhookMessage = z.infer<typeof discordWebhookMessageSchema>

export async function executeDiscordWebhook(webhookUrl: string, options: MessageOptions) {
	const response = await sendMessage(webhookUrl, options, "POST")
	if (!response.ok) {
		throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`)
	}
	return discordWebhookMessageSchema.parse(await response.json())
}

export async function editDiscordWebhookMessage(
	url: string,
	messageId: string,
	options: MessageOptions,
) {
	const { origin, pathname } = new URL(url)
	const messageUrl = origin + posix.join("/", pathname, "messages", messageId)

	const response = await sendMessage(messageUrl, options, "PATCH")
	if (!response.ok) {
		throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`)
	}

	return discordWebhookMessageSchema.parse(await response.json())
}

type MessageOptions = {
	content?: string
	files?: File[]
	threadId?: string
}

function sendMessage(
	inputUrl: string,
	{ threadId, ...options }: MessageOptions,
	method: "POST" | "PATCH" | "PUT",
): Promise<Response> {
	const url = new URL(inputUrl)
	if (threadId) url.searchParams.set("thread_id", threadId)

	let body: string | FormData
	const headers = new Headers()

	if (options.files) {
		const { files, ...jsonPayload } = options
		body = new FormData()
		for (const [index, value] of files.entries()) {
			body.append(`files[${index}]`, value)
		}
		body.append("payload_json", JSON.stringify(jsonPayload))
	} else {
		body = JSON.stringify(options)
		headers.append("Content-Type", "application/json")
	}

	return fetch(url.href, { method, body, headers })
}
