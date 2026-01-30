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
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Geometry Dojo</h1>
                    <p className="text-zinc-400 text-sm max-w-[200px] leading-relaxed">
                        Trace the shapes perfectly. <br />
                        <span className="text-green-500 font-bold">92%</span> algorithm accuracy required to pass.
                    </p>
                </div>
                <button
                    onClick={onViewLeaderboard}
                    className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800"
                    title="Leaderboard"
                >
                    <Trophy className="w-5 h-5 text-yellow-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                <div className="grid grid-cols-2 gap-4">
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
                    relative aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-all
                    ${isUnlocked
                                        ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 active:scale-95'
                                        : 'bg-zinc-950 border-zinc-900 opacity-50 cursor-not-allowed'}
                  `}
                            >
                                <div className="text-4xl mb-2 font-thin text-zinc-500">
                                    {level.id}
                                </div>

                                <div className="text-sm font-medium text-zinc-300 text-center">
                                    {level.name}
                                </div>

                                {isUnlocked && (
                                    <div className={`text-xs font-mono font-bold ${score >= 92.0 ? "text-green-500" : "text-zinc-600"}`}>
                                        {score > 0 ? `${score.toFixed(1)}%` : "0.0%"}
                                    </div>
                                )}

                                {/* Locked Overlay */}
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                                        <Lock className="w-8 h-8 text-zinc-700" />
                                    </div>
                                )}

                                {/* Trophy */}
                                {isPerfect && (
                                    <div className="absolute top-2 right-2 text-yellow-500">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-center">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest hover:bg-zinc-900 rounded-lg transition-all"
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </button>
            </div>
        </div>
    );
};
