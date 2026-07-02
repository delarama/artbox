import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

function isS3Enabled() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_ENDPOINT,
  );
}

function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  });
}

function publicUrlForKey(storageKey: string) {
  if (process.env.S3_PUBLIC_URL) {
    return `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${storageKey}`;
  }
  return `/api/uploads/${storageKey}`;
}

export async function saveOrderPhoto(file: File, orderId: string) {
  const ext = path.extname(file.name) || ".jpg";
  const storageKey = `${orderId}/${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isS3Enabled()) {
    const client = getS3Client();
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: storageKey,
        Body: buffer,
        ContentType: file.type,
      }),
    );
    return {
      storageKey,
      url: publicUrlForKey(storageKey),
      sizeBytes: buffer.length,
    };
  }

  await mkdir(path.join(UPLOAD_DIR, orderId), { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, storageKey), buffer);
  return {
    storageKey,
    url: `/api/uploads/${storageKey}`,
    sizeBytes: buffer.length,
  };
}

export async function deleteOrderPhoto(storageKey: string) {
  if (isS3Enabled()) {
    try {
      const client = getS3Client();
      await client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: storageKey,
        }),
      );
    } catch {
      // ignore missing objects
    }
    return;
  }

  try {
    await unlink(path.join(UPLOAD_DIR, storageKey));
  } catch {
    // file may already be gone
  }
}
