import fs from 'node:fs'
import sizeOf from 'image-size'
import fetch from 'node-fetch'
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

async function withCachedImage(member) {
	if (!member.image) {
		return member
	}

	let image = undefined

	try {
		const resp = await fetch(member.image)
		const buffer = await resp.buffer()
		const { type } = sizeOf(buffer)
		image = `images/${member.id}.${type}`
		fs.writeFileSync(`src/data/sponsors/${image}`, buffer)
	} catch (err) { console.error(err) }

	return {
		...member,
		image: image && `./${image}`
	}
}

async function main() {
	const allMembers = await fetchAllMembers()

	const members = await Promise.all(
		allMembers.filter(isUser).map(normalizeMember).map(withCachedImage)
	)

	fs.writeFileSync(
		'src/data/sponsors.json',
		JSON.stringify({ members }, null, 4)
	)
}

main()
