import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  try {
    console.log("Fetching images from Cloudinary...");

    // ✅ Fetch images from Cloudinary
    const result = await cloudinary.search
      .expression("folder:uploads") // Ensure this matches your Cloudinary folder
      .sort_by("created_at", "desc")
      .max_results(10)
      .execute();

    console.log("Fetched Cloudinary Data:", result);

    // ✅ Extract image URLs safely
    const images: string[] = result.resources.map(
      (file: { secure_url: string }) => file.secure_url
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { images: [], error: "Could not fetch images" },
      { status: 500 }
    );
  }
}
