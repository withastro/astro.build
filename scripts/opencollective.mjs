import fetch from 'node-fetch'

function fetchJson(url) {
	return fetch(url).then(res => res.json())
}

const MEMBERS_URL = 'https://opencollective.com/astrodotbuild/members.json'

export function fetchAllMembers() {
	return fetchJson(MEMBERS_URL)
}
