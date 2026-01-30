import React, { useRef, useEffect, useState } from 'react';
import { Level } from '../lib/shapes';
import { calculateScore, Point } from '../lib/geometry';
import { Difficulty } from '../types';
import { Check, Play, X } from 'lucide-react';

interface CanvasBoardProps {
    level: Level;
    difficulty: Difficulty;
    onComplete: (score: number) => void;
    onNext?: () => void;
    bestScore?: number;
    theme?: 'space' | 'classic'; // Optional to avoid breaking replay if strict
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ level, difficulty, onComplete, onNext, theme = 'space' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [result, setResult] = useState<{ score: number; diffs: number[]; alignedUserPath: Point[] } | null>(null);
    const [showTarget, setShowTarget] = useState(true);

    // Replay State
    const [isReplaying, setIsReplaying] = useState(false);
    const [replayProgress, setReplayProgress] = useState(0);
    const replayFrameRef = useRef<number>();

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
    }, [level, result, replayProgress, isReplaying]); // Add replay deps

    useEffect(() => {
        // Reset when level changes
        setPoints([]);
        setResult(null);
        setIsDrawing(false);
        setShowTarget(true);
        stopReplay();
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

        // Apply Transform - REMOVED for Replay Mode (keep static)
        ctx.save();
        // ctx.translate(transform.x, transform.y);
        // ctx.scale(transform.k, transform.k);

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

            // Limit drawing based on replay progress
            const limit = isReplaying ? replayProgress : alignedCanvas.length;

            for (let i = 0; i < limit - 1; i++) {
                if (i >= alignedCanvas.length - 1) break;
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
    }, [points, result, dimensions, isReplaying, replayProgress]);

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
        if (result) return; // Disable interaction if result exists
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDrawing(true);
        setPoints([]);
        const p = getPoint(e);
        if (p) setPoints([p]);
    };

    const moveDrawing = (e: React.PointerEvent) => {
        if (result) return; // Disable interaction if result exists
        if (!isDrawing) return;
        const p = getPoint(e);
        if (p) {
            setPoints(prev => [...prev, p]);
        }
    };

    // Replay Logic
    const startReplay = () => {
        if (!result) return;
        setIsReplaying(true);
        setReplayProgress(0);

        const totalPoints = result.alignedUserPath.length;
        const speed = Math.max(1, Math.floor(totalPoints / 60)); // Adjust speed based on length

        const animate = () => {
            setReplayProgress(prev => {
                const next = prev + speed;
                if (next >= totalPoints) {
                    return totalPoints; // Keep it at max
                }
                replayFrameRef.current = requestAnimationFrame(animate);
                return next;
            });
        };
        replayFrameRef.current = requestAnimationFrame(animate);
    };

    const stopReplay = () => {
        if (replayFrameRef.current) cancelAnimationFrame(replayFrameRef.current);
        setIsReplaying(false);
        setReplayProgress(0);
    };

    // Dynamic Feedback Messages
    const successMessages = ["Flawless!", "Geometry God!", "Perfect Form!", "Algorithm Approved!", "Pixel Perfect!", "Sublime!", "Exceptional!"];
    const failureMessages = ["Adjust Your Angle", "Focus Breathing", "Steady Hand Needed", "Alignment Error", "Recalibrate...", "Close, But No", "Try Again"];
    const [feedbackMessage, setFeedbackMessage] = useState("");

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

        const res = calculateScore(normalizedPoints, level.shape, difficulty);
        setResult(res);
        onComplete(res.score);

        // Select random feedback message
        if (res.score >= 92.0) {
            setFeedbackMessage(successMessages[Math.floor(Math.random() * successMessages.length)]);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        } else {
            setFeedbackMessage(failureMessages[Math.floor(Math.random() * failureMessages.length)]);
            if (navigator.vibrate) navigator.vibrate(200);
        }
    };





    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <canvas
                ref={canvasRef}
                className="w-full h-full touch-none cursor-crosshair"
                onPointerDown={startDrawing}
                onPointerMove={moveDrawing}
                onPointerUp={endDrawing}
                onPointerLeave={endDrawing}
            />

            {/* HUD during drawing */}


            {/* Result Overlay */}
            {result && !isReplaying && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none ${theme === 'space' ? 'bg-indigo-950/80' : 'bg-black/80'}`}>
                    <div className="text-6xl font-black text-white mb-2" style={{ color: result.score >= 92.0 ? '#4ade80' : '#f87171' }}>
                        {result.score.toFixed(1)}%
                    </div>
                    <div className="text-white/70 mb-8 font-mono tracking-widest uppercase">
                        {feedbackMessage}
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <button
                            onClick={startReplay}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <Play className="w-6 h-6 text-white" />
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

            {/* Replay Controls Overlay */}
            {isReplaying && (
                <div className="absolute bottom-8 right-8 flex gap-2 pointer-events-auto">
                    <button
                        onClick={stopReplay}
                        className="p-3 bg-red-500/80 backdrop-blur rounded-full text-sm font-bold text-white shadow-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Controls */}
            <div className="flex justify-between items-center px-6 pb-8">


                {result && !isDrawing && (
                    <div className="flex gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <button
                            onClick={startReplay}
                            disabled={isReplaying}
                            className={`px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${isReplaying
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : theme === 'space'
                                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-zinc-100 text-black hover:bg-white'
                                }`}
                        >
                            {isReplaying ? (
                                <>
                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                    Replaying
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Replay
                                </>
                            )}
                        </button>

                        {onNext && result.score >= 92 && (
                            <button
                                onClick={onNext}
                                className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${theme === 'space'
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-green-500 hover:bg-green-400 text-black'
                                    }`}
                            >
                                <Check className="w-5 h-5" />
                                Next
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Guide Text if empty */}
            {points.length === 0 && !result && (
                <div className="absolute bottom-12 text-white/30 text-sm pointer-events-none animate-pulse">
                    Draw the shape in one stroke
                </div>
            )}
        </div>
    );
};
