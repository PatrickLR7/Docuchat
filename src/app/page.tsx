import AnimatedPDFIcon from "@/components/AnimatedPdfIcon";
import DocuchatLogo from "@/components/DocuchatLogo";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { LogIn } from "lucide-react";
import Link from "next/link";


export default async function Home() {
  const { userId } = auth();
  const isAuthed = !!userId;

  let firstChat;
  if (isAuthed) {
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId)).limit(1);
    firstChat = _chats[0] || null;
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fde8d4 0%, #daeef8 100%)" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-5 md:px-10 py-6">
        <DocuchatLogo />
        <div className="flex items-center gap-6">
          {isAuthed ? (
            <div className="flex items-center gap-3">
              {firstChat && (
                <Link href={`/chat/${firstChat.id}`}>
                  <button className="bg-[#F97316] text-white px-5 py-2 rounded-lg font-semibold text-sm">
                    My Chats →
                  </button>
                </Link>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Link href="/sign-in">
              <button className="bg-[#F97316] text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                Get Started
                <LogIn className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-xl mx-auto mt-4 md:mt-6 text-center px-5 pb-16">
        <AnimatedPDFIcon />

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mt-6">
          Chat with any <span style={{ color: "#F97316" }}>PDF</span>
        </h1>

        <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto mt-3">
          Leverage{" "}
          <a
            href="https://aws.amazon.com/what-is/retrieval-augmented-generation/"
            className="text-sky-500 font-semibold underline"
          >
            RAG
          </a>{" "}
          to chat with your PDFs. Simply drag and drop a file and start asking questions.
        </p>

        <div className="mt-7">
          {isAuthed ? (
            <FileUpload />
          ) : (
            <Link href="/sign-in">
              <button className="bg-[#F97316] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto">
                Login to get started
                <LogIn className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>

        {/* Mobile-only "Go to My Chats" button */}
        {isAuthed && firstChat && (
          <Link href={`/chat/${firstChat.id}`} className="sm:hidden block mt-4">
            <button className="w-full bg-[#F97316] text-white rounded-xl py-3 font-semibold">
              Go to My Chats →
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
