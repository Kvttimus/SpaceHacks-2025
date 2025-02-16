// import { NextResponse } from "next/server"
// import { exec } from "child_process"
// import { writeFile } from "fs/promises"
// import path from "path"

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get("image") as File

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
//     }

//     // Convert File to Buffer
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)

//     // Save the uploaded file
//     const uploadDir = path.join(process.cwd(), "public", "uploads")
//     const filePath = path.join(uploadDir, "temp_image.png")
//     await writeFile(filePath, buffer)

//     // Execute Python script
//     const pythonScript = path.join(process.cwd(), "src", "simplify_user_img.py")

//     return new Promise((resolve) => {
//       exec(`python "${pythonScript}" "${filePath}" 20`, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Error: ${error}`)
//           resolve(NextResponse.json({ error: "Processing failed" }, { status: 500 }))
//           return
//         }

//         resolve(
//           NextResponse.json({
//             message: "Image processed successfully",
//             processedImage: "/uploads/processed_image.png",
//           }),
//         )
//       })
//     })
//   } catch (error) {
//     console.error("Error processing image:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

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
    const inputPath = path.join(process.cwd(), "public", "user-input", "userImage.png")
    await writeFile(inputPath, buffer)

    // Execute Python script
    const scriptPath = path.join(process.cwd(), "backend", "simplify_user_img.py")
    const outputPath = path.join(process.cwd(), "public", "processed", "constellation.png")

    // Run the Python script with the input image path and desired points
    const { stdout, stderr } = await execAsync(`python "${scriptPath}" "${inputPath}" 20`)

    if (stderr) {
      console.error("Python script error:", stderr)
      throw new Error("Failed to process image")
    }

    console.log("Python script output:", stdout)

    return NextResponse.json({
      success: true,
      processedImage: "/processed/constellation.png",
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}

