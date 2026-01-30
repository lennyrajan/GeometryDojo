import React from 'react';
import { Level } from '../lib/shapes';
import { Lock, Trophy, Settings } from 'lucide-react';
import levels from '../lib/shapes';

interface LevelGridProps {
    unlockedLevels: number[];
    scores: Record<number, number>;
    onSelectLevel: (level: Level) => void;
    onReset: () => void;
    onViewLeaderboard: () => void;
}

export const LevelGrid: React.FC<LevelGridProps> = ({ unlockedLevels, scores, onSelectLevel, onReset, onViewLeaderboard }) => {
    return (
        <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold text-white mb-1">Geometry Dojo</h1>
                    <p className="text-zinc-400 text-xs max-w-[200px] leading-tight">
                        Trace perfectly. <br />
                        <span className="text-green-500 font-bold">92%</span> accuracy required.
                    </p>
                </div>
                <button
                    onClick={onViewLeaderboard}
                    className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800"
                    title="Leaderboard"
                >
                    <Trophy className="w-4 h-4 text-yellow-500" />
                </button>
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
                    relative rounded-xl p-3 flex flex-col items-center justify-center gap-1 border transition-all h-24
                    ${isUnlocked
                                        ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 active:scale-95'
                                        : 'bg-zinc-950 border-zinc-900 opacity-50 cursor-not-allowed'}
                  `}
                            >
                                <div className="text-2xl mb-1 font-thin text-zinc-500">
                                    {level.id}
                                </div>

                                <div className="text-xs font-medium text-zinc-300 text-center truncate w-full px-1">
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

            <div className="mt-2 pt-3 border-t border-zinc-900 flex justify-center">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest hover:bg-zinc-900 rounded-lg transition-all"
                >
                    <Settings className="w-3 h-3" />
                    Settings
                </button>
            </div>
        </div>
    );
};
