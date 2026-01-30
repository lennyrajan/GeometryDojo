import { useState } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { LevelGrid } from './components/LevelGrid';
import { CanvasBoard } from './components/CanvasBoard';
import { Leaderboard } from './components/Leaderboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsMenu } from './components/SettingsMenu';
import { Level } from './lib/shapes';
import levels from './lib/shapes';
import { ArrowLeft } from 'lucide-react';

function App() {

    const {
        unlockedLevels,
        scores,
        submitScore,
        playerName,
        setPlayerName,
        theme,
        setTheme,
        difficulty,
        setDifficulty,
        clearLeaderboard,
        factoryReset
    } = useGameStore();

    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [viewingLeaderboard, setViewingLeaderboard] = useState(false);
    const [showingSettings, setShowingSettings] = useState(false);

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

    // 1. Welcome Screen Check
    if (!playerName) {
        return <WelcomeScreen onComplete={(name, diff) => {
            setPlayerName(name);
            setDifficulty(diff);
        }} />;
    }

    // 2. Leaderboard View
    if (viewingLeaderboard) {
        return (
            <Leaderboard
                scores={scores}
                playerName={playerName}
                onBack={() => setViewingLeaderboard(false)}
            />
        );
    }

    return (
        <div className={`w-full h-screen bg-zinc-950 overflow-hidden flex flex-col transition-colors duration-500 theme-${theme}`}>
            {/* Settings Modal */}
            {showingSettings && (
                <SettingsMenu
                    currentTheme={theme}
                    onSetTheme={setTheme}
                    currentDifficulty={difficulty}
                    onSetDifficulty={setDifficulty}
                    onClose={() => setShowingSettings(false)}
                    onClearLeaderboard={() => {
                        clearLeaderboard();
                        setShowingSettings(false);
                    }}
                    onFactoryReset={() => {
                        factoryReset();
                        setShowingSettings(false);
                    }}
                />
            )}

            {/* Game Header */}
            {currentLevel && (
                <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-center pointer-events-none">
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

            {/* Game Board */}
            {currentLevel ? (
                <CanvasBoard
                    level={currentLevel}
                    difficulty={difficulty}
                    bestScore={scores[currentLevel.id]}
                    onComplete={(score) => handleLevelComplete(currentLevel, score)}
                    onNext={handleNextLevel}
                />
            ) : (
                <LevelGrid
                    unlockedLevels={unlockedLevels}
                    scores={scores}
                    onSelectLevel={handleLevelSelect}
                    onReset={() => setShowingSettings(true)} // Re-purposed "Reset" button to open Settings for now, or we update LevelGrid prop name
                    onViewLeaderboard={() => setViewingLeaderboard(true)}
                />
            )}
        </div>
    );
}

export default App;
