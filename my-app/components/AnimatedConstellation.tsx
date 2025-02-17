"use client"

import { useEffect, useRef } from "react"

interface AnimatedConstellationProps {
  imageUrl: string
}

export default function AnimatedConstellation({ imageUrl }: AnimatedConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const progressRef = useRef<number>(0)


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas background
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Load the processed image
    const img = new Image()
    img.src = imageUrl
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Get image data
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) return

      // Draw image to get its data
      tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      // Find all red pixels (our constellation lines)
      const points: [number, number][] = []
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] > 200 && pixels[i + 1] < 50 && pixels[i + 2] < 50) {
          const x = (i / 4) % canvas.width
          const y = Math.floor(i / 4 / canvas.width)
          points.push([x, y])
        }
      }

      // Sort points to create a continuous path
      const sortedPoints = sortPointsByDistance(points)

      // Animate drawing
      let progress = 0
      let lastTime = 0

      const animate = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp
        const deltaTime = timestamp - lastTime
        lastTime = timestamp

        // Increase progress
        progress += deltaTime * 0.0001 // Adjust speed here
        progressRef.current = progress

        // Clear canvas
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw constellation up to current progress
        ctx.beginPath()
        ctx.strokeStyle = "#FF0000"
        ctx.lineWidth = 2

        const currentPoints = sortedPoints.slice(0, Math.floor(progress * sortedPoints.length))

        if (currentPoints.length > 0) {
          ctx.moveTo(currentPoints[0][0], currentPoints[0][1])
          for (let i = 1; i < currentPoints.length; i++) {
            ctx.lineTo(currentPoints[i][0], currentPoints[i][1])
          }
        }

        ctx.stroke()

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [imageUrl])

  return <canvas ref={canvasRef} width={800} height={600} className="border-4 border-white rounded-lg" />
}

// Helper function to sort points by distance
function sortPointsByDistance(points: [number, number][]): [number, number][] {
  if (points.length === 0) return []

  const sorted: [number, number][] = [points[0]]
  const remaining = points.slice(1)

  while (remaining.length > 0) {
    const last = sorted[sorted.length - 1]
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    for (let i = 0; i < remaining.length; i++) {
      const distance = Math.hypot(remaining[i][0] - last[0], remaining[i][1] - last[1])
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }

    sorted.push(remaining[nearestIndex])
    remaining.splice(nearestIndex, 1)
  }
  return sorted
}

