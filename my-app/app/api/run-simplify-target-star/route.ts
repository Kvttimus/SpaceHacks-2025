import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util"; // Import `promisify` to handle exec properly

const execPromise = promisify(exec); // Define `execPromise` correctl

export async function POST(req: NextRequest) {
  try {
    // Get absolute paths
    const pythonPath = "C:\\Users\\leon7\\AppData\\Local\\Programs\\Python\\Python311\\python.exe"; // Replace with your actual Python path
    const scriptPath = path.join(process.cwd(), "backend", "simplify_target_star.py");

    console.log("🚀 Running simplify_target_star.py...");

    const { stdout, stderr } = await execPromise(`"${pythonPath}" "${scriptPath}"`);

    if (stderr) {
      console.error("Error running simplify_target_star.py:", stderr);
      return NextResponse.json({ error: "Failed to execute simplify_target_star.py", details: stderr }, { status: 500 });
    }

    console.log("simplify_target_star.py output:", stdout);
    console.log("Finished running simplify_target_star.py")

    return NextResponse.json({ message: "simplify_target_star.py executed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error executing simplify_target_star.py:", error);
    return NextResponse.json({ error: "Failed to execute simplify_target_star.py" }, { status: 500 });
  }
}
