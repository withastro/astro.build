import { useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { useHydrated } from '../hooks/useHydrated.js'
import { inputBaseClass, inputClass } from '../styles.js'

function TagList({
    tags,
    onRemove
}: {
    tags: Iterable<string>
    onRemove: (tag: string) => void
}) {
    return (
        <>
            {[...tags].map((tag, index) => (
                <button
                    type="button"
                    key={index}
                    class="border-primary-400 border rounded-md text-xs leading-none p-1 h-6"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            onRemove(tag)
                        }
                    }}
                >
                    × {tag}
                </button>
            ))}
        </>
    )
}

// accept common props between input and select
type TagSelectProps = (JSX.IntrinsicElements['select'] &
    JSX.IntrinsicElements['input']) & {
    options: string[]
}

export function TagSelect({ options, ...props }: TagSelectProps) {
    const [tags, setTags] = useState(new Set<string>())
    const hydrated = useHydrated()

    if (!hydrated) {
        return (
            <div>
                <p class="text-neutral-500 text-sm">
                    Hold ctrl or cmd to select multiple options
                </p>
                <select multiple {...props} class={inputClass}>
                    {options.map((option, index) => (
                        <option key={index}>{option}</option>
                    ))}
                </select>
            </div>
        )
    }

    return (
        <div class={inputBaseClass}>
            <input {...props} type="hidden" value={[...tags].join(', ')} />
            <div class="flex flex-wrap items-center gap-2">
                {/* extra wrapper element to make sure the input keeps its spot in the DOM and doesn't lose focus on tag updates */}
                <div class="contents">
                    <TagList
                        tags={tags}
                        onRemove={(tag) => {
                            setTags((tags) => {
                                tags.delete(tag)
                                return new Set(tags)
                            })
                        }}
                    />
                </div>
                <div class="flex gap-2 items-center relative">
                    <select
                        // the negative margin allows adding inner spacing without separating it from the surrounding box
                        class="appearance-none bg-transparent py-1 pl-2 pr-6 -mx-1 focus:bg-primary-200 rounded-md focus:outline-none"
                        placeholder="Add tags"
                        onInput={(event) => {
                            setTags(
                                (tags) =>
                                    new Set(tags.add(event.currentTarget.value))
                            )
                            event.currentTarget.value = 'Select one...'
                        }}
                        value="Select one..."
                    >
                        <option disabled>Select one...</option>
                        {options
                            .filter((o) => !tags.has(o))
                            .map((option, index) => (
                                <option key={index}>{option}</option>
                            ))}
                    </select>
                    <span class="absolute right-0 select-none" aria-hidden>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    )
}

export function TagInput(props: JSX.IntrinsicElements['input']) {
    const [tags, setTags] = useState(new Set<string>())
    const hydrated = useHydrated()

    if (!hydrated) {
        return (
            <input
                {...props}
                class={inputClass}
                placeholder="Add tags (separated by commas)"
            />
        )
    }

    return (
        <div class={inputBaseClass}>
            <input {...props} type="hidden" value={[...tags].join(', ')} />
            <div class="flex flex-wrap items-center gap-2">
                {/* extra wrapper element to make sure the input keeps its spot in the DOM and doesn't lose focus on tag updates */}
                <div class="contents">
                    <TagList
                        tags={tags}
                        onRemove={(tag) => {
                            setTags((tags) => {
                                tags.delete(tag)
                                return new Set(tags)
                            })
                        }}
                    />
                </div>
                <input
                    class="flex-1 outline-none bg-transparent"
                    placeholder="Add tags (separated by commas or spaces)"
                    onKeyDown={(event) => {
                        if (
                            event.key === 'Enter' ||
                            event.key === ' ' ||
                            event.key === ','
                        ) {
                            const value = event.currentTarget.value.trim()
                            event.preventDefault()
                            if (value === '') return
                            setTags((tags) => new Set(tags.add(value)))
                            event.currentTarget.value = ''
                        }

                        if (
                            event.key === 'Backspace' &&
                            event.currentTarget.value === ''
                        ) {
                            setTags((tags) => new Set([...tags].slice(0, -1)))
                        }
                    }}
                />
            </div>
        </div>
    )
}
