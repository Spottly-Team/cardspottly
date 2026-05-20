const MAX_EDGE_PX = 1200;
const WEBP_QUALITY = 0.85;

/**
 * Converte un'immagine in WebP prima dell'upload (solo browser).
 */
export async function convertImageToWebp(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Seleziona un file immagine valido.");
  }

  if (typeof document === "undefined") {
    throw new Error("Conversione immagine disponibile solo nel browser.");
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > MAX_EDGE_PX || height > MAX_EDGE_PX) {
    const ratio = Math.min(MAX_EDGE_PX / width, MAX_EDGE_PX / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossibile elaborare l'immagine.");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
  });

  if (!blob) {
    throw new Error("Conversione in WebP non supportata su questo dispositivo.");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "profile";

  return new File([blob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}
