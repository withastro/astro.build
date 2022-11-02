import { useEffect, useState } from 'preact/hooks'

export default function useHydrated() {
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => setHydrated(true), [])
    return hydrated
}
