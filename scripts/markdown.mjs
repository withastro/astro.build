const LINK_REGEX = /\[(?<text>.+)\]\((?<url>[^ ]+)(?: "(?<title>.+)")?\)/;

export function stringifyLinks(content) {
	if (!content) {
		return undefined;
	}

	return content.replace(LINK_REGEX, (matched) => LINK_REGEX.exec(matched).groups?.text || matched);
}
