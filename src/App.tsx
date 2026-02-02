import { useState, useEffect } from 'react';
import { useGameStore } from './hooks/useGameStore';
import { LevelGrid } from './components/LevelGrid';
import { CanvasBoard } from './components/CanvasBoard';
import { Leaderboard } from './components/Leaderboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsMenu } from './components/SettingsMenu';
import { Level } from './lib/shapes';
import levels from './lib/shapes';
import { ArrowLeft, RefreshCcw, Info, X, Download } from 'lucide-react';
import { useGlobalLeaderboard } from './hooks/useGlobalLeaderboard';

const CURRENT_VERSION = '3.0.1';
const VERSION_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

function App() {

    const {
        unlockedLevels,
        scores,
        submitScore, // Renamed to updateScore in handleLevelComplete, assuming this is the intended change
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
        deletePlayer,
        theme,
        toggleTheme,
        getActivePlayerStats
    } = useGameStore();

    const { submitGlobalScore, syncAllProfiles } = useGlobalLeaderboard(difficulty, false);

    const [hasSynced, setHasSynced] = useState(false);
    const [needsUpdate, setNeedsUpdate] = useState(false);

    // Version Check
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const response = await fetch(`/version.json?t=${Date.now()}`);
                const data = await response.json();
                if (data.version && data.version !== CURRENT_VERSION) {
                    console.log(`Update available: ${data.version} (Current: ${CURRENT_VERSION})`);
                    setNeedsUpdate(true);
                }
            } catch (err) {
                console.error("Failed to check version:", err);
            }
        };

        checkVersion();
        const interval = setInterval(checkVersion, VERSION_CHECK_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // Background Sync on Mount
    useEffect(() => {
        if (!hasSynced && allPlayers.length > 0) {
            syncAllProfiles(allPlayers);
            setHasSynced(true);
        }
    }, [allPlayers, hasSynced, syncAllProfiles]);

    // Reliable Uplink: Watch for score changes and sync
    const activeStats = getActivePlayerStats(difficulty);
    useEffect(() => {
        if (!activePlayer || !activeStats) return;

        // PROTECTION: If local scores are wiped (totalScore is 0), 
        // DO NOT push this to the world leaderboard. 
        // This keeps the user's global high score safe even after a local reset.
        if (activeStats.totalScore === 0) return;

        // Use a small delay to ensure local saving is definitely finished 
        // and we aren't spamming Firestore on every slight change
        const timeout = setTimeout(() => {
            submitGlobalScore(activePlayer.id, activePlayer.name, difficulty, activeStats);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [activeStats.totalScore, activeStats.highestLevel, activePlayer?.id, activePlayer?.name, difficulty]);


    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [viewingLeaderboard, setViewingLeaderboard] = useState(false);
    const [showingSettings, setShowingSettings] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [showFact, setShowFact] = useState(false);
    const [gridScrollTop, setGridScrollTop] = useState(0);

    const handleLevelSelect = (level: Level) => {
        setCurrentLevel(level);
    };

    const handleLevelComplete = (accuracy: number) => {
        if (currentLevel) {
            submitScore(currentLevel.id, accuracy); // Assuming submitScore is the correct function, not updateScore
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
                players={allPlayers}
                activePlayerId={activePlayer.id}
                onBack={() => setViewingLeaderboard(false)}
                initialDifficulty={difficulty}
                theme={theme}
            />
        );
    }

    const bgClass = theme === 'space' ? 'bg-indigo-950' : 'bg-zinc-950';

    return (
        <div className={`w-full h-screen ${bgClass} text-white overflow-hidden flex flex-col transition-colors duration-500`}>
            {/* Dynamic Background (Applies to Game & Menu) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Update Notification */}
            {needsUpdate && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/50 flex items-center gap-2 border border-indigo-400/30"
                    >
                        <Download className="w-4 h-4" />
                        Update Ninja Dojo Available
                    </button>
                </div>
            )}

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
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            )}

            {/* Consolidated Game Header (Only in Level) */}
            {currentLevel && (
                <div className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none">

                    <div className="pointer-events-auto flex items-center gap-3">
                        <button
                            onClick={() => setCurrentLevel(null)}
                            className="p-2 bg-black/40 backdrop-blur rounded-full text-white hover:bg-white/10 transition-colors border border-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur rounded-full border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">{playerName}</span>
                        </div>
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

                    <div className="pointer-events-auto flex gap-2">
                        <button
                            onClick={() => setShowFact(true)}
                            className="p-2 bg-black/40 backdrop-blur rounded-full text-white hover:bg-white/10 transition-colors border border-white/5"
                        >
                            <Info className="w-5 h-5" />
                        </button>
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

            {/* Fact Modal */}
            {showFact && currentLevel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowFact(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                                <Info className="w-6 h-6" />
                            </div>

                            <h2 className="text-xl font-bold text-white">{currentLevel.name}</h2>

                            <p className="text-zinc-300 leading-relaxed text-sm">
                                {currentLevel.fact}
                            </p>

                            <button
                                onClick={() => setShowFact(false)}
                                className="mt-2 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Board */}
            {currentLevel ? (
                <CanvasBoard
                    level={currentLevel}
                    onComplete={handleLevelComplete}
                    onNext={handleNextLevel}
                    difficulty={difficulty}
                    key={resetKey}
                    theme={theme}
                />
            ) : (
                <LevelGrid
                    unlockedLevels={unlockedLevels}
                    scores={scores}
                    onSelectLevel={handleLevelSelect}
                    onViewLeaderboard={() => setViewingLeaderboard(true)}
                    onOpenSettings={() => setShowingSettings(true)}
                    activeDifficulty={difficulty}
                    theme={theme}
                    playerName={playerName}
                    initialScrollTop={gridScrollTop}
                    onScroll={setGridScrollTop}
                />
            )}
        </div>
    );
}

export default App;
