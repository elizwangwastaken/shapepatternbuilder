import { useEffect, useRef } from "react";

type TextureType = "none" | "grid" | "dots" | "bubbles" | "diagonal" | "waves";

interface CanvasTextureProps {
  type: TextureType;
  color?: string;
  opacity?: number;
}

export function CanvasTexture({ type, color = "white", opacity = 0.2 }: CanvasTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || type === "none") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    switch (type) {
      case "grid":
        drawGrid(ctx, width, height, color);
        break;
      case "dots":
        drawDots(ctx, width, height, color);
        break;
      case "bubbles":
        drawBubbles(ctx, width, height, color);
        break;
      case "diagonal":
        drawDiagonal(ctx, width, height, color);
        break;
      case "waves":
        drawWaves(ctx, width, height, color);
        break;
    }
  }, [type, color]);

  if (type === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity,
        imageRendering: "auto",
      }}
    />
  );
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  const gridSize = 50;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawDots(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  const spacing = 30;
  const dotSize = 3;
  ctx.fillStyle = color;

  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawBubbles(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  const bubbleCount = 30;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (let i = 0; i < bubbleCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 40 + 20;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Add highlight for bubble effect
    ctx.beginPath();
    ctx.arc(x - radius / 3, y - radius / 3, radius / 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawDiagonal(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  const spacing = 30;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Diagonal lines from top-left to bottom-right
  for (let i = -height; i < width + height; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }
}

function drawWaves(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  const amplitude = 20;
  const frequency = 0.02;
  const spacing = 40;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (let y = 0; y < height; y += spacing) {
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      const waveY = y + Math.sin(x * frequency) * amplitude;
      if (x === 0) {
        ctx.moveTo(x, waveY);
      } else {
        ctx.lineTo(x, waveY);
      }
    }
    ctx.stroke();
  }
}
