import type { JSX } from "solid-js"

export default function ImageUploadIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M21 15v3h3v2h-3v3h-2v-3h-3v-2h3v-3zm.008-12c.548 0 .992.445.992.993V13h-2V5H4v13.999L14 9l3 3v2.829l-3-3L6.827 19H14v2H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3zM8 7a2 2 0 1 1 0 4a2 2 0 0 1 0-4"
			/>
		</svg>
	)
}
