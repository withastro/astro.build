import { useRef, useState } from 'preact/hooks'
import { inputBaseClass, inputClass } from '../styles.js'

const hydrated = typeof window !== 'undefined'

export default function TagInput({ name }: { name: string }) {
    const [tags, setTags] = useState<string[]>([])
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    if (!hydrated) {
        return (
            <input
                class={inputClass}
                placeholder="Add tags (separated by commas)"
            />
        )
    }

    return (
        <div class={inputBaseClass}>
            <input type="hidden" name={name} value={tags.join(', ')} />
            <div class="flex flex-wrap gap-2 -my-1">
                {/* extra wrapper element to make sure the input keeps its spot in the DOM and doesn't lose focus on tag updates */}
                <div class="contents">
                    {tags.map((tag, index) => (
                        <button
                            type="button"
                            key={index}
                            class="border-primary-400 border rounded-md text-xs leading-none p-1"
                            onClick={(event) => {
                                if (event.target === event.currentTarget) {
                                    setTags(tags.filter((_, i) => i !== index))
                                }
                            }}
                        >
                            × {tag}
                        </button>
                    ))}
                </div>
                <input
                    ref={inputRef}
                    value={inputValue}
                    class="flex-1 outline-none bg-transparent"
                    placeholder="Add tags (separated by commas or spaces)"
                    onInput={(event) => {
                        setInputValue(event.currentTarget.value)
                    }}
                    onKeyDown={(event) => {
                        if (
                            event.key === 'Enter' ||
                            event.key === ' ' ||
                            event.key === ','
                        ) {
                            event.preventDefault()
                            if (inputValue.trim() === '') return
                            setTags([...tags, inputValue.trim()])
                            setInputValue('')
                        }

                        if (event.key === 'Backspace') {
                            if (inputValue === '') {
                                setTags(tags.slice(0, -1))
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
}
