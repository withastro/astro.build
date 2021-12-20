let stars: number;
export async function getStars() {
    if (stars) return stars;
    stars = await fetch('https://api.github.com/repos/withastro/astro').then(res => res.json()).then(res => res.stargazers_count);
    return stars;
}
