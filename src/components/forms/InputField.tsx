import { inputClass } from '../styles'
import Field from './Field.js'

export type Props = {
    label: string
    name?: string
    type?: string
    placeholder?: string
    required?: boolean
}

export default function InputField({ label, ...props }: Props) {
    return (
        <Field label={label} required={props.required}>
            <input {...props} class={inputClass} />
        </Field>
    )
}
