import type { JSX } from "solid-js"

export default function ChevronIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	return (
		<svg
			width="22"
			height="13"
			viewBox="0 0 22 13"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M1 1L11 11L21 1" stroke="currentColor" stroke-width="2"></path>
		</svg>
	)
}
