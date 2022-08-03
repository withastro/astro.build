import { fetchShowcase } from "../../data/showcase.js";

export async function get() {
  const showcase = await fetchShowcase();

  const result = showcase.map((site) => ({
    title: site.title,
    url: site.url.href
  }));

  return {
    body: JSON.stringify(result, null, 4)
  };
}