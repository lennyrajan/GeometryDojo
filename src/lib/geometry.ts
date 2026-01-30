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
    const step = totalLen / (count - 1);
    const newPath: Point[] = [path[0]];
    let currentDist = 0;
    let nextIdx = 1;
    let lastP = path[0];

    for (let i = 1; i < count; i++) {
        const targetDist = i * step;

        // Walk forward until we cover the distance
        while (nextIdx < path.length && currentDist + distance(lastP, path[nextIdx]) < step) {
            currentDist += distance(lastP, path[nextIdx]);
            lastP = path[nextIdx];
            nextIdx++;
        }

        if (nextIdx >= path.length) {
            newPath.push(path[path.length - 1]);
            continue;
        }

        const d = distance(lastP, path[nextIdx]);
        const rem = step; // Simplified, actually need to track cumulative better for precision
        // Better algorithm:
        // Just walk along the path
    }

    // Re-implementation of standard resampling
    // We'll use a simpler approach: walk the path and pick points
    const result: Point[] = [path[0]];
    let distSoFar = 0;
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

    // 3. Compare
    let totalDist = 0;
    const diffs: number[] = [];

    // We need to check direction. If user drew clockwise vs counter-clockwise, points won't match.
    // Simple check: Check distance for normal and reversed, take min.

    let distNormal = 0;
    let distReverse = 0;

    for (let i = 0; i < count; i++) {
        distNormal += distance(userAligned[i], targetResampled[i]);
        distReverse += distance(userAligned[count - 1 - i], targetResampled[i]);
    }

    let finalUserPath = userAligned;
    if (distReverse < distNormal) {
        // Reverse user path for "heatmap" visual alignment, though for pure score we just need the number
        // But we return diffs for heatmap, so we actually need to know WHICH point matches.
        // If reversed, we should probably reverse the array for the return value
        finalUserPath = userAligned.reverse();
        totalDist = distReverse;
    } else {
        totalDist = distNormal;
    }

    // Calculate per-point diffs for heatmap
    for (let i = 0; i < count; i++) {
        diffs.push(distance(finalUserPath[i], targetResampled[i]));
    }

    const avgDist = totalDist / count;

    // Scoring formula:
    // Perfect = 100.
    // How much tolerance? 
    // Box is roughly 0.8 size (if 0-1).
    // A deviation of 0.01 (1%) is pretty good.
    // Let's say avgDist of 0.005 is 100%. 0.05 is 0%.
    // Tune this.

    // strict version:
    // Score = 100 - (avgDist * 1000) ? 
    // If avgDist is 0.01 (1% screen width off average), Score = 90.
    // That feels fair.

    const score = Math.max(0, 100 - (avgDist * 200));

    return { score, diffs, alignedUserPath: finalUserPath };
};
