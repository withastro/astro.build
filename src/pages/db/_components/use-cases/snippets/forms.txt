import type { APIRoute } from "astro"
import { db, Messages } from "astro:db"

export const POST: APIRoute = async ({ request }) => {
	const { firstName, lastName, email, phoneNumber, message } = await request.json()

	await db.insert(Messages).values({
		firstName,
		lastName,
		email,
		phoneNumber,
		message,
	})

	return Response.json({ success: true })
}
