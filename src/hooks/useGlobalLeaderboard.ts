import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    doc,
    setDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { Difficulty } from '../types';

export interface GlobalScoreEntry {
    id?: string;
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

    // REAL-TIME LISTENER
    useEffect(() => {
        if (!autoFetch) return;

        setLoading(true);
        setError(null);

        try {
            const q = query(
                collection(db, 'global_scores'),
                where('difficulty', '==', difficulty),
                orderBy('highestLevel', 'desc'),
                orderBy('averageAccuracy', 'desc'),
                limit(100)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const rankings = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                } as GlobalScoreEntry));
                setGlobalRankings(rankings);
                setLoading(false);
            }, (err) => {
                console.error("Firestore Listen Error:", err);
                setError(err.message);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err: any) {
            console.error("Query setup error:", err);
            setError(err.message);
            setLoading(false);
        }
    }, [difficulty, autoFetch]);

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
            console.log(`Submitted global score for ${userName} (${difficulty}):`, stats);
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
                console.log(`Syncing profile for user: ${player.name} (ID: ${player.id})`);

                for (const diff of difficulties) {
                    const scores = player.scores[diff];
                    const unlocked = player.unlockedLevels[diff];

                    const scoreValues = Object.values(scores) as number[];
                    if (scoreValues.length === 0 && Math.max(...unlocked, 0) === 0) {
                        continue;
                    }

                    const totalScore = scoreValues.reduce((a, b) => a + b, 0);
                    const completedCount = scoreValues.length;
                    const averageAccuracy = completedCount > 0 ? totalScore / completedCount : 0;
                    const highestLevel = Math.max(...unlocked, 0);

                    if (highestLevel > 0 || averageAccuracy > 0) {
                        console.log(`  Submitting ${diff} score for ${player.name}: Level ${highestLevel}`);
                        await submitGlobalScore(player.id, player.name, diff, {
                            totalScore,
                            averageAccuracy,
                            highestLevel
                        });
                    }
                }
            }
            console.log("All profiles sync complete.");
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
        refresh: () => {
            console.log("Refresh requested (real-time active)");
        },
        submitGlobalScore,
        syncAllProfiles
    };
};
