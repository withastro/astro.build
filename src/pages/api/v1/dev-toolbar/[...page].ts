import type { APIRoute } from "astro"
import { integrations as LAST_MODIFIED } from "~/data/last-modified.json"
import { getFilteredIntegrations } from "~/helpers/integrations.ts"

export const prerender = false

const headers = {
	accept: "application/json",
	"cache-control": "public,max-age=604800,s-max-age=604800,stale-while-revalidate=86400",
	"last-modified": LAST_MODIFIED,
	"Access-Control-Allow-Credentials": "true",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,OPTIONS,HEAD",
	"Access-Control-Allow-Headers":
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, If-Modified-Since, X-Api-Version",
}

export const HEAD: APIRoute = (ctx) => {
	const modified = ctx.request.headers.get("If-Modified-Since")
	if (modified === LAST_MODIFIED) {
		return new Response(null, { status: 304 })
	}
	return Response.json(null, { headers })
}

export const GET: APIRoute = async (ctx) => {
	const modified = ctx.request.headers.get("If-Modified-Since")
	if (modified === LAST_MODIFIED) {
		return new Response(null, { status: 304 })
	}
	const filteredIntegrations = await getFilteredIntegrations({ toolbar: true })
	const sortedIntegrations = filteredIntegrations.sort((a, b) => a.data.toolbar! - b.data.toolbar!)

	const responseData = {
		data: sortedIntegrations.map(({ data }) => {
			if (data.image) data.image = new URL(data.image, ctx.url).toString()
			return data
		}),
	}

	return Response.json(responseData, { headers })
}

export const ALL: APIRoute = ({ request }) => {
	return Response.json({ error: `${request.method} not allowed` }, { status: 405 })
}
