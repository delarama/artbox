import sharp from "sharp";

const MAX_EDGE = 1920;

export async function optimizePhotoToWebp(input: Buffer) {
  return sharp(input)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
}

export const WEBP_MIME = "image/webp";
