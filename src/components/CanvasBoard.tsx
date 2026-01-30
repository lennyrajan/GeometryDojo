import React, { useRef, useEffect, useState } from 'react';
import { Level } from '../lib/shapes';
import { Point, calculateScore } from '../lib/geometry';
import { RefreshCcw, ZoomIn, Check } from 'lucide-react';

interface CanvasBoardProps {
    level: Level;
    onComplete: (score: number) => void;
    onNext?: () => void;
    bestScore?: number;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ level, onComplete, onNext }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [result, setResult] = useState<{ score: number; diffs: number[]; alignedUserPath: Point[] } | null>(null);
    const [showTarget, setShowTarget] = useState(true);

    // Dimensions for normalization
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

    // Zoom/Pan State
    const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const lastCenter = useRef<Point>({ x: 0, y: 0 });

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const { width, height } = canvasRef.current.getBoundingClientRect();
                canvasRef.current.width = width;
                canvasRef.current.height = height;
                setDimensions({ w: width, h: height });
                draw();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [level, result]);

    useEffect(() => {
        // Reset when level changes
        setPoints([]);
        setResult(null);
        setIsDrawing(false);
        setIsDrawing(false);
        setShowTarget(true);
        setTransform({ k: 1, x: 0, y: 0 }); // Reset zoom
        setIsZooming(false);
        draw();
    }, [level]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;
        const size = Math.min(w, h);
        const offsetX = (w - size) / 2;
        const offsetY = (h - size) / 2;

        // Apply Transform
        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k);

        // Helper to map normalized point to canvas (Aspect Correct)
        const toCanvas = (p: Point) => ({
            x: p.x * size + offsetX,
            y: p.y * size + offsetY
        });

        // Draw Target Shape (Faint Guide)
        if (showTarget || result) {
            const targetPoints = level.shape.map(toCanvas);
            ctx.beginPath();
            ctx.strokeStyle = result ? '#333' : 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = result ? 2 : 4;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            if (targetPoints.length > 0) {
                ctx.moveTo(targetPoints[0].x, targetPoints[0].y);
                for (let i = 1; i < targetPoints.length; i++) {
                    ctx.lineTo(targetPoints[i].x, targetPoints[i].y);
                }
            }
            ctx.stroke();
        }

        // Draw User Path
        if (points.length > 0 && !result) {
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // Points are already stored as raw canvas coords, so draw directly?
            // Wait, points are raw canvas coords (pixels).
            // We need to ensure they align visually with the transformed view?
            // No, user draws in raw pixels. Transform applies to the VIEW of the canvas if we used ctx.scale on the whole thing.
            // But here we apply ctx.translate/scale Manually for the ZOOM feature?
            // Yes, transform applies to everything inside ctx.save().
            // So if user draws, points are raw pixels. 
            // If we are zoomed in, we need to transform the points to match the zoom?
            // Or does the user draw continuously in "screen space"?
            // Usually user draws in screen space. The canvas is just a buffer.

            // Current implementation stores points in raw pixel coords (getPoint).
            // But we apply ctx.transform before drawing user path.
            // This means if we pan/zoom, the user's existing drawing moves.
            // That is correct for Review mode.
            // But during drawing, isZooming is false/transform is identity.

            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }

        // Draw Result (Heatmap)
        if (result) {
            const { alignedUserPath, diffs } = result;
            const alignedCanvas = alignedUserPath.map(toCanvas);

            for (let i = 0; i < alignedCanvas.length - 1; i++) {
                ctx.beginPath();
                const diff = diffs[i];
                const goodness = Math.max(0, 1 - (diff * 20));
                const hue = goodness * 120;

                ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.lineWidth = 4;
                ctx.moveTo(alignedCanvas[i].x, alignedCanvas[i].y);
                ctx.lineTo(alignedCanvas[i + 1].x, alignedCanvas[i + 1].y);
                ctx.stroke();
            }
        }

        ctx.restore();
    };

    useEffect(() => {
        draw();
    }, [points, result, dimensions, transform]);

    const getPoint = (e: React.MouseEvent | React.TouchEvent | PointerEvent): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        // Return raw pixel coordinates relative to canvas
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.PointerEvent) => {
        if (result) {
            if (isZooming) {
                e.currentTarget.setPointerCapture(e.pointerId);
                lastCenter.current = { x: e.clientX, y: e.clientY };
            }
            return;
        }
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDrawing(true);
        setPoints([]);
        const p = getPoint(e);
        if (p) setPoints([p]);
    };

    const moveDrawing = (e: React.PointerEvent) => {
        if (result && isZooming) {
            const dx = e.clientX - lastCenter.current.x;
            const dy = e.clientY - lastCenter.current.y;
            setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
            lastCenter.current = { x: e.clientX, y: e.clientY };
            return;
        }

        if (!isDrawing) return;
        const p = getPoint(e);
        if (p) {
            setPoints(prev => [...prev, p]);
        }
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (points.length < 5) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Normalize using the SAME aspect-correct logic as the visual guide
        const w = canvas.width;
        const h = canvas.height;
        const size = Math.min(w, h);
        const offsetX = (w - size) / 2;
        const offsetY = (h - size) / 2;

        const normalizedPoints = points.map(p => ({
            x: (p.x - offsetX) / size,
            y: (p.y - offsetY) / size
        }));

        const res = calculateScore(normalizedPoints, level.shape);
        setResult(res);
        onComplete(res.score);

        if (navigator.vibrate) {
            if (res.score >= 92.0) {
                navigator.vibrate([100, 50, 100]);
            } else {
                navigator.vibrate(200);
            }
        }
    };

    const reset = () => {
        setPoints([]);
        setResult(null);
        setIsDrawing(false);
        setIsZooming(false);
        setTransform({ k: 1, x: 0, y: 0 });
    };

    const toggleZoom = () => {
        if (!isZooming) {
            setTransform({ k: 2, x: -dimensions.w / 2, y: -dimensions.h / 2 }); // Initial zoom in to center
            setIsZooming(true);
        } else {
            setTransform({ k: 1, x: 0, y: 0 });
            setIsZooming(false);
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
            <canvas
                ref={canvasRef}
                className="w-full h-full touch-none cursor-crosshair"
                onPointerDown={startDrawing}
                onPointerMove={moveDrawing}
                onPointerUp={endDrawing}
                onPointerLeave={endDrawing}
            />

            {/* HUD during drawing */}
            <div className="absolute top-4 left-4 text-white font-mono text-sm opacity-50 pointer-events-none">
                {level.name}
            </div>

            {/* Result Overlay */}
            {result && !isZooming && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                    <div className="text-6xl font-black text-white mb-2" style={{ color: result.score >= 92.0 ? '#4ade80' : '#f87171' }}>
                        {result.score.toFixed(1)}%
                    </div>
                    <div className="text-white/70 mb-8 font-mono">
                        {result.score >= 92.0 ? "PASSED" : "TRY AGAIN"}
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <button
                            onClick={toggleZoom}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ZoomIn className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={reset}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <RefreshCcw className="w-6 h-6 text-white" />
                        </button>
                        {result.score >= level.unlockScore && onNext && (
                            <button
                                onClick={onNext}
                                className="p-4 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                            >
                                <Check className="w-6 h-6 text-white" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Zoom Controls Overlay */}
            {isZooming && (
                <div className="absolute bottom-8 right-8 flex gap-2 pointer-events-auto">
                    <button
                        onClick={() => setTransform(t => ({ ...t, k: t.k * 1.2 }))}
                        className="p-3 bg-white/10 backdrop-blur rounded-full"
                    >
                        +
                    </button>
                    <button
                        onClick={() => setTransform(t => ({ ...t, k: t.k / 1.2 }))}
                        className="p-3 bg-white/10 backdrop-blur rounded-full"
                    >
                        -
                    </button>
                    <button
                        onClick={toggleZoom}
                        className="p-3 bg-red-500/80 backdrop-blur rounded-full text-sm font-bold"
                    >
                        X
                    </button>
                </div>
            )}

            {/* Guide Text if empty */}
            {points.length === 0 && !result && (
                <div className="absolute bottom-12 text-white/30 text-sm pointer-events-none animate-pulse">
                    Draw the shape in one stroke
                </div>
            )}
        </div>
    );
};
