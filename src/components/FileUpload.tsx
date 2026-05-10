"use client";

import { getS3Url, uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FileUploadProps {}

const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
);

const FileUpload = (props: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });
  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 25 * 1024 * 1024) {
        toast.error("Please upload a smaller file (25Mb Max)");
        return;
      }

      try {
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        } else {
          mutate(data, {
            onSuccess: ({ chatId }) => {
              toast.success("Chat has been created!");
              router.push(`/chat/${chatId}`);
            },
            onError: (err) => {
              console.error(err);
              toast.error("Error creating chat");
            },
          });
          const url = getS3Url(data.file_key);
          console.log(url);
          return url;
        }
      } catch (e) {
        console.log(e);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-2xl cursor-pointer py-10 px-6 flex justify-center items-center flex-col min-h-[120px]"
      style={{ borderColor: "rgba(249,115,22,0.45)", background: "rgba(255,255,255,0.55)" }}
    >
      <input {...getInputProps()} />
      {uploading || isPending ? (
        <>
          <Loader2 className="h-10 w-10 text-[#F97316] animate-spin" />
          <p className="mt-2 text-sm text-slate-400">Uploading Files...</p>
        </>
      ) : (
        <>
          <UploadIcon />
          <p className="mt-3 font-semibold text-gray-700">Drop your PDF here</p>
          <p className="text-sm text-gray-400">or click to browse files</p>
        </>
      )}
    </div>
  );
};

export default FileUpload;
