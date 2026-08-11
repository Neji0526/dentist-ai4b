import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolves a photograph dropped into `public/images/`, or null when it is not
 * there yet — so a page can prefer a real photo and fall back to its
 * illustrated scene instead of rendering a broken image.
 *
 * Server-only, and evaluated once per build for statically rendered pages.
 */
export function localImage(fileName: string): string | null {
  const publicPath = `/images/${fileName}`;

  return existsSync(path.join(process.cwd(), "public", "images", fileName))
    ? publicPath
    : null;
}
