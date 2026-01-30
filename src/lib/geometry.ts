import { Difficulty } from '../types';

export type Point = { x: number; y: number };

// ... (existing code helpers)

// Remove local Difficulty type definition if it exists around here, it's now imported.


export const distance = (p1: Point, p2: Point) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

export const getPathLength = (path: Point[]) => {
    let len = 0;
    for (let i = 1; i < path.length; i++) {
        len += distance(path[i - 1], path[i]);
    }
    return len;
};

// Resample a path to have exactly `count` equidistant points
export const resample = (path: Point[], count: number = 100): Point[] => {
    if (path.length < 2) return path;

    const totalLen = getPathLength(path);
    // Simplified approach: walk the path and pick points

    // Re-implementation of standard resampling
    // We'll use a simpler approach: walk the path and pick points
    const result: Point[] = [path[0]];
    let pointIdx = 0;
    const interval = totalLen / (count - 1);

    let currentP = path[0];
    let nextP = path[1];
    let dToNext = distance(currentP, nextP);
    let distCovered = 0;

    for (let i = 1; i < count - 1; i++) {
        const targetLoc = i * interval;
        while (distCovered + dToNext < targetLoc && pointIdx < path.length - 2) {
            distCovered += dToNext;
            pointIdx++;
            currentP = path[pointIdx];
            nextP = path[pointIdx + 1];
            dToNext = distance(currentP, nextP);
        }

        const remaining = targetLoc - distCovered;
        const t = remaining / dToNext; // value 0 to 1
        result.push({
            x: currentP.x + (nextP.x - currentP.x) * t,
            y: currentP.y + (nextP.y - currentP.y) * t,
        });
    }
    result.push(path[path.length - 1]);
    return result;
};

export const getBoundingBox = (path: Point[]) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    path.forEach(p => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
    });
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
};

// Normalize path to fit in a 0-1 box, preserving aspect ratio if specified
// But for this game, we want to align the user's drawing to the target's bounding box
export const fitToBox = (path: Point[], targetBox: { minX: number, maxX: number, minY: number, maxY: number, width: number, height: number }): Point[] => {
    const box = getBoundingBox(path);
    if (box.width === 0 || box.height === 0) return path;

    // Scale to match the target's largest dimension, or just stretch?
    // User Requirement: "fits" user drawing. 
    // Standard practice for shape matching: Unit scale both to 1x1 and center at 0,0.
    // Then compare.

    // Implementation: Scale user path to unit square (0-1), then move to center.
    // Then do the same for target (if not already).
    // This discards aspect ratio, which allows Drawing a "wide" square to count as a square?
    // Maybe "Proportions" is a test (Level 3: Rectangle). So aspect ratio MATTERS.

    // Revised: Scale user path such that its bounding box CENTER aligns with Target CENTER.
    // AND Scale user path such that its LONGEST SIDE length matches Target LONGEST SIDE length.
    // This preserves aspect ratio errors.

    const scale = Math.max(targetBox.width, targetBox.height) / Math.max(box.width, box.height);

    const targetCenterX = targetBox.minX + targetBox.width / 2;
    const targetCenterY = targetBox.minY + targetBox.height / 2;

    const userCenterX = box.minX + box.width / 2;
    const userCenterY = box.minY + box.height / 2;

    return path.map(p => ({
        x: (p.x - userCenterX) * scale + targetCenterX,
        y: (p.y - userCenterY) * scale + targetCenterY
    }));
};


const SAMPLING_POINTS = 100;

// Helper to get angle between three points
const getAngle = (p1: Point, p2: Point, p3: Point) => {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    if (mag1 === 0 || mag2 === 0) return 180; // Straight line or point, treat as 180 for angle diff
    const val = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    return (Math.acos(val) * 180) / Math.PI;
};

