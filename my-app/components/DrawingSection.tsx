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

      // Update only the processed image without refreshing the drawing
      setProcessedImageUrl(`/processed-user-input/processed_user_img.png?timestamp=${new Date().getTime()}`);
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
        <p className="text-gray-300">
          Just as our ancestors found shapes in the stars, it's your turn to paint the cosmos.
        </p>
      </div>
      <div className="mb-4 flex space-x-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform"
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

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          className="relative border-4 border-white rounded-lg cursor-crosshair"
        />
      </div>

      {processedImageUrl && (
        <div className="flex flex-col items-center mt-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xl font-bold text-white">Your Constellation</h3>
            <button
              onClick={shareConstellation}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <img
              src={processedImageUrl || "/placeholder.svg"}
              alt="Processed constellation"
              className="relative border-4 border-white rounded-lg"
              style={{ maxWidth: "800px", maxHeight: "600px" }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

