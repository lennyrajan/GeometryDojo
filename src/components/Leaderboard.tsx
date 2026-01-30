import React from 'react';
import { ArrowLeft, Globe, User } from 'lucide-react';

interface LeaderboardProps {
    scores: Record<number, number>;
    onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, onBack }) => {
    // Calculate User Stats
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const completedLevels = Object.keys(scores).length;
    const average = completedLevels > 0 ? totalScore / completedLevels : 0;

    // Mock Global Data
    const globalRankings = [
        { name: "GeometryGod", score: 99.8, rank: 1 },
        { name: "ShapeShifter", score: 99.5, rank: 2 },
        { name: "PolyGon", score: 99.1, rank: 3 },
        { name: "LineMaster", score: 98.7, rank: 4 },
        { name: "CircleFan", score: 98.2, rank: 5 },
    ];

    return (
        <div className="flex flex-col h-full bg-black text-white p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </button>
                <h1 className="text-2xl font-bold">Global Rankings</h1>
            </div>

            {/* User Stats Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 mb-8 border border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-green-500" />
                    <span className="font-mono text-sm text-zinc-400">YOUR STATISTICS</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Avg</div>
                        <div className="text-3xl font-black">{average.toFixed(1)}%</div>
                    </div>
                    <div>
                        <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Levels</div>
                        <div className="text-3xl font-black">{completedLevels}</div>
                    </div>
                </div>
            </div>

            {/* Global List */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Top Players</span>
                </div>

                <div className="space-y-3">
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

                    {/* Placeholder for User Rank if not in top 5? */}
                    <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700 mt-4 opacity-50">
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm text-zinc-600">
                                ?
                            </span>
                            <span className="font-medium text-zinc-500">You</span>
                        </div>
                        <div className="font-mono font-bold text-zinc-600">{average.toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
