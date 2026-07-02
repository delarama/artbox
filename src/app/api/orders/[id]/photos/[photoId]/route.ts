import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { deleteOrderPhoto } from "@/lib/storage";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> },
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, photoId } = await params;
  const photo = await prisma.orderPhoto.findFirst({
    where: {
      id: photoId,
      orderId: id,
      order: { userId: session.user.id },
    },
  });
  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  await prisma.orderPhoto.delete({ where: { id: photoId } });
  await deleteOrderPhoto(photo.storageKey);

  return NextResponse.json({ ok: true });
}