const scoreAlignment = (
    userPath: Point[],
    targetPath: Point[],
    angleTolerance: number,
    maxAngleWeight: number,
    avgAngleWeight: number,
    spatialPenaltyMultiplier: number = 1.0
) => {
    const count = userPath.length;
    let totalDist = 0;
    let maxDist = 0;
    const diffs: number[] = []; // Store spatial diffs for heatmap
    const angleDiffs: number[] = [];

    for (let i = 0; i < count; i++) {
        // Spatial Error
        const dist = distance(userPath[i], targetPath[i]);
        totalDist += dist;
        maxDist = Math.max(maxDist, dist);
        diffs.push(dist);

        // Angular Error (Local curvature at this point)
        // We look at prev, curr, next points to get the "corner" angle at i
        // Use a larger step for angle calculation to smooth out noise
        const angleStep = 5;
        const uIdxPrev = (i - angleStep + count) % count;
        const uIdxNext = (i + angleStep) % count;
        const userAngle = getAngle(userPath[uIdxPrev], userPath[i], userPath[uIdxNext]);

        const tIdxPrev = (i - angleStep + count) % count;
        const tIdxNext = (i + angleStep) % count;
        const targetAngle = getAngle(targetPath[tIdxPrev], targetPath[i], targetPath[tIdxNext]);

        // Calculate diff
        let diff = Math.abs(userAngle - targetAngle);

        // IGNORE small deviations (Tolerance Buffer based on Difficulty)
        diff = Math.max(0, diff - angleTolerance);

        angleDiffs.push(diff);
    }

    // Max Angle Deviation is the best indicator of "Missing a Corner"
    const maxAngleDiff = angleDiffs.length > 0 ? Math.max(...angleDiffs) : 0;
    const avgAngleDiff = angleDiffs.length > 0 ? angleDiffs.reduce((a, b) => a + b, 0) / count : 0;

    // Scoring Formula
    const avgDist = totalDist / count;
    // Apply spatial multiplier to distance penalties
    const totalPenalty = ((avgDist * 300) + (maxDist * 50)) * spatialPenaltyMultiplier + (maxAngleDiff * maxAngleWeight) + (avgAngleDiff * avgAngleWeight);
    const score = Math.max(0, 100 - totalPenalty);

    return { score, diffs };
};

export const calculateScore = (
    userPath: Point[],
    targetPath: Point[],
    difficulty: Difficulty = 'medium'
): { score: number, diffs: number[], alignedUserPath: Point[] } => {
    if (userPath.length < 2) return { score: 0, diffs: [], alignedUserPath: [] };

    // 1. Resample
    const resampledUser = resample(userPath, SAMPLING_POINTS);
    const resampledTarget = resample(targetPath, SAMPLING_POINTS);

    // 2. Fit User to Target Box
    const targetBox = getBoundingBox(resampledTarget);
    const normalizedUser = fitToBox(resampledUser, targetBox);
    const normalizedTarget = resampledTarget; // Target is already the reference

    // 3. Find Best Alignment (Cyclic Shift)
    let bestScore = -Infinity;
    let bestAlignedUserPath: Point[] = [];
    let bestDiffs: number[] = [];

    // Config based on Difficulty
    let angleTolerance = 30;
    let maxAngleWeight = 1.0;
    let avgAngleWeight = 0.2;
    let spatialPenaltyMultiplier = 1.0;

    switch (difficulty) {
        case 'easy':
            angleTolerance = 30; // Very forgiving
            maxAngleWeight = 0.8;
            avgAngleWeight = 0.1;
            spatialPenaltyMultiplier = 0.8;
            break;
        case 'medium':
            angleTolerance = 20; // Relaxed for better "human" feel on curves
            maxAngleWeight = 1.0;
            avgAngleWeight = 0.2;
            spatialPenaltyMultiplier = 1.0;
            break;
        case 'hard':
            angleTolerance = 10; // Very Strict
            maxAngleWeight = 2.0;
            avgAngleWeight = 0.5;
            spatialPenaltyMultiplier = 3.0; // Heavily penalize any spatial deviation (e.g. curves on straight lines)
            break;
    }

    // Optimization: We don't need to try EVERY alignment if we use a heuristic,
    // but for 100 points, brute force is fast enough (~1-2ms).
    // Also check both normal and reversed directions for the user path.
    const userPathsToTest = [normalizedUser, [...normalizedUser].reverse()];

    for (const path of userPathsToTest) {
        for (let shift = 0; shift < SAMPLING_POINTS; shift++) {
            const shiftedUser = [...path.slice(shift), ...path.slice(0, shift)];
            // Pass spatialMultiplier to scoreAlignment or calculate it here?
            // scoreAlignment doesn't take the multiplier currently.
            // Let's modify scoreAlignment or just apply it to the result?
            // scoreAlignment returns { score, diffs }. But score is already clamped 0-100.
            // We need to inject the multiplier into the penalty calculation inside scoreAlignment.
            // Adjusting function signature...

            const { score, diffs } = scoreAlignment(
                shiftedUser,
                normalizedTarget,
                angleTolerance,
                maxAngleWeight,
                avgAngleWeight,
                spatialPenaltyMultiplier
            );

            if (score > bestScore) {
                bestScore = score;
                bestAlignedUserPath = shiftedUser;
                bestDiffs = diffs;
            }
        }
    }

    return { score: bestScore, diffs: bestDiffs, alignedUserPath: bestAlignedUserPath };
};
