"use client";

import { useState } from "react";
import { List, FileText, MessageSquare, ChevronLeft, Menu } from "lucide-react";
import ChatComponent from "./ChatComponent";
import ChatSideBar from "./ChatSideBar";
import PDFViewer from "./PDFViewer";

type Chat = {
  id: string;
  pdfName: string;
  pdfUrl: string;
  userId: string;
  fileKey: string;
  createdAt: Date;
};

type ActivePanel = "sidebar" | "viewer" | "chat";

type Props = {
  chats: Chat[];
  currentChat: Chat;
};

const NoPdfState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
        stroke="#7EC8E3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="16,6 12,2 8,6"
        stroke="#F97316"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="12" y1="2" x2="12" y2="15" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <p className="text-sm text-gray-400">No PDF loaded</p>
  </div>
);

const ChatPageClient = ({ chats, currentChat }: Props) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const hasPdf = !!currentChat.pdfUrl;

  const tabs: { key: ActivePanel; label: string; icon: React.ReactNode }[] = [
    {
      key: "sidebar",
      label: "Chats",
      icon: <List className="w-5 h-5" />,
    },
    {
      key: "viewer",
      label: "PDF",
      icon: (
        <span className="relative">
          <FileText className="w-5 h-5" />
          {hasPdf && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F97316] rounded-full" />
          )}
        </span>
      ),
    },
    {
      key: "chat",
      label: "Ask",
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen bg-gradient-to-tr from-orange-200 to-sky-200 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden z-10 ${isSidebarOpen ? "w-72 flex-shrink-0" : "w-0"
            }`}
        >
          <div className="w-72 h-full shadow-lg">
            <ChatSideBar chats={chats} chatId={currentChat.id} />
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute z-20 top-[3.1rem] transition-all duration-300 ease-in-out bg-orange-600 p-1.5 rounded-r-md shadow-md text-white hover:bg-orange-700 focus:outline-none ${isSidebarOpen ? "left-72" : "left-0"
            }`}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Main Content Area */}
        <div className="flex-1 flex h-full">
          {/* PDF Viewer */}
          <div className="flex-[4] h-full overflow-hidden">
            {hasPdf && (
              <PDFViewer pdf_url={currentChat.pdfUrl.replaceAll(" ", "+")} />
            )}
          </div>

          {/* Chat Component */}
          <div className="flex-[3] h-full border-l-4 border-slate-300 bg-white overflow-hidden shadow-xl">
            <ChatComponent chatId={currentChat.id} />
          </div>
        </div>
      </div>

      {/* Mobile layout — tab-based panel switcher */}
      <div className="flex flex-col h-screen md:hidden">
        <div className="flex-1 overflow-hidden">
          {activePanel === "sidebar" && (
            <ChatSideBar chats={chats} chatId={currentChat.id} />
          )}

          {activePanel === "viewer" && (
            <div className="w-full h-full flex flex-col">
              <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-600 truncate shrink-0">
                {currentChat.pdfName}
              </div>
              {hasPdf ? (
                <div className="flex-1 overflow-hidden">
                  <PDFViewer pdf_url={currentChat.pdfUrl.replaceAll(" ", "+")} />
                </div>
              ) : (
                <NoPdfState />
              )}
            </div>
          )}

          {activePanel === "chat" && (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <ChatComponent chatId={currentChat.id} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <nav
          className="flex items-stretch border-t border-gray-200 bg-white shrink-0"
          style={{ height: "64px", paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {tabs.map(({ key, label, icon }) => {
            const isActive = activePanel === key;
            return (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                className="flex-1 flex flex-col items-center justify-center gap-1 text-xs"
                style={{
                  color: isActive ? "#F97316" : "#9ca3af",
                  borderTop: isActive ? "2px solid #F97316" : "2px solid transparent",
                }}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default ChatPageClient;
