import { cn } from "@/lib/utils";
import { type UIMessage } from "@ai-sdk/react";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";

type Props = {
  messages: UIMessage[];
  isLoading: boolean;
  completionLoading: boolean;
};

const MessageList = ({ messages, isLoading, completionLoading }: Props) => {
  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4 pb-4">
      {messages.map((message) => {
        return (
          <div
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-sky-600 text-white": message.role === "user",
                  "bg-white text-black": message.role === "assistant",
                }
              )}
            >
              <div className="flex flex-col w-full overflow-hidden">
                {message.parts?.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <div
                        key={i}
                        className={cn("prose prose-sm max-w-none break-words", {
                          "prose-invert": message.role === "user",
                          "text-white": message.role === "user",
                        })}
                      >
                        <ReactMarkdown>
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        );
      })}
      {completionLoading && <Loader width="50px" height="50px" />}
    </div>
  );
};

export default MessageList;
