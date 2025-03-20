"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setStatus(""); // Clear previous messages
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setStatus(""); // Clear previous messages
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatus("⚠️ Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ Image uploaded`);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Upload Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drag and Drop Container */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              onClick={() => document.getElementById("file-input")?.click()}
              onDragOver={(e) => e.preventDefault()} // Prevent default behavior
              onDrop={handleDrop}
            >
              <UploadCloud className="h-10 w-10 text-gray-500 mb-2" />
              <p className="text-gray-600 text-sm">
                {selectedFile ? selectedFile.name : "Drag & drop or click to upload"}
              </p>
              <input
                id="file-input"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full flex items-center justify-center"
              disabled={loading || !selectedFile}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Upload Image"}
            </Button>

            {status && (
              <p className={cn("text-center text-sm mt-2", status.includes("✅") ? "text-green-600" : "text-red-600")}>
                {status}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
