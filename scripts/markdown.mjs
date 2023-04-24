const LINK_REGEX = /\[(?<text>.+)\]\((?<url>[^ ]+)(?: "(?<title>.+)")?\)/

export function stringifyLinks(content) {
	if (!content) {
		return undefined
	}

	return content.replace(LINK_REGEX, function (matched) {
		return LINK_REGEX.exec(matched).groups?.text || matched
	})
}
