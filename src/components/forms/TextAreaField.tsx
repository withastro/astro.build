import { textAreaClass } from '../styles'
import Field from './Field.js'

export type Props = {
    label: string
    name?: string
    type?: string
    placeholder?: string
    required?: boolean
}

export default function TextAreaField({ label, ...props }: Props) {
    return (
        <Field label={label} required={props.required}>
            <textarea {...props} class={textAreaClass} />
        </Field>
    )
}
