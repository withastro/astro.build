import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString as mdastToString } from 'mdast-util-to-string';

/**
 * Convert Markdown content to plain text.
 * @param content {string | undefined}
 */
export function markdownToPlainText(content) {
	if (!content) return undefined;
	return mdastToString(fromMarkdown(content));
}
