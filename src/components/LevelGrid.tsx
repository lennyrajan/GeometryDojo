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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Geometry Dojo</h1>
                    <p className="text-foreground/60 text-sm max-w-[200px] leading-relaxed">
                        Trace the shapes perfectly. <br />
                        <span className="text-primary font-bold">92%</span> algorithm accuracy required to pass.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onViewLeaderboard}
                        className="p-3 bg-background border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                        title="Leaderboard"
                    >
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </button>
                    <button
                        onClick={onReset} // This triggers Settings
                        className="p-3 bg-background border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5 text-foreground/70" />
                    </button>
                </div>
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
                                        ? 'bg-background border-white/10 hover:border-white/30 active:scale-95'
                                        : 'bg-background/20 border-transparent opacity-50 cursor-not-allowed'}
                  `}
                            >
                                <div className="text-4xl mb-2 font-thin text-foreground/40">
                                    {level.id}
                                </div>

                                <div className="text-sm font-medium text-foreground/80 text-center">
                                    {level.name}
                                </div>

                                {isUnlocked && (
                                    <div className={`text-xs font-mono font-bold ${score >= 92.0 ? "text-primary" : "text-foreground/50"}`}>
                                        {score > 0 ? `${score.toFixed(1)}%` : "0.0%"}
                                    </div>
                                )}

                                {/* Locked Overlay */}
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                                        <Lock className="w-8 h-8 text-white/50" />
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
        </div>
    );
};
    );
};
