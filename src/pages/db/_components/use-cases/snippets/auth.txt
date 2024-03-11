import type { APIRoute } from "astro"

import { lucia } from "@lib/auth";
import { Argon2id } from "oslo/password"

import { db, Users, eq } from 'astro:db'

export const POST: APIRoute = async (context) => {
	const formData = await context.request.formData()
	const username = formData.get("username")
	const password = formData.get("password")

	const user = await db.select()
		.from(Users)
		.where(eq(Users.username, username))
		.get()

	if (!user) {
		return new Response("Incorrect username or password", {
			status: 400
		})
	}

	const validPassword = await new Argon2id().verify(user.password, password)
	if (!validPassword) {
		return new Response("Incorrect username or password", {
			status: 400
		})
	}

	const session = await lucia.createSession(user.userId, {})
	const sessionCookie = lucia.createSessionCookie(session.id)
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

	return context.redirect("/")
}
