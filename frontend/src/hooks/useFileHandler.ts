import { ChangeEvent, useState } from "react";

export function useFileHandler() {
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };
  return { file, fileName: file?.name, handleFileChange };
}
