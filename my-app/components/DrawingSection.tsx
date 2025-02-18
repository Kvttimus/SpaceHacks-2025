"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Loader2, Share2 } from "lucide-react"

export default function DrawingSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#FFFFFF")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineCap = "round"

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const processImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsProcessing(true);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/png")
      );

      // Create form data
      const formData = new FormData();
      formData.append("image", blob, "drawing.png");

      // Send image to API for processing
      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      // Wait a short time to ensure the processed image is saved
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // --------------------------------------------------------------------------------------------------

      const response2 = await fetch("/api/run-simplify-target-star", {
        method: "POST",
      });

      if (!response2.ok) {
        throw new Error("Failed to simplify the target star img");
      }

      // ----------------------------------------------------------------------------------------------------


      // Update only the processed image without refreshing the drawing
      setProcessedImageUrl(`/processed-user-input/processed_user_img.png?timestamp=${new Date().getTime()}`);
      setProcessedImageUrl(`/user-input/userImage.png?timestamp=${new Date().getTime()}`);
      setProcessedImageUrl(`/processed-user-input/star_img.png?timestamp=${new Date().getTime()}`);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const shareConstellation = async () => {
    if (!processedImageUrl) return

    try {
      await navigator.share({
        title: "My Star Constellation",
        text: "Check out the constellation I created with Star Glazing!",
        url: window.location.href,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-2">Be a Cosmic Trailglazer</h2>
        <p className="text-gray-400">
          Draw to your heart's content, and we will find an accurate celestial system among a cutting edge
        </p>
        <p className="text-gray-400">100 TB dataset of astronomical observations which resemble your creation.</p>
        <p className="text-gray-400">
          Just as our predecessors found shapes in the stars, it's your turn to paint the cosmos.
        </p>
      </div>

      {/* Drawing Controls */}
      <div className="mb-4 flex space-x-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          // className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform"
          className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform 
          [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full"
          title="Choose star color"
        />
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all hover:scale-105"
        >
          Clear Sky
        </button>
        <button
          onClick={processImage}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" />
              Processing...
            </>
          ) : (
            "Find Constellation"
          )}
        </button>
      </div>

      {/* Drawing Canvas */}
      <div className="relative group mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          className="relative border-4 border-white rounded-lg cursor-crosshair"
        />
      </div>

      {/* Processed Images Section */}
      {processedImageUrl && (
        <div className="flex flex-col items-center mt-32 animate-fade-in w-full max-w-[800px]">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xl font-bold text-white">Your Constellation</h3>
            <button
              onClick={shareConstellation}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="relative w-[200px] h-[200px] mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative border-4 border-white rounded-lg overflow-hidden w-[200px] h-full">
              <img
                src={`/processed-user-input/star_img.png?timestamp=${new Date().getTime()}`}
                alt="Star Constellation"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <img
                // src={`/processed-user-input/processed_user_img.png?timestamp=${new Date().getTime()}`}
                src={`/user-input/userImage.png?timestamp=${new Date().getTime()}`}
                alt="Your Drawing"
                className="absolute inset-0 w-full h-full object-contain mix-blend-lighten"
              />  
              <img
                src={`/processed-user-input/processed_user_img.png?timestamp=${new Date().getTime()}`}
                // src={`/user-input/userImage.png?timestamp=${new Date().getTime()}`}
                alt="Your Drawing"
                className="absolute inset-0 w-full h-full object-contain mix-blend-lighten opacity-50"
              />  
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


