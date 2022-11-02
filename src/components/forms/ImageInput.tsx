import clsx from 'clsx'
import { useState } from 'preact/hooks'
import useHydrated from '../../hooks/useHydrated.js'

const imageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp']

export default function ImageInput(props: {
    name: string
    label: string
    required?: boolean
}) {
    const hydrated = useHydrated()
    const [previewUrl, setPreviewUrl] = useState<string>()

    if (!hydrated) {
        return (
            <label class="w-full">
                <div class="text-sm font-medium leading-none">
                    {props.label}{' '}
                    {props.required && (
                        <span
                            class="text-red-500 text-base align-text-top"
                            aria-hidden
                        >
                            *
                        </span>
                    )}
                </div>
                <input
                    type="file"
                    name={props.name}
                    required={props.required}
                    accept={imageTypes.join(',')}
                />
            </label>
        )
    }

    return (
        <div
            class={clsx(
                'w-full max-w-md aspect-[16/9]',
                'flex flex-col items-center justify-center gap-2',
                'relative group',
                'transition',
                'focus:outline-none',
                'bg-neutral-100 bg-center bg-cover hover:bg-neutral-200',
                'text-neutral-600',
                'border-2 border-dashed border-neutral-400 focus-within:border-primary-400',
                'rounded-md overflow-hidden',
                'cursor-pointer children:cursor-pointer'
            )}
        >
            <span class="text-2xl">
                Preview image{' '}
                {props.required && (
                    <span
                        class="text-red-500 text-base align-text-top"
                        aria-hidden
                    >
                        *
                    </span>
                )}
            </span>
            <span>16:9, 906px wide or larger.</span>
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt=""
                    class="w-full h-full absolute inset-0 object-cover group-hover:opacity-25 transition"
                />
            )}
            <input
                aria-label={props.label}
                type="file"
                name={props.name}
                required={props.required}
                accept={imageTypes.join(',')}
                class="opacity-0 absolute inset-0 w-full"
                onInput={(event) => {
                    const file = event.currentTarget.files[0]
                    setPreviewUrl(file ? URL.createObjectURL(file) : undefined)
                }}
            />
        </div>
    )
}
