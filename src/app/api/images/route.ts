import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  const uploadDir = join(process.cwd(), "public/uploads");
  
  try {
    const files = await readdir(uploadDir);
    const images = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/.test(file));
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ images: [], error: "Could not read files" }, { status: 500 });
  }
}