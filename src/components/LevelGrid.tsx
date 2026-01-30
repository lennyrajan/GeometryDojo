import React from 'react';
import { Level } from '../lib/shapes';
import { Trophy, Settings, Lock } from 'lucide-react';
import levels from '../lib/shapes';
import { Difficulty } from '../types';

interface LevelGridProps {
    unlockedLevels: number[];
    scores: Record<number, number>;
    onSelectLevel: (level: Level) => void;
    onViewLeaderboard: () => void;
    onOpenSettings: () => void;
    activeDifficulty: Difficulty;
    theme: 'space' | 'classic';
    playerName: string;
}

export const LevelGrid: React.FC<LevelGridProps> = ({
    unlockedLevels,
    scores,
    onSelectLevel,
    onViewLeaderboard,
    onOpenSettings,
    activeDifficulty,
    theme,
    playerName
}: LevelGridProps) => {
    const greeting = React.useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    const DynamicSubtitle = () => {
        const quotes = React.useMemo(() => [
            "Trace perfectly.",
            "Steady hand, focused mind.",
            "Precision is key.",
            "Can you reach 100%?",
            "The shape awaits.",
            "Master the geometry.",
            "Flow like water.",
            "Perfection is a journey.",
            "Mind like a mirror.",
            "Focus determines reality.",
            "Strength through geometry.",
            "Breath in, draw out.",
            "The master was once a student.",
            "Simplicity is the ultimate sophistication.",
            "One line at a time.",
            "Find your center.",
            "Harmony in symmetry.",
            "Precision is silence.",
            "Quiet the noise, see the shape.",
            "A steady hand starts with a steady heart."
        ], []);

        const [index, setIndex] = React.useState(0);
        const [key, setKey] = React.useState(0);

        React.useEffect(() => {
            const interval = setInterval(() => {
                setIndex((prev: number) => (prev + 1) % quotes.length);
                setKey((prev: number) => prev + 1);
            }, 4000); // Matches CSS animation duration
            return () => clearInterval(interval);
        }, [quotes.length]);

        return (
            <p key={key} className="text-zinc-400 text-[10px] sm:text-xs max-w-[200px] leading-tight font-medium animate-fade-in-out">
                {quotes[index]}
            </p>
        );
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                        Geometry Dojo
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 leading-none rounded-md border border-white/5 ${activeDifficulty === 'easy' ? 'bg-green-500/10 text-green-400' :
                            activeDifficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-red-500/10 text-red-400'
                            }`}>
                            {activeDifficulty}
                        </span>
                    </h1>
                    <DynamicSubtitle />
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] opacity-70">
                            {greeting}
                        </span>
                        <span className="text-sm font-bold text-white tracking-tight">
                            {playerName}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onViewLeaderboard}
                            className={`p-2.5 rounded-xl transition-all border ${theme === 'space' ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'} shadow-lg`}
                            title="Leaderboard"
                        >
                            <Trophy className="w-4 h-4 text-yellow-500" />
                        </button>
                        <button
                            onClick={onOpenSettings}
                            className={`p-2.5 rounded-xl transition-all border ${theme === 'space' ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'} shadow-lg`}
                            title="Settings"
                        >
                            <Settings className={`w-4 h-4 ${theme === 'space' ? 'text-indigo-200' : 'text-zinc-400'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                    {levels.map(level => {
                        const isUnlocked = unlockedLevels.includes(level.id);
                        const score = scores[level.id] || 0;
                        const isPerfect = score >= 100;

                        return (
                            <button
                                key={level.id}
                                disabled={!isUnlocked}
                                onClick={() => onSelectLevel(level)}
                                className={`
                    relative rounded-xl p-3 flex flex-col items-center justify-center gap-1 border transition-all min-h-24
                    ${isUnlocked
                                        ? theme === 'space'
                                            ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95'
                                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 active:scale-95'
                                        : theme === 'space'
                                            ? 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                                            : 'bg-zinc-950 border-zinc-900 opacity-50 cursor-not-allowed'}
                  `}
                            >
                                <div className="text-2xl mb-1 font-thin text-zinc-500">
                                    {level.id}
                                </div>

                                <div className="text-xs font-medium text-zinc-300 text-center w-full px-1">
                                    {level.name}
                                </div>

                                {isUnlocked && (
                                    <div className={`text-[10px] font-mono font-bold ${score >= 92.0 ? "text-green-500" : "text-zinc-600"}`}>
                                        {score > 0 ? `${score.toFixed(1)}%` : "0.0%"}
                                    </div>
                                )}

                                {/* Locked Overlay */}
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                                        <Lock className="w-6 h-6 text-zinc-700" />
                                    </div>
                                )}

                                {/* Trophy */}
                                {isPerfect && (
                                    <div className="absolute top-1 right-1 text-yellow-500">
                                        <Trophy className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};
