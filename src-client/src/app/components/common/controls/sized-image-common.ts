export function getSize(w: number, h: number, maxWidth: number) {

    if (w > maxWidth) {
        const aspectRatio = h / w;
        w = maxWidth;
        h = Math.floor(maxWidth * aspectRatio);
    }

    return { width: w, height: h };
}