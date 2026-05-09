export const GITHUB_REPO = "https://github.com/abidali9000/Deep-Learning";
export const GITHUB_BRANCH = "main";

export function ghFile(path: string, line?: number): string {
  const lineSuffix = line ? `#L${line}` : "";
  return `${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${path}${lineSuffix}`;
}

export function ghTree(path: string): string {
  return `${GITHUB_REPO}/tree/${GITHUB_BRANCH}/${path}`;
}

export function ghRaw(path: string): string {
  return `${GITHUB_REPO}/raw/${GITHUB_BRANCH}/${path}`;
}
