import clsx from 'clsx'
import { ComponentChildren, JSX } from 'preact'
import LabelText from './LabelText.js'

export type Props = {
    as?: keyof JSX.IntrinsicElements
    label: string
    inline?: boolean
    required?: boolean
    children?: ComponentChildren
}

export default function Field({ as: Component = 'label', ...props }: Props) {
    return (
        <Component
            class={clsx(
                'w-full flex',
                props.inline ? 'items-center gap-2' : 'flex-col gap-2'
            )}
        >
            <LabelText required={props.required}>{props.label}</LabelText>
            {props.children}
        </Component>
    )
}
