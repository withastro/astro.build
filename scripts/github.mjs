if (!process.env.GITHUB_TOKEN) {
	throw new Error("GITHUB_TOKEN env variable must be set to run.")
}

function fetchJson(url) {
	return fetch(url, {
		headers: {
			Authorization: "token " + process.env.GITHUB_TOKEN,
			"User-Agent": "chrome",
		},
	}).then((res) => {
		if (res.status >= 400) {
			console.error(res.status, res.statusText)
			throw new Error(res.statusText)
		}

		return res.json()
	})
}

/**
 * Takes in one or more list of github users and returns a filter
 * function that returns `true` if the user is only listed once or
 * `false` if the user is in more than one list.
 *
 * @param  {User[][]} lists One or more list of github users
 * @returns {Function} Filter function that returns true if the user is only included in one list
 */
export function loginIsUniq(...lists) {
	return function withUser(user) {
		return !lists.some((list) => list.some((a) => a.login === user.login))
	}
}

/**
 * Parses out username/organization and repository name from a github url.
 * If the url doesn't point to the root of a repository, undefined is returned.
 *
 * @param {String} repoUrl URL of the url, ex: https://github.com/withastro/astro
 * @returns
 */
export function parseRepoUrl(repoUrl) {
	try {
		const url = new URL(repoUrl)
		const parts = url.pathname.split("/").filter(Boolean)
		return {
			org: parts[0],
			repo: parts[1],
		}
	} catch (err) {
		console.error(repoUrl, err)
		return []
	}
}

/**
 * Gets API helpers for a github organization or user.
 *
 * @param {String} org Github organization or username
 * @returns API helpers for the github team and repository
 */
export function orgApi(org) {
	function teamApi(team) {
		/**
		 * Fetches the list of members for a github organization and team.
		 *
		 * @param {Number | undefined} count (optional) Maximum number of results to fetch
		 * @returns {Promise} JSON list of github members
		 */
		function fetchMembers(count) {
			const url = new URL(`https://api.github.com/orgs/${org}/teams/${team}/members`)
			if (count) {
				url.searchParams.set("per_page", count)
			}

			return fetchJson(url.toString())
		}

		return {
			fetchMembers,
		}
	}

	function repoApi(repo) {
		/**
		 *
		 * @param {Number | undefined} count (optional) Maxmimum number of results to fetch
		 * @returns {Promise} JSON list of github members
		 */
		function fetchContributors(count) {
			const url = new URL(`https://api.github.com/repos/${org}/${repo}/contributors`)
			if (count) {
				url.searchParams.set("per_page", count)
			}

			return fetchJson(url.toString())
		}

		/**
		 * Gets the current number of stars for the github repository.
		 *
		 * @returns {Promise} number of stars for the github repo
		 */
		async function fetchStars() {
			const url = new URL(`https://api.github.com/repos/${org}/${repo}`)

			return fetchJson(url.toString())
				.then((res) => res.stargazers_count)
				.catch((error) => {
					console.warn(`[fetchStars] ${org}/${repo}`, error.message)
					return 0
				})
		}

		return {
			fetchContributors,
			fetchStars,
		}
	}

	function userApi() {
		/**
		 *
		 * @returns {Promise} JSON data for the github user or org account
		 */
		function fetchUser() {
			const url = new URL(`https://api.github.com/users/${org}`)
			return fetchJson(url.toString())
		}

		return {
			fetchUser,
		}
	}

	function orgApi() {
		function fetchOrg() {
			const url = new URL(`https://api.github.com/orgs/${org}`)
			return fetchJson(url.toString())
		}

		return {
			fetchOrg,
		}
	}

	return {
		team: teamApi,
		repo: repoApi,
		user: userApi,
		org: orgApi,
	}
}
