import type { CollectionEntry } from 'astro:content';
import { randomFromArray } from '~/helpers/random.js';

const categoryIcons = new Map([
	['frameworks', ['integrations/puzzle', 'integrations/grid']],
	['adapters', ['integrations/puzzle', 'integrations/grid', 'integrations/compress']],
	[
		'css+ui',
		[
			'integrations/compress',
			'integrations/grid',
			'integrations/image',
			'integrations/resize-image',
			'integrations/puzzle',
		],
	],
	[
		'performance+seo',
		[
			'integrations/approve-user',
			'approval-check',
			'integrations/compress',
			'integrations/robot',
			'integrations/search-file',
			'integrations/sitemap',
		],
	],
	['analytics', ['approval-check', 'integrations/compress', 'integrations/search-file']],
	['accessibility', ['integrations/approve-user', 'approval-check']],
	['other', ['approval-check', 'integrations/grid', 'integrations/puzzle', 'integrations/sitemap']],
]);

export function iconForIntegration(integration: CollectionEntry<'integrations'>) {
	const icons = integration.data.categories.flatMap(
		(category) => categoryIcons.get(category) ?? [],
	);

	return randomFromArray(icons) ?? 'integrations/puzzle';
}
