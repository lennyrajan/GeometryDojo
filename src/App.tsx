import { useState } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { LevelGrid } from './components/LevelGrid';
import { CanvasBoard } from './components/CanvasBoard';
import { Leaderboard } from './components/Leaderboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsMenu } from './components/SettingsMenu';
import { Level } from './lib/shapes';
import levels from './lib/shapes';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

function App() {

    const {
        unlockedLevels,
        scores,
        submitScore,
        playerName,
        setPlayerName,
        difficulty,
        setDifficulty,
        clearLeaderboard,
        factoryReset,
        allPlayers,
        addPlayer,
        switchPlayer,
        activePlayer,
        deletePlayer
    } = useGameStore();


    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [viewingLeaderboard, setViewingLeaderboard] = useState(false);
    const [showingSettings, setShowingSettings] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const handleLevelSelect = (level: Level) => {
        setCurrentLevel(level);
    };

    const handleLevelComplete = (score: number) => {
        if (currentLevel) {
            submitScore(currentLevel.id, score);
        }
    };

    const handleNextLevel = () => {
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

    // 1. Welcome Screen Check (Only if NO name set ever)
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
                currentDifficulty={difficulty}
                onSetDifficulty={setDifficulty}
            />
        );
    }

    return (
        <div className={`w-full h-screen bg-zinc-950 text-white overflow-hidden flex flex-col transition-colors duration-500`}>
            {/* Settings Modal */}
            {showingSettings && (
                <SettingsMenu
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
                    players={allPlayers}
                    activePlayerId={activePlayer.id}
                    onAddPlayer={addPlayer}
                    onSwitchPlayer={switchPlayer}
                    onDeletePlayer={deletePlayer}
                />
            )}

            {/* Consolidated Game Header (Only in Level) */}
            {currentLevel && (
                <div className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none">

                    <div className="pointer-events-auto flex items-center gap-2">
                        <button
                            onClick={() => setCurrentLevel(null)}
                            className="p-2 bg-black/40 backdrop-blur rounded-full text-white hover:bg-white/10 transition-colors border border-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-3 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/5 shadow-lg">
                        <span className="text-white font-bold text-sm tracking-widest uppercase">
                            {currentLevel.name}
                        </span>
                        <div className="w-1 h-3 bg-white/20 rounded-full"></div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                            {difficulty}
                        </span>
                        <div className="w-1 h-3 bg-white/20 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-400 text-xs uppercase tracking-wider">Best:</span>
                            <span className="text-white font-mono font-bold">
                                {scores[currentLevel.id]?.toFixed(1) || "0.0"}%
                            </span>
                        </div>
                    </div>

                    <div className="pointer-events-auto">
                        <button
                            onClick={() => setResetKey(k => k + 1)}
                            className="p-2 bg-black/40 backdrop-blur rounded-full text-white hover:bg-white/10 transition-colors border border-white/5"
                            title="Restart Level"
                        >
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Game Board */}
            {currentLevel ? (
                <CanvasBoard
                    key={`${currentLevel.id}-${resetKey}`}
                    level={currentLevel}
                    difficulty={difficulty}
                    bestScore={scores[currentLevel.id]}
                    onComplete={(score) => handleLevelComplete(score)}
                    onNext={handleNextLevel}
                />
            ) : (
                <LevelGrid
                    unlockedLevels={unlockedLevels}
                    scores={scores}
                    onSelectLevel={handleLevelSelect}
                    onReset={() => setShowingSettings(true)}
                    onViewLeaderboard={() => setViewingLeaderboard(true)}
                />
            )}
        </div>
    );
}

export default App;
