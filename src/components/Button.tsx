import clsx from 'clsx'
import { JSX } from 'preact'
import { Merge } from '../types'
import './Button.css'

type SharedProps = {
    theme?: 'primary' | 'secondary' | 'hollow'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// for some reason, href is a part of preact button props,
// so we have to omit that in order for the union to be discriminated
type ButtonElementProps = Omit<
    Merge<JSX.IntrinsicElements['button'], SharedProps>,
    'href'
>

type AnchorElementProps = Merge<JSX.IntrinsicElements['a'], SharedProps> & {
    href: string
}

export type ButtonProps = ButtonElementProps | AnchorElementProps

export default function Button({
    theme = 'primary',
    size = 'md',
    class: classProp = '',
    children,
    ...props
}: ButtonProps) {
    const className = clsx(['btn', `btn--${size}`, `btn--${theme}`, classProp])
    return 'href' in props ? (
        <a {...props} class={className}>
            {children}
        </a>
    ) : (
        <button {...props} class={className}>
            {children}
        </button>
    )
}
