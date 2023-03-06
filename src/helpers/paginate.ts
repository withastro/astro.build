import type { Page } from "astro"

export type PaginateOptions<T> = {
	data: T[]
	pageSize?: number
	currentPage?: number
	route: string
	searchParams?: URLSearchParams
}

export const paginate = <T>({
	data,
	pageSize = 15,
	currentPage = 1,
	route,
	searchParams,
}: PaginateOptions<T>) => {
	const lastPage = Math.max(1, Math.ceil(data.length / pageSize))
	// to match Astro's built-in paginate() API, don't include numbers for rest routes
	const includesFirstPageNumber = !route.includes("[...page]")

	function pageNumToUrl(pageNum: number) {
		// replace the [page] and [...page] route params with the actual page number
		// if it's the first page of a rest route, just trim off the page number param
		const pageRoute = route.replace(
			/\[\.{0,3}page]/,
			includesFirstPageNumber ? String(pageNum) : pageNum > 1 ? String(pageNum) : "",
		)

		// append the search params, if provided
		const search = searchParams?.toString()

		return [pageRoute, search].filter(Boolean).join("?")
	}

	// create a list of all pages, matching the structure used by Astro's paginate() function
	const allPages: Page<T>[] = [...Array(lastPage).keys()].map((num) => {
		const pageNum = num + 1

		const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize // currentPage is 1-indexed
		const end = Math.min(start + pageSize, data.length)

		return {
			data: data.slice(start, end),
			start,
			end: end - 1,
			size: pageSize,
			total: data.length,
			currentPage,
			lastPage,
			url: {
				current: pageNumToUrl(pageNum),
				next: pageNum === lastPage ? undefined : pageNumToUrl(pageNum + 1),
				prev: pageNum === 1 ? undefined : pageNumToUrl(pageNum - 1),
			},
		}
	})

	return {
		page: allPages[currentPage - 1],
		allPages: allPages.map((page) => page.url.current),
	}
}

export type PageLink = {
	pageNum: number
	text: string
	href: string
}

export type Ellipsis = {
	text: string
	pageNum?: never
	href?: never
}

// clamps the list of pages to show at most 5 pages
// TODO: the use of inline ellipsis text here is a little gross
export function collapseRange(
	page: Page<unknown>,
	pages: Array<PageLink>,
): Array<PageLink | Ellipsis> {
	const total = pages.length
	const max = 5

	// only need ellipsis if we have more pages than we can display
	const needEllipsis = total > max

	// show start ellipsis if the current page is further away than max - 3 from the first page
	const hasStartEllipsis = needEllipsis && page.currentPage > max - 2
	// show end ellipsis if the current page is further than total - total + 2 from the last page
	const hasEndEllipsis = needEllipsis && page.currentPage < total - 2

	if (!needEllipsis) {
		return pages
	}

	if (hasStartEllipsis && !hasEndEllipsis) {
		return [pages[0], { text: "..." }, ...pages.slice(Math.min(page.currentPage - 2, total - 3))]
	}

	if (!hasStartEllipsis && hasEndEllipsis) {
		return [
			...pages.slice(0, Math.max(3, page.currentPage + 1)),
			{ text: "..." },
			pages[pages.length - 1],
		]
	}

	// we have both start and end ellipsis
	return [
		pages[0],
		{ text: "..." },
		...pages.slice(page.currentPage - 2, page.currentPage + 1),
		{ text: "..." },
		pages[pages.length - 1],
	]
}
