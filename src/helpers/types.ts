export type RequireSome<T, P extends keyof T> = Omit<T, P> & Required<Pick<T, P>>

export type MapKeys<M extends Map<unknown, unknown>> = Prettify<Array<Parameters<M["get"]>[0]>>

// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {}
