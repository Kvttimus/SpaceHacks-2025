// import { NextRequest, NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("image") as File | null;

//   if (!file) {
//     return NextResponse.json({ error: "No image provided" }, { status: 400 });
//   }

//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   const savePath = path.join(process.cwd(), "public", "user-input", "constellation.jpg");

//   try {
//     fs.writeFileSync(savePath, buffer);
//     return NextResponse.json({ message: "Image saved successfully!" }, { status: 200 });
//   } catch (error) {
//     console.error("Error saving image:", error);
//     return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert image to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define the paths
    const userImagePath = path.join(process.cwd(), "public", "user-input", "userImage.png");
    const processedImagePath = path.join(process.cwd(), "public", "processed-user-input", "processed_user_img.png");

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(userImagePath), { recursive: true });

    // Save the user image
    fs.writeFileSync(userImagePath, buffer);
    console.log("User image saved successfully.");

    // Run the Python script to process the image
    exec(`python3 ${path.join(process.cwd(), "scripts", "simplify_user_img.py")}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error running Python script:", stderr);
        return;
      }
      console.log("Python script executed:", stdout);
    });

    return NextResponse.json({ message: "Image processed successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
