"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Download, ImageOff, Loader2 } from "lucide-react";

export default function ImagesPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        setImages(data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📸 Uploaded Images</h1>

      {loading ? (
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-12 w-12 animate-spin mb-2" />
          <p className="text-lg">Loading images...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {images.map((image) => (
            <Dialog key={image}>
              <DialogTrigger asChild>
                <Card
                  className="relative overflow-hidden shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <CardContent className="p-2">
                    <Image
                      src={image}
                      alt={image}
                      width={300}
                      height={200}
                      className="w-full h-[200px] object-cover rounded-md"
                      loading="lazy"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-600 truncate w-3/4">{image}</span>
                      <a href={image} download>
                        <Button size="icon" variant="outline" className="rounded-full">
                          <Download className="h-5 w-5" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                {selectedImage && (
                  <div className="flex flex-col items-center">
                    <Image
                      src={selectedImage}
                      alt="Preview"
                      width={500}
                      height={500}
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500">
          <ImageOff className="h-12 w-12 mb-2" />
          <p className="text-lg">No images uploaded yet.</p>
        </div>
      )}
    </div>
  );
}
