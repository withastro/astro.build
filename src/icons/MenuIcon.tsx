import type { JSX } from "solid-js/jsx-runtime"
export default function MenuIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	return (
		<svg
			width="24"
			height="17"
			viewBox="0 0 24 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<line y1="0.5" x2="24" y2="0.5" stroke="currentColor" />
			<line y1="8.5" x2="24" y2="8.5" stroke="currentColor" />
			<line y1="16.5" x2="24" y2="16.5" stroke="currentColor" />
		</svg>
	)
}
