import fs from 'node:fs'
import { fetchAllMembers } from './opencollective.mjs'

const skipTier = new Set(['Platinum Sponsor', 'Gold Sponsor'])
function isUser(user) {
	return user.role === 'BACKER' && !skipTier.has(user.tier)
}

function normalizeMember(member) {
	return {
		id: member.MemberId,
		name: member.name,
		image: member.image,
		initials: member.name
			.split(' ')
			.slice(0, 2)
			.map(word => word[0].toUpperCase())
			.join(''),
		href: member.website ?? member.twitter ?? member.github,
	}
}

async function main() {
	const allMembers = await fetchAllMembers()

	const members = await Promise.all(
		allMembers.filter(isUser).map(normalizeMember)
	)

	fs.writeFileSync(
		'src/data/sponsors.json',
		JSON.stringify({ members }, null, 4)
	)
}

main()
