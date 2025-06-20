import xss from 'xss';

/** Matches `https://*.astro.build/*` and `https://github.com/withastro/*` */
const officialDomainRE = /^https:\/\/(?:(?:[^/]+\.)?astro.build|github\.com\/withastro)(?:\/.*)?$/i;

/** Extracts the value of a link’s `href` attribute to a named `href` group. */
const hrefRE = /<a .*href="(?<href>[^"]+)".*>/i;

export const sanitizeThemeDescription = (text: string) =>
	xss(text, {
		whiteList: {
			p: [],
			strong: [],
			br: [],
			em: [],
			u: [],
			ol: [],
			ul: [],
			li: [],
			blockquote: [],
			pre: [],
			h2: [],
			h3: [],
			a: ['href'],
			span: [],
		},
		onTag(tag, html, options) {
			if (tag !== 'a' || options.isClosing) return;
			const matches = html.match(hrefRE);
			if (matches?.groups?.href && officialDomainRE.test(matches.groups.href)) {
				// Don’t modify links to official domains
				return;
			}
			// Add `rel` attribute to unofficial links.
			return html.replace(/>$/, ' rel="nofollow ugc">');
		},
	});
