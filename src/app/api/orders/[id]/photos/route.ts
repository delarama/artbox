import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { saveOrderPhoto } from "@/lib/storage";

const MAX_PHOTOS = 30;
const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { photos: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.photos.length >= MAX_PHOTOS) {
    return NextResponse.json({ error: "Photo limit reached" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!/image\/(png|jpe?g)/i.test(file.type)) {
    return NextResponse.json({ error: "Only JPG and PNG images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 12MB)" }, { status: 400 });
  }

  const saved = await saveOrderPhoto(file, id);
  const photo = await prisma.orderPhoto.create({
    data: {
      orderId: id,
      filename: file.name,
      storageKey: saved.storageKey,
      url: saved.url,
      mimeType: file.type,
      sizeBytes: saved.sizeBytes,
    },
  });

  return NextResponse.json({
    photo: { id: photo.id, url: photo.url, name: photo.filename },
  });
}
