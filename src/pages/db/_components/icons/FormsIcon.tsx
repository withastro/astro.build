import type { JSX } from "solid-js"

export default function FormsIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16M11 7h2v2h-2zm0 4h2v6h-2z"
			/>
		</svg>
	)
}
