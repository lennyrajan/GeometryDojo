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

            // Optionally refresh rankings if we are on the same difficulty
            // fetchRankings(); 
        } catch (err) {
            console.error("Error submitting global score:", err);
        }
    };

    return {
        globalRankings,
        loading,
        error,
        refresh: fetchRankings,
        submitGlobalScore
    };
};
