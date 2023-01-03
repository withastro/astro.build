export function getFormDataSize(form: HTMLFormElement) {
    const formdata = new FormData(form)

    return [...formdata.values()].reduce((acc, next) => {
        return acc + getSize(next)
    }, 0)
}

export function formSizeValidator(
    maxSize: number,
    message: string,
    fathomEventId?: string
) {
    return function onSubmit(event: SubmitEvent) {
        // calculate the total size of the form data
        const formsize = getFormDataSize(event.target as HTMLFormElement)

        if (formsize >= maxSize) {
            // block the form submission and pop up an alert (lazy UI...I know)
            event.preventDefault()
            alert(message)

            if (fathomEventId && 'fathom' in window) {
                ;(window.fathom as any).trackGoal(fathomEventId, 0)
            }
        }
    }
}

function getSize(value: unknown) {
    switch (typeof value) {
        case 'string':
            return value.length * 2
        case 'boolean':
            return 4
        case 'number':
            return 8
    }

    if (value instanceof File) {
        return value.size
    }

    return 0
}
