import { ComponentChildren, JSX } from 'preact'

export type Props = {
    name?: string
    value?: string
    checked?: boolean
    onInput?: JSX.GenericEventHandler<HTMLInputElement>
    children?: ComponentChildren
}

export default function Checkbox(props: Props) {
    return (
        <label class="inline-flex items-center gap-1 cursor-pointer">
            <input
                {...props}
                class="appearance-none cursor-pointer w-4 h-4 rounded-full transition-colors border-2 border-primary-500 [&:not(:checked)]:hover:bg-primary-200 checked:bg-primary-500"
                type="radio"
            />
            {props.children}
        </label>
    )
}
