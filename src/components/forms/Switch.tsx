export type Props = {
    on: string
    off: string
    checked?: boolean
}

export default function Switch(props) {
    return (
        <div class="relative flex justify-center gap-x-2">
            <input
                {...props}
                type="checkbox"
                class="appearance-none border-2 border-neutral-300 rounded-full w-12 h-6 peer transition cursor-pointer focus:outline-none focus:border-primary-400 hover:border-primary-400"
            />
            <div class="pointer-events-none h-4 w-4 rounded-full bg-neutral-400 absolute top-1 left-1 inset-x-auto transition peer-checked:bg-primary-400 peer-checked:right-1 peer-checked:translate-x-6"></div>
            <span class="peer-checked:inline-block hidden">{props.on}</span>
            <span class="peer-checked:hidden">{props.off}</span>
        </div>
    )
}
