"use client";

import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { Loader2 } from "lucide-react";

export default function DrawingSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

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

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Be a Cosmic Trailblazer</h2>
        <p className="text-gray-300">
          Just as our ancestors found shapes in the stars, it's your turn to paint the cosmos. What wonders will you
          discover?
        </p>
      </div>
      <div className="mb-4 flex space-x-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-full cursor-pointer"
          title="Choose star color"
        />
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Sky
        </button>
        <button
          onClick={processImage}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Find Constellation"
          )}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          className="border-4 border-white rounded-lg cursor-crosshair"
        />
        {processedImageUrl && (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4">Your Constellation</h3>
            <img
              src={processedImageUrl}
              alt="Processed constellation"
              className="border-4 border-white rounded-lg"
              style={{ maxWidth: "800px", maxHeight: "600px" }}
            />
          </div>
        )}
      </div>
      <div className="mt-6 text-center max-w-2xl">
        <p className="text-gray-300">StarGlazers.com</p>
      </div>
    </div>
  );
}
