import clsx from 'clsx'
import { ComponentChildren } from 'preact'

export type Props = {
    children?: ComponentChildren
    required?: boolean
}

export default function LabelText(props: Props) {
    return (
        <span
            class={clsx(
                'text-sm font-medium leading-none after:text-red-500',
                props.required && "after:content-['_*']"
            )}
        >
            {props.children}
        </span>
    )
}
