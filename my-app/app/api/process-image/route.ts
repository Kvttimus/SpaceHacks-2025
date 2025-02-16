import { NextResponse } from "next/server"
import { exec } from "child_process"
import { writeFile } from "fs/promises"
import path from "path"

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

    // Save the uploaded file
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, "temp_image.png")
    await writeFile(filePath, buffer)

    // Execute Python script
    const pythonScript = path.join(process.cwd(), "src", "simplify_user_img.py")

    return new Promise((resolve) => {
      exec(`python "${pythonScript}" "${filePath}" 20`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`)
          resolve(NextResponse.json({ error: "Processing failed" }, { status: 500 }))
          return
        }

        resolve(
          NextResponse.json({
            message: "Image processed successfully",
            processedImage: "/uploads/processed_image.png",
          }),
        )
      })
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

