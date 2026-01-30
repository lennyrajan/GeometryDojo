import React, { useRef, useEffect, useState } from 'react';
import { Level } from '../lib/shapes';
import { Point, calculateScore, fitToBox, getBoundingBox } from '../lib/geometry';
import { RefreshCcw, ZoomIn, Check } from 'lucide-react';

interface CanvasBoardProps {
    level: Level;
    onComplete: (score: number) => void;
    onNext?: () => void;
    bestScore?: number;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ level, onComplete, onNext, bestScore }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [result, setResult] = useState<{ score: number; diffs: number[]; alignedUserPath: Point[] } | null>(null);
    const [showTarget, setShowTarget] = useState(true);

    // Dimensions for normalization
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

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
        setShowTarget(true);
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

        // Helper to map normalized point to canvas
        const toCanvas = (p: Point) => ({ x: p.x * w, y: p.y * h });

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
                if (level.shape.length > 2) { // Auto-close visual if it's a polygon
                    // check if last point is same as first? 
                    // Our shapes defined in levels usually close themselves or we should close them
                    // level.shape for polygons usually has first == last or we just iterate
                    // The definitions uses createPoly which loops <= sides so it closes.
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
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }

        // Draw Result (Heatmap)
        if (result) {
            const { alignedUserPath, diffs } = result;
            // We need to map the aligned path (which is normalized 0-1) to canvas
            const alignedCanvas = alignedUserPath.map(toCanvas);

            // Draw segment by segment with color based on diff
            for (let i = 0; i < alignedCanvas.length - 1; i++) {
                ctx.beginPath();
                const diff = diffs[i];
                // Green (low diff) -> Red (high diff)
                // Diff 0 -> 120 (Green)
                // Diff 0.05 -> 0 (Red)
                const goodness = Math.max(0, 1 - (diff * 20)); // Amplified diff for color
                const hue = goodness * 120;

                ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.lineWidth = 4;
                ctx.moveTo(alignedCanvas[i].x, alignedCanvas[i].y);
                ctx.lineTo(alignedCanvas[i + 1].x, alignedCanvas[i + 1].y);
                ctx.stroke();
            }
        }
    };

    useEffect(() => {
        draw();
    }, [points, result, dimensions]);

    const getPoint = (e: React.MouseEvent | React.TouchEvent | PointerEvent): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        // allow drawing outside canvas bounds? no, clamp or just record
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.PointerEvent) => {
        if (result) return; // Locked results
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDrawing(true);
        setPoints([]);
        const p = getPoint(e);
        if (p) setPoints([p]);
    };

    const moveDrawing = (e: React.PointerEvent) => {
        if (!isDrawing) return;
        const p = getPoint(e);
        if (p) {
            setPoints(prev => [...prev, p]);
        }
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        // Process core
        if (points.length < 5) return; // Too short

        // Normalize user points to 0-1 for scoring
        const canvas = canvasRef.current;
        if (!canvas) return;

        const normalizedPoints = points.map(p => ({
            x: p.x / canvas.width,
            y: p.y / canvas.height
        }));

        const res = calculateScore(normalizedPoints, level.shape);
        setResult(res);
        onComplete(res.score);

        if (navigator.vibrate) {
            if (res.score >= 99.5) {
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
            {result && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                    <div className="text-6xl font-black text-white mb-2" style={{ color: result.score >= 99.5 ? '#4ade80' : '#f87171' }}>
                        {result.score.toFixed(1)}%
                    </div>
                    <div className="text-white/70 mb-8 font-mono">
                        {result.score >= 99.5 ? "PERFECT" : "TRY AGAIN"}
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
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

            {/* Guide Text if empty */}
            {points.length === 0 && !result && (
                <div className="absolute bottom-12 text-white/30 text-sm pointer-events-none animate-pulse">
                    Draw the shape in one stroke
                </div>
            )}
        </div>
    );
};
