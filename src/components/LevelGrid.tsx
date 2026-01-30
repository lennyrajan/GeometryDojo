import React from 'react';
import { Level } from '../lib/shapes';
import { Lock, Trophy } from 'lucide-react';
import levels from '../lib/shapes';

interface LevelGridProps {
    unlockedLevels: number[];
    scores: Record<number, number>;
    onSelectLevel: (level: Level) => void;
}

export const LevelGrid: React.FC<LevelGridProps> = ({ unlockedLevels, scores, onSelectLevel }) => {
    return (
        <div className="p-6 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Geometry Dojo</h1>
            <p className="text-zinc-400 mb-8">Master the shapes. 99.5% for perfection.</p>

            <div className="grid grid-cols-2 gap-4 pb-20">
                {levels.map(level => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    const score = scores[level.id] || 0;
                    const isPerfect = score >= 100; // Or 99.9? User said 100.0 returns Cup.

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
    );
};
