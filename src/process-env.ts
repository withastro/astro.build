import { z } from "zod"

const schema = z.object({
	SUBMISSION_DISCORD_WEBHOOK_URL: z.string(),
	SUBMISSION_DISCORD_WEBHOOK_THREAD_ID: z.string(),
})

export function env() {
	const result = schema.safeParse(import.meta.env)
	if (!result.success) {
		throw new Error(
			`Missing environment variables: ${result.error.issues
				.map((issue) => issue.path.join("."))
				.join(", ")}`,
		)
	}

	return result.data
}
