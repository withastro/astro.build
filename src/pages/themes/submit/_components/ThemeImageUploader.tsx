import { createSignal, For, onMount, Show } from "solid-js"
import type { JSX } from "solid-js/jsx-runtime"
import FileUploadIcon from "~/icons/FileUploadIcon.jsx"

export function ThemeImageUploader() {
	const [featuredImageSource, setFeaturedImageSource] = createSignal<string>()
	const [additionalImageSources, setAdditionalImageSources] = createSignal<string[]>([])

	const featuredImageInput = (
		<input
			name="featuredImage"
			aria-label="Featured Theme Image"
			type="file"
			accept="image/*"
			required
			class="absolute inset-0 cursor-pointer opacity-0 s-full"
			onInput={(event) => {
				const file = event.currentTarget.files?.[0]
				if (!file) return

				setFeaturedImageSource(URL.createObjectURL(file))
			}}
		/>
	)

	const additionalImagesInput = (
		<input
			name="additionalImages"
			aria-label="Additional Theme Images"
			type="file"
			accept="image/*"
			multiple
			class="absolute inset-0 cursor-pointer opacity-0 s-full"
			onInput={(event) => {
				const files = event.currentTarget.files
				if (!files?.length) return

				setAdditionalImageSources([...files].map((file) => URL.createObjectURL(file)))
			}}
		/>
	)

	// the inputs might be populated from the user going back
	onMount(() => {
		if (featuredImageInput instanceof HTMLInputElement && featuredImageInput.files?.[0]) {
			setFeaturedImageSource(URL.createObjectURL(featuredImageInput.files[0]))
		}
		if (additionalImagesInput instanceof HTMLInputElement && additionalImagesInput.files?.length) {
			setAdditionalImageSources(
				[...additionalImagesInput.files].map((file) => URL.createObjectURL(file)),
			)
		}
	})

	return (
		<div class="grid gap-4 fluid-cols-64">
			<div class="relative col-start-1 col-end-[-1]">
				<ImagePlaceholder previewSrc={featuredImageSource()}>
					<FeaturedImageContent />
					{featuredImageInput}
				</ImagePlaceholder>
			</div>

			<For each={additionalImageSources()}>
				{(src) => (
					<button
						type="button"
						title="Replace Images"
						class="rounded-2xl ring-2 ring-transparent transition focus:outline-none focus:ring-purple-500"
						onClick={() => {
							if (additionalImagesInput instanceof HTMLInputElement) {
								additionalImagesInput.click()
							}
						}}
					>
						<ImagePlaceholder previewSrc={src}>
							<p class="text-center text-xl font-light">Replace Images</p>
						</ImagePlaceholder>
					</button>
				)}
			</For>

			<div class={additionalImageSources().length > 0 ? "sr-only" : ""}>
				<ImagePlaceholder>
					<AdditionalImageContent />
					{additionalImagesInput}
				</ImagePlaceholder>
			</div>
		</div>
	)
}

function ImagePlaceholder(props: { children?: JSX.Element; previewSrc?: string }) {
	return (
		<div class="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-astro-gray-300 bg-astro-gray-600 ring-2 ring-transparent transition focus-within:ring-purple-500 hover:brightness-90">
			{props.children}
			<Show when={props.previewSrc} keyed>
				{(src) => (
					<img
						src={src}
						alt=""
						class="pointer-events-none absolute inset-0 object-cover transition s-full group-hover:opacity-25"
					/>
				)}
			</Show>
		</div>
	)
}

function FeaturedImageContent() {
	return (
		<section class="flex flex-col items-center justify-center text-center font-light">
			<FeaturedImageGraphic />
			<h3 class="mb-3 text-2xl leading-tight">
				Featured Theme Image
				<span title="Required" class="text-red-500">
					*
				</span>
			</h3>
			<p class="mb-6 text-sm leading-tight text-astro-gray-200">
				Drag and drop to upload (max 1 image)
			</p>
			<p class="button button-white button-sm">
				Or Select File
				<FileUploadIcon aria-hidden />
			</p>
		</section>
	)
}

function AdditionalImageContent() {
	return (
		<section class="flex flex-col items-center justify-center p-4 text-center font-light">
			<h3 class="text-xl">Additional Theme Images</h3>
			<p class="mb-2 text-sm text-astro-gray-200">Drag and drop to upload (max 4 images)</p>
			<p class="button button-sm button button-white h-8 px-3">
				Or Select Files
				<FileUploadIcon aria-hidden />
			</p>
		</section>
	)
}

