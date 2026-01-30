export type Point = { x: number; y: number };

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

export const calculateScore = (userPath: Point[], targetPath: Point[]): { score: number, diffs: number[], alignedUserPath: Point[] } => {
    // 1. Resample both to same count (e.g. 100)
    const count = 100;
    const userResampled = resample(userPath, count);
    const targetResampled = resample(targetPath, count);

    // 2. Align (Fit user to target)
    const targetBox = getBoundingBox(targetResampled);
    const userAligned = fitToBox(userResampled, targetBox);

    // 3. Compare with Cyclic Shift
    // Improved algorithm: Try all cyclic shifts of the target path to find the best start-point alignment.
    // Also check both normal and reversed directions for the user path.

    let minTotalDist = Infinity;
    let bestUserPath: Point[] = [];
    let bestShift = 0;

    // Helper to calc distance for a specific shift between two arrays of same length
    const calcDist = (uPath: Point[], tPath: Point[], shift: number) => {
        let d = 0;
        for (let i = 0; i < count; i++) {
            const tIdx = (i + shift) % count;
            d += distance(uPath[i], tPath[tIdx]);
        }
        return d;
    };

    // Check Normal Direction
    for (let shift = 0; shift < count; shift++) {
        const d = calcDist(userAligned, targetResampled, shift);
        if (d < minTotalDist) {
            minTotalDist = d;
            bestUserPath = userAligned; // Normal orientation
            bestShift = shift;
        }
    }

    // Check Reverse Direction
    const userReversed = [...userAligned].reverse();
    for (let shift = 0; shift < count; shift++) {
        const d = calcDist(userReversed, targetResampled, shift);
        if (d < minTotalDist) {
            minTotalDist = d;
            bestUserPath = userReversed;
            bestShift = shift;
        }
    }

    // Generate diffs for the best match
    const diffs: number[] = [];
    for (let i = 0; i < count; i++) {
        const tIdx = (i + bestShift) % count;
        diffs.push(distance(bestUserPath[i], targetResampled[tIdx]));
    }

    // For visualization, we need to return the user path aligned to the target.
    // However, the `bestUserPath` is just reversed or not. The `diffs` correspond to comparing
    // bestUserPath[i] with target[(i + shift) % N].
    // To minimize complexity for the consumer (CanvasBoard), let's just return the bestUserPath,
    // and the diffs array already matches it index-for-index against the *shifted* target.
    // BUT the CanvasBoard draws the target as `level.shape`. It doesn't know about shifts.
    // Actually, heatmap logic in CanvasBoard iterates 0..N of alignedUserPath and uses diffs[i].
    // It draws the user path segment colors. The diff[i] says "how far was this user segment from the matched target segment".
    // So if we just return bestUserPath and the corresponding diffs, the heatmap on the user's line will be correct.
    // The target line (white/faint) is drawn separately and static. That is fine.

    const avgDist = minTotalDist / count;

    // Penalize systematic errors (like max deviation).
    // If user draws a circle over a hexagon, the MAX pairwise distance will be high at the vertices.
    const maxDist = Math.max(...diffs);

    // Scoring formula:
    // Base penalty: Average Distance * Weight
    // Plus: Max Distance * Weight
    // Prioritize uniformity.

    const penalty = (avgDist * 300) + (maxDist * 100);
    const score = Math.max(0, 100 - penalty);

    return { score, diffs, alignedUserPath: bestUserPath };
};
