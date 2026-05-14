"use client";

import { PDFViewer } from "@embedpdf/react-pdf-viewer";

type Props = {
  fileUrl: string;
};

const PDFViewerEmbed = ({ fileUrl }: Props) => {
  return (
    <PDFViewer
      className="h-full w-full"
      config={{
        src: fileUrl,
        tabBar: false,
        disabledCategories: ["mode-shapes", "insert", "form", "redaction"],
        theme: {
          preference: "dark",
          dark: {
            accent: {
              primary: "#ea580c",
              hover: "#c2410c",
              active: "#9a3412",
              light: "#fed7aa",
            },
          },
        },
      }}
    />
  );
};

export default PDFViewerEmbed;
