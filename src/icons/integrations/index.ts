import type { CollectionEntry } from "astro:content";
import { randomFromArray } from "~/helpers/random.js";
import ApproveUserIcon from "./ApproveUserIcon.jsx";
import CheckCircleIcon from "./CheckCircleIcon.jsx";
import CompressIcon from "./CompressIcon.jsx";
import GridIcon from "./GridIcon.jsx";
import ImageIcon from "./ImageIcon.jsx";
import PuzzleIcon from "./PuzzleIcon.jsx";
import ResizeImageIcon from "./ResizeImageIcon.jsx";
import RobotIcon from "./RobotIcon.jsx";
import SearchFileIcon from "./SearchFileIcon.jsx";
import SitemapIcon from "./SitemapIcon.jsx";

const categoryIcons = new Map([
	["frameworks", [PuzzleIcon, GridIcon]],
	["adapters", [PuzzleIcon, GridIcon, CompressIcon]],
	["css+ui", [CompressIcon, GridIcon, ImageIcon, ResizeImageIcon, PuzzleIcon]],
	[
		"performance+seo",
		[ApproveUserIcon, CheckCircleIcon, CompressIcon, RobotIcon, SearchFileIcon, SitemapIcon],
	],
	["analytics", [CheckCircleIcon, CompressIcon, SearchFileIcon]],
	["accessibility", [ApproveUserIcon, CheckCircleIcon]],
	["other", [CheckCircleIcon, GridIcon, PuzzleIcon, SitemapIcon]],
]);

export function iconForCategory(category: string) {
	return (
		randomFromArray(categoryIcons.get(category) ?? categoryIcons.get("other") ?? []) ?? PuzzleIcon
	);
}

export function iconForIntegration(integration: CollectionEntry<"integrations">) {
	const icons = integration.data.categories.flatMap(
		(category) => categoryIcons.get(category) ?? [],
	);

	return randomFromArray(icons) ?? PuzzleIcon;
}
