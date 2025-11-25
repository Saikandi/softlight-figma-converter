const BASE = 'https://api.figma.com/v1';
export async function getFile(token, key) {
    const res = await fetch(`${BASE}/files/${key}`, {
        headers: { 'X-Figma-Token': token },
    });
    if (!res.ok)
        throw new Error(`Figma file fetch failed: ${res.status}`);
    return res.json();
}
export async function getImages(token, key, ids, format = 'png') {
    const res = await fetch(`${BASE}/images/${key}?ids=${ids.join(',')}&format=${format}`, {
        headers: { 'X-Figma-Token': token },
    });
    if (!res.ok)
        throw new Error(`Figma images fetch failed: ${res.status}`);
    return res.json();
}
