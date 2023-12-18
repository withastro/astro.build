import type { APIRoute } from "astro"
import { integrations as LAST_MODIFIED } from "~/data/last-modified.json"
import {
	getFilteredIntegrations,
	validateCategories,
	validCategories,
} from "~/helpers/integrations.ts"
import { paginate } from "~/helpers/paginate.ts"

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

	const getParam = createParamGetter(ctx.url.searchParams)
	const search = getParam("search")
	// Replace spaces with `+` because the "+" character is decoded as " "
	const categories = (getParam("categories[]") ?? []).map((category) =>
		category.trim().replace(/\s+/g, "+"),
	)

	// with '[...page]' rest routes we'll get undefined for the first page, default that to 1
	// otherwise, try to parse the page number from the URL
	const currentPage = typeof ctx.params.page === "undefined" ? 1 : parseInt(ctx.params.page)
	const limit = ctx.url.searchParams.get("limit")
	let pageSize = 25

	if (limit) {
		try {
			pageSize = toInt(limit)
		} catch {
			return Response.json(
				{ error: `Invalid "limit" parameter: "${limit}" is not a number` },
				{ status: 400 },
			)
		}
	}
	if (!validateCategories(categories)) {
		return Response.json(
			{
				error: `Invalid "categories[]" parameter: supported values are ${validCategories
					.map((v: string) => `"${v}"`)
					.join(` | `)}`,
			},
			{ status: 400 },
		)
	}
	const filteredIntegrations = await getFilteredIntegrations({ search, categories })

	// take all matching integrations and create a paginated list of results
	const paginatedResults = paginate({
		data: filteredIntegrations,
		pageSize,
		currentPage,
		route: "/api/v1/integrations/[...page]",
		searchParams: ctx.url.searchParams,
	})

	const { page, allPages } = paginatedResults

	// make sure the requested page number is valid
	if (allPages.length && !page) {
		return Response.json(
			{ error: `Invalid request: page ${currentPage} does not exist` },
			{ status: 400 },
		)
	}

	const responseData = {
		...page,
		data: page.data.map(({ data }) => {
			if (data.image) data.image = new URL(data.image, ctx.url).toString()
			return data
		}),
	}

	return Response.json(responseData, { headers })
}

export const ALL: APIRoute = ({ request }) => {
	return Response.json({ error: `${request.method} not allowed` }, { status: 405 })
}

function toInt(str: string): number {
	const value = Number.parseInt(str)
	if (Number.isNaN(value)) {
		throw new Error(`"${str}" is not a valid number`)
	}
	return value
}

function createParamGetter(searchParams: URLSearchParams) {
	function getter(key: `${string}[]`): string[] | undefined
	function getter(key: string): string | undefined
	function getter(key: string) {
		if (key.endsWith("[]")) return searchParams.getAll(key) || undefined
		return searchParams.get(key) || undefined
	}
	return getter
}
