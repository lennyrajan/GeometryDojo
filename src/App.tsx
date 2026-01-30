import { useState } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { LevelGrid } from './components/LevelGrid';
import { CanvasBoard } from './components/CanvasBoard';
import { Leaderboard } from './components/Leaderboard';
import { Level } from './lib/shapes';
import levels from './lib/shapes';
import { ArrowLeft } from 'lucide-react';

function App() {
    const { unlockedLevels, scores, submitScore, resetProgress } = useGameStore();
    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [viewingLeaderboard, setViewingLeaderboard] = useState(false);

    const handleLevelSelect = (level: Level) => {
        setCurrentLevel(level);
    };

    const handleComplete = (score: number) => {
        if (currentLevel) {
            submitScore(currentLevel.id, score);
        }
    };

    const handleNext = () => {
        if (currentLevel) {
            const nextId = currentLevel.id + 1;
            const nextLevel = levels.find(l => l.id === nextId);
            if (nextLevel && unlockedLevels.includes(nextId)) {
                setCurrentLevel(nextLevel);
            } else {
                setCurrentLevel(null);
            }
        }
    };

    if (viewingLeaderboard) {
        return (
            <Leaderboard
                scores={scores}
                onBack={() => setViewingLeaderboard(false)}
            />
        );
    }

    return (
        <div className="w-full h-screen bg-black overflow-hidden flex flex-col">
            {/* Game Header */}
            {currentLevel && (
                <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center pointer-events-none">
                    <button
                        onClick={() => setCurrentLevel(null)}
                        className="pointer-events-auto p-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="pointer-events-auto px-4 py-2 bg-black/30 backdrop-blur rounded-full">
                        <span className="text-white font-bold text-sm tracking-widest uppercase opacity-80">
                            {currentLevel.name}
                        </span>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-2 bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                        <span className="text-zinc-400 text-xs uppercase tracking-wider">Best:</span>
                        <span className="text-white font-mono font-bold">
                            {scores[currentLevel.id]?.toFixed(1) || "0.0"}%
                        </span>
                    </div>
                </div>
            )}

            {currentLevel ? (
                <CanvasBoard
                    level={currentLevel}
                    onComplete={handleComplete}
                    onNext={handleNext}
                    bestScore={scores[currentLevel.id]}
                />
            ) : (
                <LevelGrid
                    unlockedLevels={unlockedLevels}
                    scores={scores}
                    onSelectLevel={handleLevelSelect}
                    onReset={resetProgress}
                    onViewLeaderboard={() => setViewingLeaderboard(true)}
                />
            )}
        </div>
    );
}

export default App;