function FeaturedImageGraphic(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
	return (
		<svg
			width="74"
			height="73"
			viewBox="0 0 74 73"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g filter="url(#filter0_f_773_2923)">
				<path
					d="M57 39.9999C56.2044 39.9999 55.4413 40.316 54.8787 40.8786C54.3161 41.4412 54 42.2043 54 42.9999V44.1399L49.56 39.6999C47.9923 38.1446 45.8734 37.2718 43.665 37.2718C41.4566 37.2718 39.3377 38.1446 37.77 39.6999L35.67 41.7999L28.23 34.3599C26.6404 32.8467 24.5297 32.0028 22.335 32.0028C20.1403 32.0028 18.0296 32.8467 16.44 34.3599L12 38.7999V21.9999C12 21.2043 12.3161 20.4412 12.8787 19.8786C13.4413 19.316 14.2044 18.9999 15 18.9999H36C36.7956 18.9999 37.5587 18.6839 38.1213 18.1213C38.6839 17.5586 39 16.7956 39 15.9999C39 15.2043 38.6839 14.4412 38.1213 13.8786C37.5587 13.316 36.7956 12.9999 36 12.9999H15C12.6131 12.9999 10.3239 13.9481 8.63604 15.636C6.94821 17.3238 6 19.613 6 21.9999V57.9999C6 60.3869 6.94821 62.6761 8.63604 64.3639C10.3239 66.0517 12.6131 66.9999 15 66.9999H51C53.3869 66.9999 55.6761 66.0517 57.364 64.3639C59.0518 62.6761 60 60.3869 60 57.9999V42.9999C60 42.2043 59.6839 41.4412 59.1213 40.8786C58.5587 40.316 57.7956 39.9999 57 39.9999ZM15 60.9999C14.2044 60.9999 13.4413 60.6839 12.8787 60.1213C12.3161 59.5586 12 58.7956 12 57.9999V47.2899L20.7 38.5899C21.1407 38.1699 21.7262 37.9356 22.335 37.9356C22.9438 37.9356 23.5293 38.1699 23.97 38.5899L33.48 48.0999L46.38 60.9999H15ZM54 57.9999C53.9957 58.5742 53.8063 59.1318 53.46 59.5899L39.93 45.9999L42.03 43.8999C42.2451 43.6804 42.5018 43.506 42.7851 43.387C43.0684 43.2679 43.3727 43.2066 43.68 43.2066C43.9873 43.2066 44.2916 43.2679 44.5749 43.387C44.8582 43.506 45.1149 43.6804 45.33 43.8999L54 52.6299V57.9999ZM68.13 13.8699L59.13 4.86993C58.8447 4.59681 58.5083 4.38272 58.14 4.23993C57.4096 3.93988 56.5904 3.93988 55.86 4.23993C55.4917 4.38272 55.1553 4.59681 54.87 4.86993L45.87 13.8699C45.5903 14.1496 45.3684 14.4817 45.217 14.8472C45.0656 15.2127 44.9877 15.6044 44.9877 15.9999C44.9877 16.7988 45.3051 17.565 45.87 18.1299C46.4349 18.6948 47.2011 19.0122 48 19.0122C48.7989 19.0122 49.5651 18.6948 50.13 18.1299L54 14.2299V30.9999C54 31.7956 54.3161 32.5586 54.8787 33.1212C55.4413 33.6839 56.2044 33.9999 57 33.9999C57.7956 33.9999 58.5587 33.6839 59.1213 33.1212C59.6839 32.5586 60 31.7956 60 30.9999V14.2299L63.87 18.1299C64.1489 18.4111 64.4807 18.6343 64.8463 18.7866C65.2118 18.9389 65.604 19.0173 66 19.0173C66.396 19.0173 66.7882 18.9389 67.1537 18.7866C67.5193 18.6343 67.8511 18.4111 68.13 18.1299C68.4112 17.851 68.6344 17.5192 68.7867 17.1537C68.939 16.7881 69.0174 16.396 69.0174 15.9999C69.0174 15.6039 68.939 15.2118 68.7867 14.8462C68.6344 14.4806 68.4112 14.1488 68.13 13.8699V13.8699Z"
					fill="url(#paint0_linear_773_2923)"
				></path>
			</g>
			<defs>
				<filter
					id="filter0_f_773_2923"
					x="-4"
					y="-3"
					width="80"
					height="80"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="BackgroundImageFix"
						result="shape"
					></feBlend>
					<feGaussianBlur
						stdDeviation="2"
						result="effect1_foregroundBlur_773_2923"
					></feGaussianBlur>
				</filter>
				<linearGradient
					id="paint0_linear_773_2923"
					x1="69.0174"
					y1="4.0149"
					x2="-7.0376"
					y2="35.9587"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#4AF2C8"></stop>
					<stop offset="1" stop-color="#2F4CB3"></stop>
				</linearGradient>
			</defs>
		</svg>
	)
}
