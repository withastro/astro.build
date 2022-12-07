import clsx from 'clsx'
import { useState } from 'preact/hooks'

const imageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp']

export default function ImageInput(props: {
    label: string
    name?: string
    inputId?: string
    required?: boolean
}) {
    const hydrated = typeof window !== 'undefined'
    const [previewUrl, setPreviewUrl] = useState<string>()

    return (
        <div
            class={clsx(
                'w-full aspect-[16/9]',
                'relative group',
                'transition',
                'focus:outline-none',
                'bg-neutral-100 bg-center bg-cover hover:bg-neutral-200',
                'text-neutral-600',
                'border-2 border-dashed border-neutral-400  focus-within:outline-offset-2 focus-within:outline-2 focus-within:outline-primary-400 focus-within:outline',
                'rounded-md overflow-hidden',
                'p-4',
                '@container'
            )}
        >
            <div class="absolute inset-0 animate-fade-in flex flex-col items-center justify-center gap-2 opacity-0 [animation-delay:300ms] [animation-fill-mode:forwards]">
                {hydrated ? (
                    <>
                        <p class="text-lg @md:text-3xl">
                            {props.label}{' '}
                            {props.required && (
                                <span
                                    class="text-red-500 text-base align-text-top"
                                    aria-hidden
                                >
                                    *
                                </span>
                            )}
                        </p>
                        <div class="text-center text-sm">
                            <p>16:9 aspect ratio</p>
                            <p>1280px wide or larger</p>
                        </div>
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
                            id={props.inputId}
                            accept={imageTypes.join(',')}
                            class="opacity-0 absolute inset-0 w-full cursor-pointer"
                            onInput={(event) => {
                                const file = event.currentTarget.files[0]
                                setPreviewUrl(
                                    file ? URL.createObjectURL(file) : undefined
                                )
                            }}
                        />
                    </>
                ) : (
                    <label class="flex flex-col items-center gap-4">
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
                            class="max-w-[220px]"
                            id={props.inputId}
                            accept={imageTypes.join(',')}
                        />
                    </label>
                )}
            </div>
        </div>
    )
}
