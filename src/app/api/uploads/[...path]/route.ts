import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path;
  const storageKey = segments.join("/");
  if (!storageKey || storageKey.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const absolutePath = path.join(process.cwd(), "uploads", storageKey);
  try {
    const buffer = await readFile(absolutePath);
    const ext = path.extname(storageKey).toLowerCase();
    const mimeType =
      ext === ".webp" ? "image/webp" : ext === ".png" ? "image/png" : "image/jpeg";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
