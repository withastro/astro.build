import fs from 'node:fs'
import fetch from 'node-fetch'
import sharp from 'sharp'
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

async function cacheAvatar(member) {
	if (!member.image) {
		return member
	}

	const inputBuffer = await fetch(member.image).then(res => res.buffer())

	const output = `src/data/sponsors/images/${member.id}.jpg`

	await sharp(inputBuffer)
		.resize(128)
		.jpeg({ mozjpeg: true })
		.toFile(output, (error) => {
			if (error) {
				console.error(error)
			}
		})

	return {
		...member,
		image: `/${output}`,
	}
}

async function main() {
	const allMembers = await fetchAllMembers()

	const members = await Promise.all(
		allMembers.filter(isUser).map(normalizeMember).map(cacheAvatar)
	)

	fs.writeFileSync(
		'src/data/sponsors.json',
		JSON.stringify({ members }, null, 4)
	)
}

main()
