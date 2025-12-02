import React, { useRef, useEffect, useState } from "react";

interface PulsarGridBackgroundProps {
  children: React.ReactNode;
  backgroundColor?: string;
  dotColor?: string;
  gridSpacing?: number;
}

export const PulsarGridBackground: React.FC<PulsarGridBackgroundProps> = ({
  children,
  backgroundColor = "#050B10",
  dotColor = "rgba(0, 255, 156, 1)",
  gridSpacing = 30,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number, height: number;
    let dots: any[] = [];
    let frameId: number;
    let time = 0;

    class Dot {
      x: number;
      y: number;
      baseSize: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseSize = 1;
      }

      draw() {
        const dist = Math.hypot(this.x - mousePos.x, this.y - mousePos.y);
        const wave = Math.sin(dist * 0.03 - time * 0.05);
        const size = this.baseSize + Math.max(0, wave) * 3;
        const opacity = Math.max(0, wave * 1.2 - 0.2);

        if (opacity > 0 && ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
          ctx.fillStyle = dotColor.replace(/[\d.]+\)$/, `${opacity})`);
          ctx.shadowColor = dotColor;
          ctx.shadowBlur = 10;
          ctx.fill();
        }
      }
    }

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      dots = [];
      for (let x = 0; x < width; x += gridSpacing) {
        for (let y = 0; y < height; y += gridSpacing) {
          dots.push(new Dot(x + gridSpacing / 2, y + gridSpacing / 2));
        }
      }

      if (mousePos.x === 0 && mousePos.y === 0) {
        setMousePos({ x: width / 2, y: height / 2 });
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      dots.forEach((dot: any) => dot.draw());
      time++;
      frameId = requestAnimationFrame(animate);
    };

    setup();
    animate();

    window.addEventListener("resize", setup);

    return () => {
      window.removeEventListener("resize", setup);
      cancelAnimationFrame(frameId);
    };
  }, [dotColor, gridSpacing, mousePos]);

  return (
    <div
      className="relative min-h-screen w-full"
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
