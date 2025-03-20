"use client"

import { useRef, useEffect } from "react"

interface MockMapProps {
  width?: number
  height?: number
  userLocation?: { lat: number; lng: number }
  parkingSpots?: Array<{
    x: number
    y: number
    available: boolean
  }>
}

export function MockMap({
  width = 600,
  height = 300,
  userLocation,
  parkingSpots = [
    { x: 0.25, y: 0.25, available: true },
    { x: 0.75, y: 0.25, available: false },
    { x: 0.25, y: 0.75, available: true },
    { x: 0.75, y: 0.75, available: true },
  ],
}: MockMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw some roads
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 8

    // Horizontal road
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    // Vertical road
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()

    // Draw road outlines
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1

    // Horizontal road outline
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2 - 4)
    ctx.lineTo(canvas.width, canvas.height / 2 - 4)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2 + 4)
    ctx.lineTo(canvas.width, canvas.height / 2 + 4)
    ctx.stroke()

    // Vertical road outline
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 4, 0)
    ctx.lineTo(canvas.width / 2 - 4, canvas.height)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 + 4, 0)
    ctx.lineTo(canvas.width / 2 + 4, canvas.height)
    ctx.stroke()

    // Draw parking spots
    parkingSpots.forEach((spot) => {
      // Convert relative positions to absolute
      const x = spot.x * canvas.width
      const y = spot.y * canvas.height

      // Draw parking icon
      ctx.fillStyle = spot.available ? "#4f46e5" : "#6b7280"
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, 2 * Math.PI)
      ctx.fill()

      // Draw P letter
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("P", x, y)
    })

    // Draw user location
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw pulse effect
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 12, 0, 2 * Math.PI)
    ctx.stroke()
  }, [parkingSpots])

  return <canvas ref={canvasRef} width={width} height={height} className="w-full h-full rounded-md" />
}

