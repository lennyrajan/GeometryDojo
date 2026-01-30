import React from 'react';
import { ArrowLeft, Globe, User } from 'lucide-react';

interface LeaderboardProps {
    scores: Record<number, number>;
    playerName: string | null;
    onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, playerName, onBack }) => {
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
        { name: "AngleAngel", score: 97.5, rank: 6 },
        { name: "VertexViper", score: 97.1, rank: 7 },
        { name: "EdgeLord", score: 96.8, rank: 8 },
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 pb-2 shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 bg-zinc-900/50 rounded-full hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </button>
                <h1 className="text-2xl font-bold text-white">Global Rankings</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-2">
                {/* User Stats Card */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 mb-8 border border-zinc-800 shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="w-5 h-5 text-green-500" />
                        <span className="font-mono text-sm text-zinc-400">YOUR STATISTICS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Avg</div>
                            <div className="text-3xl font-black text-white">{average.toFixed(1)}%</div>
                        </div>
                        <div>
                            <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Levels</div>
                            <div className="text-3xl font-black text-white">{completedLevels}</div>
                        </div>
                    </div>
                </div>

                {/* Global List */}
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Top Players</span>
                </div>

                <div className="space-y-3 pb-safe">
                    {/* Your Entry (Pinned if high enough, or inserted) */}
                    {completedLevels > 0 && (
                        <div className="flex items-center justify-between p-4 bg-lime-900/10 rounded-xl border border-lime-500/30 mb-4 sticky top-0 backdrop-blur-md z-10 shadow-lg">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm bg-lime-500 text-black">
                                    ?
                                </span>
                                <div>
                                    <span className="font-bold text-white block">{playerName || "You"}</span>
                                    <span className="text-xs text-lime-400">Current Player</span>
                                </div>
                            </div>
                            <div className="font-mono font-bold text-lime-400 text-xl">{average.toFixed(1)}%</div>
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
