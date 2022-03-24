import fs from 'node:fs'
import { loginIsUniq, orgApi } from './github.mjs'

if (!process.env.GITHUB_TOKEN) {
	throw new Error('GITHUB_TOKEN env variable must be set to run.')
}
async function main() {
	const api = orgApi('withastro')

	const [staff, _l3, _l2, _l1] = await Promise.all([
		api.team('staff').fetchMembers(),
		api.team('maintainers-core').fetchMembers(),
		api.team('maintainers').fetchMembers(),
		api.repo('astro').fetchContributors(100),
	])

	const l3 = _l3.filter(loginIsUniq(staff))
	const l2 = _l2.filter(loginIsUniq(staff, l3))
	const l1 = _l1.filter(loginIsUniq(staff, l3, l2))

	fs.writeFileSync(
		'src/data/contributors.json',
		JSON.stringify({ staff, l3, l2, l1 })
	)
}

main()
