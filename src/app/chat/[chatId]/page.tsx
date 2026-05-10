import ChatPageClient from "@/components/ChatPageClient";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  if (!_chats.length) {
    redirect("/");
  }

  const _chat = _chats.find((chat) => chat.id === chatId);
  if (!_chat) {
    redirect("/");
  }

  return <ChatPageClient chats={_chats} currentChat={_chat} />;
};

export default ChatPage;
