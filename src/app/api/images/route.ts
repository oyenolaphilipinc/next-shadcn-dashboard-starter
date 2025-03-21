import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:uploads") // Replace "uploads" with your folder name
      .sort_by("created_at", "desc")
      .max_results(10)
      .execute();

    const images = resources.map((file: any) => file.secure_url);

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ images: [], error: "Could not fetch images" }, { status: 500 });
  }
}
