import { parse, isBefore } from 'date-fns';

export async function getAllRoles() {
  const files = await import.meta.glob("./**/*.md");
  const roles = (
    await Promise.all(
      Object.values(files).map((importFile: any, index) =>
        importFile().then((res) => {
          const { title, salary, status, description, publishDate, department } = res.frontmatter;
          const href = Object.keys(files)
            [index].replace(/^\./, "/careers")
                .replace(/\.md$/, "");
          return {
            title,
            salary,
            status,
            description,
            department,
            publishDate: parse(publishDate, "MMMM d, yyyy", new Date()),
            href,
          };
        })
      )
    )
  ).sort((a, b) => {
    if (isBefore(a.publishDate, b.publishDate)) return 1;
    if (isBefore(b.publishDate, a.publishDate)) return -1;
    return 0;
  });
  return roles;
}
