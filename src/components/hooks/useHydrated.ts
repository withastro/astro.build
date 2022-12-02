import { useEffect, useState } from 'preact/hooks'

/**
 * A hook that returns true when the component has been hydrated.
 * This is better than `typeof window !== 'undefined'` because it
 * maintains the hydrated HTML and avoids warnings
 */
export function useHydrated() {
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => setHydrated(true), [])
    return hydrated
}
