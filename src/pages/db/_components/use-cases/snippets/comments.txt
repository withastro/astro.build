import type { APIRoute } from "astro"
import { db, Comments } from "astro:db"

export const POST: APIRoute = async ({ request }) => {
	const { body, blogPostId } = await request.json()

	await db.insert(Comments).values({
		authorId: "12345",
		postId: blogPostId,
		body,
	})

	return Response.json({ success: true })
}
