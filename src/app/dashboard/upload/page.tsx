"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setStatus(""); // Clear previous messages
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
      setStatus(""); // Clear previous messages
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setStatus("⚠️ Please select at least one file to upload.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file)); // Append all files

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ ${data.message}`);
        setSelectedFiles([]); // Clear files on success
      } else {
        setStatus(`❌ Upload failed: ${data.error}`);
      }
    } catch (error) {
      setStatus(`⚠️ Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drag and Drop Container */}
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              onClick={() => document.getElementById("file-input")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <UploadCloud className="h-10 w-10 text-gray-500 dark:text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : "Drag & drop or click to upload"}
              </p>
              <input
                id="file-input"
                type="file"
                name="images"
                accept="image/*"
                className="hidden"
                multiple // Enable multiple file selection
                onChange={handleFileChange}
              />
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 p-2 rounded-lg">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {file.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-gray-100"
              disabled={loading || selectedFiles.length === 0}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Upload Images"}
            </Button>

            {status && (
              <p className={cn("text-center text-sm mt-2", status.includes("✅") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                {status}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
