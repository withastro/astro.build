import fs from 'node:fs'
import { orgApi } from './github.mjs'

async function main() {
    const stars = await orgApi('withastro').repo('astro').fetchStars()

    fs.writeFileSync(
		'src/data/monorepo.json',
		JSON.stringify({ stars }, null, 4)
	)
}

main()
