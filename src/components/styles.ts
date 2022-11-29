import clsx from 'clsx'

export const neonOutlineCardStyle = clsx(
    'border border-transparent first:decoration-transparent border-primary-300 shadow shadow-sky-200 rounded-lg hover:border-primary-400 hover:shadow-accent-300'
)

export const inputBaseClass = clsx(
    'border-2 border-neutral-300 focus:border-primary-400 focus:outline-none rounded px-2 py-2 focus:ring-0 transition bg-white'
)
export const checkboxClass = clsx(inputBaseClass)
export const textAreaClass = clsx(inputBaseClass, 'w-full')
export const inputClass = clsx(textAreaClass, 'leading-none w-full')
