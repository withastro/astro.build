import type { JSX } from "solid-js"

export default function CommentsIcon( props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10H2l2.929-2.929A9.969 9.969 0 0 1 2 12m4.828 8H12a8 8 0 1 0-8-8c0 2.152.851 4.165 2.343 5.657l1.414 1.414zM8 13h8a4 4 0 0 1-8 0"
			/>
		</svg>
	)
}
