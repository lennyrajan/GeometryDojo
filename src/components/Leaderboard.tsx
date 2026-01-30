import React, { useState } from 'react';
import { ArrowLeft, Globe, User } from 'lucide-react';
import { Difficulty } from '../types';

interface LeaderboardProps {
    allScores: {
        easy: Record<number, number>;
        medium: Record<number, number>;
        hard: Record<number, number>;
    };
    playerName: string | null;
    onBack: () => void;
    initialDifficulty: Difficulty;
    theme: 'space' | 'classic';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ allScores, playerName, onBack, initialDifficulty, theme }) => {
    // Local state for viewing, disjoint from global game difficulty
    const [viewDifficulty, setViewDifficulty] = useState<Difficulty>(initialDifficulty);

    const scores = allScores[viewDifficulty];

    // Calculate User Stats
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const completedLevels = Object.keys(scores).length;
    const average = completedLevels > 0 ? totalScore / completedLevels : 0;

    // Mock Global Data (Could vary based on difficulty)
    const globalRankings = [
        { name: "GeometryGod", score: 99.8, rank: 1 },
        { name: "ShapeShifter", score: 99.5, rank: 2 },
        { name: "PolyGon", score: 99.1, rank: 3 },
        { name: "LineMaster", score: 98.7, rank: 4 },
        { name: "CircleFan", score: 98.2, rank: 5 },
        { name: "AngleAngel", score: 97.5, rank: 6 },
        { name: "VertexViper", score: 97.1, rank: 7 },
        { name: "EdgeLord", score: 96.8, rank: 8 },
    ];

    return (
        <div className={`flex flex-col h-full overflow-hidden ${theme === 'space' ? 'bg-indigo-950 text-white' : 'bg-zinc-950 text-white'}`}>
            {/* Header */}
            <div className="flex items-center gap-4 p-6 pb-2 shrink-0">
                <button
                    onClick={onBack}
                    className={`p-2 rounded-full transition-colors border ${theme === 'space' ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'}`}
                >
                    <ArrowLeft className={`w-5 h-5 ${theme === 'space' ? 'text-indigo-200' : 'text-zinc-400'}`} />
                </button>
                <h1 className="text-2xl font-bold">Leaderboard</h1>
            </div>

            {/* Difficulty Tabs */}
            <div className="px-6 py-4">
                <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                        <button
                            key={d}
                            onClick={() => setViewDifficulty(d)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${viewDifficulty === d
                                ? 'bg-white text-black shadow'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                {/* User Stats Card */}
                <div className={`rounded-2xl p-6 mb-8 border transition-colors ${viewDifficulty === 'easy' ? 'bg-green-900/10 border-green-500/20' :
                    viewDifficulty === 'medium' ? 'bg-yellow-900/10 border-yellow-500/20' :
                        'bg-red-900/10 border-red-500/20'
                    } shrink-0`}>
                    <div className="flex items-center gap-3 mb-4">
                        <User className="w-5 h-5 opacity-70" />
                        <span className="font-mono text-sm opacity-70">YOUR STATS ({viewDifficulty.toUpperCase()})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-wider mb-1 opacity-50">Total Avg</div>
                            <div className="text-3xl font-black">{average.toFixed(1)}%</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wider mb-1 opacity-50">Levels</div>
                            <div className="text-3xl font-black">{completedLevels}</div>
                        </div>
                    </div>
                </div>

                {/* Global List */}
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Top Players ({viewDifficulty})</span>
                </div>

                <div className="space-y-3 pb-safe">
                    {/* Your Entry (Pinned if high enough, or inserted) */}
                    {completedLevels > 0 && (
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 mb-4 sticky top-0 backdrop-blur-md z-10 shadow-lg">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm bg-white text-black">
                                    ?
                                </span>
                                <div>
                                    <span className="font-bold block">{playerName || "You"}</span>
                                    <span className="text-xs opacity-50">Current Player</span>
                                </div>
                            </div>
                            <div className="font-mono font-bold text-xl">{average.toFixed(1)}%</div>
                        </div>
                    )}

                    {globalRankings.map((player) => (
                        <div key={player.rank} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                            <div className="flex items-center gap-4">
                                <span className={`
                                    w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                                    ${player.rank === 1 ? 'bg-yellow-500/10 text-yellow-500' :
                                        player.rank === 2 ? 'bg-zinc-400/10 text-zinc-400' :
                                            player.rank === 3 ? 'bg-orange-700/10 text-orange-700' : 'bg-zinc-800 text-zinc-500'}
                                `}>
                                    {player.rank}
                                </span>
                                <span className="font-medium text-zinc-200">{player.name}</span>
                            </div>
                            <div className="font-mono font-bold text-green-500">{player.score}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
