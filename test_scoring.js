
// Helper functions
const distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

const getPathLength = (path) => {
    let len = 0;
    for (let i = 1; i < path.length; i++) {
        len += distance(path[i - 1], path[i]);
    }
    return len;
};

const resample = (path, count = 100) => {
    if (path.length < 2) return path;
    const totalLen = getPathLength(path);
    const result = [path[0]];
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
        const t = remaining / dToNext;
        result.push({
            x: currentP.x + (nextP.x - currentP.x) * t,
            y: currentP.y + (nextP.y - currentP.y) * t,
        });
    }
    result.push(path[path.length - 1]);
    return result;
};

const getBoundingBox = (path) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    path.forEach(p => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
    });
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
};

const fitToBox = (path, targetBox) => {
    const box = getBoundingBox(path);
    if (box.width === 0 || box.height === 0) return path;
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

// The Function Under Test
const calculateScore = (userPath, targetPath) => {
    const count = 100;
    const userResampled = resample(userPath, count);
    const targetResampled = resample(targetPath, count);
    const targetBox = getBoundingBox(targetResampled);
    const userAligned = fitToBox(userResampled, targetBox);

    let minTotalDist = Infinity;
    let bestUserPath = [];
    let bestShift = 0;

    const calcDist = (uPath, tPath, shift) => {
        let d = 0;
        for (let i = 0; i < count; i++) {
            const tIdx = (i + shift) % count;
            d += distance(uPath[i], tPath[tIdx]);
        }
        return d;
    };

    // Check Normal
    for (let shift = 0; shift < count; shift++) {
        const d = calcDist(userAligned, targetResampled, shift);
        if (d < minTotalDist) {
            minTotalDist = d;
            bestUserPath = userAligned;
            bestShift = shift;
        }
    }
    // Check Reverse
    const userReversed = [...userAligned].reverse();
    for (let shift = 0; shift < count; shift++) {
        const d = calcDist(userReversed, targetResampled, shift);
        if (d < minTotalDist) {
            minTotalDist = d;
            bestUserPath = userReversed;
            bestShift = shift;
        }
    }

    const diffs = [];
    for (let i = 0; i < count; i++) {
        const tIdx = (i + bestShift) % count;
        diffs.push(distance(bestUserPath[i], targetResampled[tIdx]));
    }

    const avgDist = minTotalDist / count;
    const maxDist = Math.max(...diffs);

    // CORNER LOGIC
    const getAngle = (p1, p2, p3) => {
        const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
        const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        if (mag1 === 0 || mag2 === 0) return 180;
        const angleRad = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))));
        return (angleRad * 180) / Math.PI;
    };

    let cornerPenalty = 0;

    console.log(`\n--- Debugging Corners ---`);
    for (let i = 0; i < count; i++) {
        const tIdxPrev = (i + bestShift - 5 + count) % count;
        const tIdxCurr = (i + bestShift) % count;
        const tIdxNext = (i + bestShift + 5) % count;

        const targetAngle = getAngle(targetResampled[tIdxPrev], targetResampled[tIdxCurr], targetResampled[tIdxNext]);

        if (targetAngle < 165) { // Relaxed check locally for debug
            const uIdxPrev = (i - 5 + count) % count;
            const uIdxCurr = i;
            const uIdxNext = (i + 5) % count;
            const userAngle = getAngle(bestUserPath[uIdxPrev], bestUserPath[uIdxCurr], bestUserPath[uIdxNext]);
            const diff = Math.abs(userAngle - targetAngle);

            console.log(`Index ${i}: TargetAng ${targetAngle.toFixed(1)} | UserAng ${userAngle.toFixed(1)} | Diff ${diff.toFixed(1)}`);

            // Using strict loop logic
            if (targetAngle < 160) {
                cornerPenalty += diff * 0.5;
            }
        }
    }
    console.log(`-------------------------\n`);

    const totalPenalty = (avgDist * 300) + (maxDist * 50) + cornerPenalty;
    const score = Math.max(0, 100 - totalPenalty);

    console.log(`AvgDist: ${avgDist.toFixed(4)}`);
    console.log(`MaxDist: ${maxDist.toFixed(4)}`);
    console.log(`CornerPenalty: ${cornerPenalty.toFixed(2)}`);
    console.log(`Total Score: ${score.toFixed(2)}`);
};

// --- TEST CASE ---

// 1. Define Octagon
const octagon = [];
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    octagon.push({ x: Math.cos(angle), y: Math.sin(angle) });
}
octagon.push(octagon[0]); // Close loop

// 2. Define Circle (simulating user drawing)
const circle = [];
for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    circle.push({ x: Math.cos(angle), y: Math.sin(angle) });
}
circle.push(circle[0]);

console.log("TESTING: Circle vs Octagon");
calculateScore(circle, octagon);
