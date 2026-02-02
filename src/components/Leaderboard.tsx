import React, { useState, useMemo } from 'react';
import { ArrowLeft, Globe, Medal, Trophy, Users, RefreshCw, Loader2 } from 'lucide-react';
import { Difficulty } from '../types';
import { PlayerProfile } from '../hooks/useGameStore';
import { useGlobalLeaderboard } from '../hooks/useGlobalLeaderboard';

interface LeaderboardProps {
    players: PlayerProfile[];
    activePlayerId: string;
    onBack: () => void;
    initialDifficulty: Difficulty;
    theme: 'space' | 'classic';
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, activePlayerId, onBack, initialDifficulty, theme }) => {
    const [viewType, setViewType] = useState<'local' | 'global'>('local');
    const [viewDifficulty, setViewDifficulty] = useState<Difficulty>(initialDifficulty);

    const { globalRankings, loading, error, refresh } = useGlobalLeaderboard(viewDifficulty);

    // Calculate LOCAL Rankings for the selected difficulty
    const localRankings = useMemo(() => {
        return players.map((player: PlayerProfile) => {
            const scores = player.scores[viewDifficulty] as Record<number, number>;
            const unlocked = player.unlockedLevels[viewDifficulty] as number[];

            const totalScore: number = Object.values(scores).reduce((a: number, b: number) => a + b, 0);
            const completedCount = Object.keys(scores).length;
            const average = completedCount > 0 ? totalScore / completedCount : 0;
            const highestLevel = Math.max(...unlocked, 0);

            return {
                id: player.id,
                name: player.name || "Anonymous Student",
                average,
                highestLevel,
                totalScore, // Secondary sort
                isMe: player.id === activePlayerId
            };
        })
            .filter(p => p.highestLevel > 0 || p.average > 0) // Only show players who have started
            .sort((a: any, b: any) => {
                if (b.highestLevel !== a.highestLevel) return b.highestLevel - a.highestLevel;
                return b.average - a.average;
            })
            .map((p, index: number) => ({ ...p, rank: index + 1 }));
    }, [players, viewDifficulty, activePlayerId]);

    // Format GLOBAL Rankings for UI
    const formattedGlobalRankings = useMemo(() => {
        return globalRankings.map((entry, index) => ({
            id: entry.userId,
            name: entry.userName,
            average: entry.averageAccuracy,
            highestLevel: entry.highestLevel,
            totalScore: entry.totalScore,
            isMe: entry.userId === activePlayerId,
            rank: index + 1
        }));
    }, [globalRankings, activePlayerId]);

    const activeRankings = viewType === 'local' ? localRankings : formattedGlobalRankings;

    // Current Player Stats (Dynamic based on View Type)
    const myStats = useMemo(() => {
        const found = activeRankings.find((r: any) => r.isMe);
        if (found) return found;

        // If in World view but not in Top 100, show local performance with "100+" rank
        if (viewType === 'global') {
            const localMe = localRankings.find(r => r.isMe);
            if (localMe) {
                return { ...localMe, rank: '100+' };
            }
        }
        return null;
    }, [activeRankings, viewType, localRankings]);

    return (
        <div className={`flex flex-col h-screen overflow-hidden ${theme === 'space' ? 'bg-indigo-950 text-white' : 'bg-zinc-950 text-white'}`}>
            {/* Header */}
            <div className="flex items-center gap-4 p-6 pb-2 shrink-0">
                <button
                    onClick={onBack}
                    className={`p-2 rounded-full transition-colors border ${theme === 'space' ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'}`}
                >
                    <ArrowLeft className={`w-5 h-5 ${theme === 'space' ? 'text-indigo-200' : 'text-zinc-400'}`} />
                </button>
                <h1 className="text-2xl font-bold">Hall of Fame</h1>
            </div>

            {/* Mode & Difficulty Selector */}
            <div className="px-6 py-4 space-y-4">
                {/* View Type Toggle */}
                <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
                    <button
                        onClick={() => setViewType('local')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${viewType === 'local'
                            ? 'bg-white text-black shadow-lg'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Users className="w-3 h-3" />
                        Device
                    </button>
                    <button
                        onClick={() => setViewType('global')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${viewType === 'global'
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Globe className="w-3 h-3" />
                        World
                    </button>
                </div>

                {/* Difficulty Tabs */}
                <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                        <button
                            key={d}
                            onClick={() => setViewDifficulty(d)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${viewDifficulty === d
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 pb-2 shrink-0">
                {/* User Stats Card - Fixed at top of list area */}
                {myStats && (
                    <div className={`rounded-2xl p-6 mb-4 border transition-all duration-500 ${viewDifficulty === 'easy' ? 'bg-green-500/5 border-green-500/20' :
                        viewDifficulty === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                            'bg-red-500/5 border-red-500/20'
                        } shrink-0 shadow-2xl relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Trophy className="w-24 h-24" />
                        </div>

                        <div className="flex items-center gap-3 mb-4 relative z-10 text-indigo-400">
                            <Medal className="w-5 h-5" />
                            <span className="font-black text-[10px] uppercase tracking-[0.2em]">Your Standing</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 relative z-10">
                            <div>
                                <div className="text-[10px] uppercase tracking-wider mb-1 opacity-40 font-bold">Rank</div>
                                <div className="text-3xl font-black text-white">#{myStats.rank}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider mb-1 opacity-40 font-bold">Max Level</div>
                                <div className="text-3xl font-black text-white">{myStats.highestLevel}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider mb-1 opacity-40 font-bold">Avg Accuracy</div>
                                <div className="text-3xl font-black text-white">{myStats.average.toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global List Header - Fixed */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {viewType === 'local' ? <Users className="w-4 h-4 text-zinc-400" /> : <Globe className="w-4 h-4 text-indigo-400" />}
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                            {viewType === 'local' ? 'Local Players' : 'World Ranking'} ({viewDifficulty})
                        </span>
                    </div>
                    {viewType === 'global' && (
                        <button
                            onClick={refresh}
                            disabled={loading}
                            className="p-1 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
                        >
                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Rankings List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0 custom-scrollbar-minimal">

                {(viewType === 'global' && loading) ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Accessing Dojos...</span>
                    </div>
                ) : (viewType === 'global' && error) ? (
                    <div className="py-10 px-6 text-center space-y-4">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="text-red-400 text-xs font-bold leading-relaxed">
                                {error.includes('index')
                                    ? "Global rankings need a search index. Please see the setup guide."
                                    : "Failed to connect to the global dojo server."}
                            </p>
                        </div>
                        <button
                            onClick={refresh}
                            className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 pb-safe">
                        {activeRankings.map((player) => (
                            <div key={player.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${player.isMe
                                ? 'bg-indigo-500/10 border-indigo-500/40 shadow-indigo-500/10'
                                : 'bg-zinc-900/40 border-white/5'
                                }`}>
                                <div className="flex items-center gap-4">
                                    <span className={`
                                        w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm transition-transform
                                        ${player.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 scale-110 shadow-lg shadow-yellow-500/20' :
                                            player.rank === 2 ? 'bg-zinc-400/20 text-zinc-300' :
                                                player.rank === 3 ? 'bg-orange-700/20 text-orange-400' : 'bg-zinc-800/50 text-zinc-500'}
                                    `}>
                                        {player.rank}
                                    </span>
                                    <div>
                                        <span className={`font-bold block ${player.isMe ? 'text-white' : 'text-zinc-300'}`}>
                                            {player.name}
                                            {player.isMe && <span className="ml-2 text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase">You</span>}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            Level {player.highestLevel} Reached
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-mono font-black text-xl ${player.average >= 95 ? 'text-green-400' :
                                        player.average >= 90 ? 'text-yellow-400' : 'text-zinc-400'
                                        }`}>
                                        {player.average.toFixed(1)}%
                                    </div>
                                    <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">Avg Accuracy</div>
                                </div>
                            </div>
                        ))}

                        {activeRankings.length === 0 && (
                            <div className="py-20 text-center">
                                <div className="text-zinc-700 text-xs font-bold uppercase tracking-widest">No entries recorded for this difficulty</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
