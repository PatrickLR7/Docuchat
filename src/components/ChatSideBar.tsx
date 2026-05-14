"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Chat = {
  id: string;
  pdfName: string;
  pdfUrl: string;
  userId: string;
  fileKey: string;
  createdAt: Date;
};

type Props = {
  chats: Chat[];
  chatId?: string;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  const router = useRouter();
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingChatId) return;
    setIsDeleting(true);
    try {
      await axios.post("/api/delete-chat", { chatId: deletingChatId });
      toast.success("Chat deleted");
      const remaining = chats.filter((c) => c.id !== deletingChatId);
      router.push(remaining.length > 0 ? `/chat/${remaining[0].id}` : "/");
    } catch {
      toast.error("Failed to delete chat");
    } finally {
      setIsDeleting(false);
      setDeletingChatId(null);
    }
  };

  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-sky-950 flex flex-col">
      <Link href="/">
        <Button className="bg-orange-600 hover:bg-orange-700 w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4 flex-1 overflow-y-auto pr-2">
        {chats.map((chat) => (
          <div key={chat.id} className="relative group">
            <Link href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "rounded lg p-3 text-slate-300 flex items-center pr-8",
                  {
                    "bg-sky-600 text-white": chat.id === chatId,
                    "hover:text-white": chat.id !== chatId,
                  }
                )}
              >
                <MessageCircle className="mr-2 shrink-0" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName}
                </p>
              </div>
            </Link>
            <button
              onClick={() => setDeletingChatId(chat.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400 p-1"
              aria-label="Delete chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-sky-900/50">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Go Back to Home
        </Link>
      </div>

      {deletingChatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-sky-950 border border-sky-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-white font-semibold text-lg mb-3">
              Delete Chat
            </h2>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to delete this chat? This action will delete
              the messages, the PDF, and all associated content.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingChatId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-sky-700 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSideBar;
