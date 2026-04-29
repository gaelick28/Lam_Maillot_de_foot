export function imageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/${path}`;
}