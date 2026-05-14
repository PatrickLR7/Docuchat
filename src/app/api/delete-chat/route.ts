import { db } from "@/lib/db";
import { chats, vectors } from "@/lib/db/schema";
import { deleteFromS3 } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chatId } = await req.json();

    const [chat] = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await deleteFromS3(chat.fileKey);
    await db.delete(vectors).where(eq(vectors.fileKey, chat.fileKey));
    await db.delete(chats).where(eq(chats.id, chatId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
