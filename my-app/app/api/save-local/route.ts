import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { mkdir } from "fs/promises"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "user-input")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, continue
    }

    // Save the file
    const filePath = path.join(uploadDir, "userImage.png")
    await writeFile(filePath, buffer)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving image:", error)
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
  }
}

