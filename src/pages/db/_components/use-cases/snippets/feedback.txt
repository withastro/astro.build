import type { APIRoute } from "astro"
import { db, Feedback, sql } from "astro:db"

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData()
	const { url, feedback: key } = Object.fromEntries(formData.entries())

	if (key === "positive" || key === "negative") {
		const feedback = { url, [key]: sql`${Feedback[key]} + 1` }
		await db.insert(Feedback)
			.values(feedback)
			.onConflictDoUpdate({ target: Feedback.url, set: feedback })
	}
	
	return Response.json({ success: true })
}
