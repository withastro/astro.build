import fs from "node:fs";
import { keywordToCategory, overrides } from "./integrations-data.mjs";
import { parseRepoUrl, orgApi } from "./github.mjs";
import {
  fetchDetailsForPackage,
  fetchDownloadsForPackage,
  searchByKeyword,
} from "./npm.mjs";

function isOfficial(pkg) {
  return pkg.startsWith("@astrojs/");
}

function normalizePackageDetails(data, pkg) {
  return {
    slug: data.name,
    title: data.name,
    description: data.description,
    categories: (data.keywords ?? []).map(keywordToCategory).filter(Boolean),
    official: isOfficial(pkg),
    repoUrl: {
      href: data.repository.url
        .replace("git+", "")
        .replace(".git", "")
        .replace("git:", "https:"),
      text: "View source code",
    },
    npmUrl: {
      href: `https://www.npmjs.com/package/${pkg}`,
      text: "View on NPM",
    },
    url: {
      href: data.homepage,
      text: "View homepage",
    },
  };
}

async function getStarsForRepo(repoUrl) {
  const { org, repo } = parseRepoUrl(repoUrl) ?? {};

  if (!org || !repo) {
    return 0;
  }

  return await orgApi(org).repo(repo).fetchStars();
}

async function fetchDetailsWithOverrides(pkg) {
  const details = await fetchDetailsForPackage(pkg);
  const integrationOverrides = overrides[pkg] || {};

  return {
    ...normalizePackageDetails(details, pkg),
    ...integrationOverrides,
  };
}

async function main() {
  const keyword = "astro-component";

  const packagesMap = await searchByKeyword(keyword);
  const packageNames = Array.from(packagesMap.keys());

  const data = await Promise.all(
    packageNames.map((pkg) =>
      Promise.all([
        fetchDetailsWithOverrides(pkg),
        fetchDownloadsForPackage(pkg),
      ])
    )
  );

  const npmData = data.map(([details, downloads]) => ({
    ...details,
    downloads,
  }));

  // don't fetch stars for official packages, they get a badge instead
  const stars = await Promise.all(
    npmData.map((data) => data.official ? undefined : getStarsForRepo(data.repoUrl.href))
  );

  const integrations = npmData
    .map((data, i) => ({
      ...data,
      stars: stars[i],
    }))
    .sort((a, b) => b.downloads - a.downloads);

  fs.writeFileSync(
    "src/data/integrations.json",
    JSON.stringify(integrations, null, 4)
  );
}

main();
