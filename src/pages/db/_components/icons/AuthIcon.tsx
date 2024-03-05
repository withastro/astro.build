import type { JSX } from "solid-js"

export default function AuthIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M6 8V7a6 6 0 1 1 12 0v1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm13 2H5v10h14zm-8 5.732A2 2 0 0 1 12 12a2 2 0 0 1 1 3.732V18h-2zM8 8h8V7a4 4 0 0 0-8 0z"
			/>
		</svg>
	)
}
