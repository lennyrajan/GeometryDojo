import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    setDoc,
    doc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Difficulty } from '../types';

export interface GlobalScoreEntry {
    id: string; // userId_difficulty
    userId: string;
    userName: string;
    difficulty: Difficulty;
    totalScore: number;
    averageAccuracy: number;
    highestLevel: number;
    lastUpdated: Timestamp;
}

export const useGlobalLeaderboard = (difficulty: Difficulty, autoFetch: boolean = true) => {
    const [globalRankings, setGlobalRankings] = useState<GlobalScoreEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRankings = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const scoresRef = collection(db, 'global_scores');
            const q = query(
                scoresRef,
                where('difficulty', '==', difficulty),
                orderBy('highestLevel', 'desc'),
                orderBy('averageAccuracy', 'desc'),
                limit(100)
            );

            const querySnapshot = await getDocs(q);
            const rankings: GlobalScoreEntry[] = [];
            querySnapshot.forEach((doc) => {
                rankings.push({
                    ...doc.data(),
                    id: doc.id
                } as GlobalScoreEntry);
            });
            setGlobalRankings(rankings);
        } catch (err: any) {
            console.error("Error fetching global rankings:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [difficulty]);

    useEffect(() => {
        if (autoFetch) {
            fetchRankings();
        }
    }, [fetchRankings, autoFetch]);

    const submitGlobalScore = async (
        userId: string,
        userName: string,
        difficulty: Difficulty,
        stats: { totalScore: number; averageAccuracy: number; highestLevel: number }
    ) => {
        if (!userId || !userName) return;
        try {
            const scoreId = `${userId}_${difficulty}`;
            const scoreRef = doc(db, 'global_scores', scoreId);

            await setDoc(scoreRef, {
                userId,
                userName,
                difficulty,
                totalScore: stats.totalScore,
                averageAccuracy: stats.averageAccuracy,
                highestLevel: stats.highestLevel,
                lastUpdated: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error("Error submitting global score:", err);
        }
    };

    const syncAllProfiles = async (players: any[]) => {
        setLoading(true);
        try {
            const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
            for (const player of players) {
                if (!player.name) continue;

                for (const diff of difficulties) {
                    const scores = player.scores[diff];
                    const unlocked = player.unlockedLevels[diff];

                    const scoreValues = Object.values(scores) as number[];
                    if (scoreValues.length === 0 && Math.max(...unlocked, 0) === 0) continue;

                    const totalScore = scoreValues.reduce((a, b) => a + b, 0);
                    const completedCount = scoreValues.length;
                    const averageAccuracy = completedCount > 0 ? totalScore / completedCount : 0;
                    const highestLevel = Math.max(...unlocked, 0);

                    if (highestLevel > 0 || averageAccuracy > 0) {
                        await submitGlobalScore(player.id, player.name, diff, {
                            totalScore,
                            averageAccuracy,
                            highestLevel
                        });
                    }
                }
            }
            fetchRankings();
        } catch (err) {
            console.error("Sync failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        globalRankings,
        loading,
        error,
        refresh: fetchRankings,
        submitGlobalScore,
        syncAllProfiles
    };
};
