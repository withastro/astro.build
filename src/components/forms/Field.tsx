import clsx from 'clsx'
import { ComponentChildren } from 'preact'
import LabelText from './LabelText.js'

export type Props = {
    label: string
    inline?: boolean
    required?: boolean
    children?: ComponentChildren
}

export default function Field(props: Props) {
    return (
        <label
            class={clsx(
                'w-full flex',
                props.inline ? 'items-center gap-2' : 'flex-col gap-1'
            )}
        >
            <LabelText required={props.required}>{props.label}</LabelText>
            {props.children}
        </label>
    )
}
