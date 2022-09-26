import type { EndpointOutput } from 'astro'
import { getShowcase } from '../../data/showcase'

export async function get(): Promise<EndpointOutput> {
    const showcase = await getShowcase()

    const result = showcase.map((site) => ({
        title: site.title,
        url: site.url.href
    }))

    return { body: JSON.stringify(result) }
}
