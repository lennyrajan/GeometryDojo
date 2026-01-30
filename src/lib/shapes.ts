import { Point } from './geometry';

export interface Level {
    id: number;
    name: string;
    description: string;
    fact: string; // New field for scientific/interesting facts
    shape: Point[];
    unlockScore: number;
}

// Helper: Regular Polygons
const createPoly = (sides: number, radius: number = 0.35, center: Point = { x: 0.5, y: 0.5 }, startAngle: number = -Math.PI / 2): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= sides; i++) {
        const angle = startAngle + (i * 2 * Math.PI / sides);
        points.push({
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
        });
    }
    return points;
};

// Helper: Stars
const createStar = (pointsCount: number, outerRadius: number = 0.35, innerRadius: number = 0.15, center: Point = { x: 0.5, y: 0.5 }): Point[] => {
    const points: Point[] = [];
    const sides = pointsCount;
    for (let i = 0; i <= sides * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = -Math.PI / 2 + (i * Math.PI / sides);
        points.push({
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
        });
    }
    return points;
};

// Helper: Ellipse
const createEllipse = (rx: number, ry: number, center: Point = { x: 0.5, y: 0.5 }, segments: number = 60, rotation: number = 0): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i * 2 * Math.PI) / segments;
        const dx = rx * Math.cos(angle);
        const dy = ry * Math.sin(angle);
        points.push({
            x: center.x + (dx * Math.cos(rotation) - dy * Math.sin(rotation)),
            y: center.y + (dx * Math.sin(rotation) + dy * Math.cos(rotation))
        });
    }
    return points;
};

// Helper: Parametric Curve (Generic)
const createParametric = (
    funcX: (t: number) => number,
    funcY: (t: number) => number,
    scale: number,
    center: Point,
    tMin: number,
    tMax: number,
    segments: number = 80 // Increase segments for smoother curves
): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
        const t = tMin + (tMax - tMin) * (i / segments);
        points.push({
            x: center.x + funcX(t) * scale,
            y: center.y + funcY(t) * scale
        });
    }
    return points;
}

// Heart Curve - Standard Parametric
const heartPoints = createParametric(
    (t) => 16 * Math.pow(Math.sin(t), 3),
    (t) => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    0.020, // Slightly reduced scale to fit better
    { x: 0.5, y: 0.45 },
    0,
    2 * Math.PI,
    120 // Higher res for heart
);

// Infinity / Lemniscate
const infinityPoints = createParametric(
    (t) => (Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2)),
    (t) => (Math.cos(t) * Math.sin(t)) / (1 + Math.pow(Math.sin(t), 2)),
    0.35,
    { x: 0.5, y: 0.5 },
    0,
    2 * Math.PI,
    100
);

const levels: Level[] = [
    // --- BASIC (1-10) ---
    {
        id: 1,
        name: "The Straight Line",
        description: "The foundation of all geometry.",
        fact: "A line is the shortest distance between two points in Euclidean space. It has one dimension: length.",
        shape: [{ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }],
        unlockScore: 92.0
    },
    {
        id: 2,
        name: "Right Triangle",
        description: "The 90° master class.",
        fact: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides (Pythagoras).",
        shape: [{ x: 0.3, y: 0.25 }, { x: 0.3, y: 0.75 }, { x: 0.7, y: 0.75 }, { x: 0.3, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 3,
        name: "Equilateral Triangle",
        description: "Three sharp 60° angles.",
        fact: "All three sides are equal, and all three internal angles are 60 degrees. It is the strongest shape in engineering.",
        shape: createPoly(3, 0.35, { x: 0.5, y: 0.6 }, -Math.PI / 2),
        unlockScore: 92.0
    },
    {
        id: 4,
        name: "The Square",
        description: "Four 90° corners. Even sides.",
        fact: "A square is a regular quadrilateral. It has equal sides and equal angles (90°).",
        shape: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 }, { x: 0.25, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 5,
        name: "The Rectangle",
        description: "Testing proportions.",
        fact: "A rectangle is a quadrilateral with four right angles. Note that every square is a rectangle, but not every rectangle is a square.",
        shape: [{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.2, y: 0.7 }, { x: 0.2, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 6,
        name: "The Diamond",
        description: "A square, tilted. Balance is key.",
        fact: "Also known as a Rhombus, it is a quadrilateral whose four sides all have the same length.",
        shape: [{ x: 0.5, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.8 }, { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.2 }],
        unlockScore: 92.0
    },
    {
        id: 7,
        name: "The Trapezoid",
        description: "A stable foundation.",
        fact: "A quadrilateral with at least one pair of parallel sides. In the UK, it is often called a Trapezium.",
        shape: [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.85, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.3, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 8,
        name: "The Parallelogram",
        description: "Lean into the future.",
        fact: "A simple (non-self-intersecting) quadrilateral with two pairs of parallel sides. Opposite sides are of equal length.",
        shape: [{ x: 0.35, y: 0.3 }, { x: 0.85, y: 0.3 }, { x: 0.65, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.35, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 9,
        name: "The Pentagon",
        description: "The first odd challenge.",
        fact: "A five-sided polygon. The sum of internal angles in a simple pentagon is 540°.",
        shape: createPoly(5),
        unlockScore: 92.0
    },
    {
        id: 10,
        name: "The Hexagon",
        description: "Six sides, very symmetrical.",
        fact: "A six-sided polygon. Honeycombs use hexagons because they tile the plane efficiently with minimal perimeter.",
        shape: createPoly(6),
        unlockScore: 92.0
    },

    // --- INTERMEDIATE (11-20) ---
    {
        id: 11,
        name: "The Chevron",
        description: "Point the way forward.",
        fact: "An inverted V-shape pattern. Historically used in heraldry and badges of rank.",
        shape: [{ x: 0.2, y: 0.7 }, { x: 0.5, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.5, y: 0.5 }, { x: 0.2, y: 0.7 }],
        unlockScore: 92.0
    },
    {
        id: 12,
        name: "The Arrow",
        description: "Aim for perfection.",
        fact: "A graphical symbol used to point or indicate direction, derived from the projectile weapon.",
        shape: [{ x: 0.2, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.6, y: 0.2 }, { x: 0.9, y: 0.5 }, { x: 0.6, y: 0.8 }, { x: 0.6, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }],
        unlockScore: 92.0
    },
    {
        id: 13,
        name: "The Octagon",
        description: "Common, but hard to keep even.",
        fact: "An eight-sided polygon. It is the standard shape for Stop signs in many countries.",
        shape: createPoly(8),
        unlockScore: 92.0
    },
    {
        id: 14,
        name: "The Septagon",
        description: "Seven sides. Pure chaos.",
        fact: "Actually called a Heptagon. It is the only regular polygon sides 3-10 that cannot be constructed with just a compass and straightedge.",
        shape: createPoly(7),
        unlockScore: 92.0
    },
    {
        id: 15,
        name: "The Cross",
        description: "Twelve corners of precision.",
        fact: "A geometrical figure consisting of two intersecting lines or bars, usually perpendicular to each other.",
        shape: [
            { x: 0.4, y: 0.2 }, { x: 0.6, y: 0.2 }, { x: 0.6, y: 0.4 }, { x: 0.8, y: 0.4 },
            { x: 0.8, y: 0.6 }, { x: 0.6, y: 0.6 }, { x: 0.6, y: 0.8 }, { x: 0.4, y: 0.8 },
            { x: 0.4, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }, { x: 0.4, y: 0.4 }, { x: 0.4, y: 0.2 }
        ],
        unlockScore: 92.0
    },
    {
        id: 16,
        name: "The Lightning Bolt",
        description: "Strike fast, strike true.",
        fact: "A zigzag pattern resembling the path of a lightning discharge. Symbolizes power and speed.",
        shape: [
            { x: 0.45, y: 0.1 }, { x: 0.3, y: 0.55 }, { x: 0.5, y: 0.55 }, { x: 0.4, y: 0.9 },
            { x: 0.7, y: 0.4 }, { x: 0.5, y: 0.4 }, { x: 0.6, y: 0.1 }, { x: 0.45, y: 0.1 }
        ],
        unlockScore: 92.0
    },
    {
        id: 17,
        name: "The Bowtie",
        description: "Infinite loop in disguise.",
        fact: "A shape consisting of two triangles meeting at a vertex. A form of crossed quadrilateral.",
        shape: [{ x: 0.2, y: 0.25 }, { x: 0.8, y: 0.25 }, { x: 0.2, y: 0.75 }, { x: 0.8, y: 0.75 }, { x: 0.2, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 18,
        name: "The 5-Pointed Star",
        description: "The Grandmaster shape.",
        fact: "A Pentagram. The angle at each point is 36 degrees. It has been a symbol of fame and magic for centuries.",
        shape: createStar(5, 0.35, 0.15),
        unlockScore: 92.0
    },
    {
        id: 19,
        name: "The Circle",
        description: "The ultimate test of steady motion.",
        fact: "A set of all points in a plane that are at a given distance from a given point (the center). It has infinite symmetry.",
        shape: createPoly(60),
        unlockScore: 92.0
    },
    {
        id: 20,
        name: "The Hourglass",
        description: "Time flows through it.",
        fact: "Two triangles joined vertically at a vertex, used to measure time in sand timers.",
        shape: [{ x: 0.25, y: 0.2 }, { x: 0.75, y: 0.2 }, { x: 0.25, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.25, y: 0.2 }],
        unlockScore: 92.0
    },

    // --- ADVANCED (21-30) - Curvy & Complex ---
    {
        id: 21,
        name: "The Ellipse",
        description: "A stretched circle.",
        fact: "A closed curve defined by two focal points; the sum of distances from any point on the curve to the two foci is constant.",
        shape: createEllipse(0.35, 0.2),
        unlockScore: 92.0
    },
    {
        id: 22,
        name: "The Shield",
        description: "Defend the Dojo.",
        fact: "A heater shield shape, common in medieval heraldry, designed to protect the user's body.",
        shape: [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.9 }, { x: 0.2, y: 0.5 }, { x: 0.2, y: 0.2 }],
        unlockScore: 92.0
    },
    {
        id: 23,
        name: "The Capsule",
        description: "Smooth ends.",
        fact: "A geometric shape consisting of a cylinder with hemispherical ends. Also known as a stadium of revolution.",
        shape: (() => {
            const points: Point[] = [];
            const r = 0.15;
            const cx = 0.5;
            const topCy = 0.35;
            const botCy = 0.65;
            const segments = 30;

            // 1. Right Line (Top to Bottom)
            // (0.65, 0.35) to (0.65, 0.65)
            // Actually, let's trace arcs and fill lines implicitly or explicitly?
            // Explicit is better for sampling.

            // Start at Top-Right
            // 1. Arc Top (Right half? No, full Top Semicircle)
            // Let's go Clockwise or CCW? Standard is usually CCW for math, but UI drawing often CW?
            // Let's do CCW starting from Right side.

            // Part 1: Right Line (Down? No, CCW is Up on Right side).
            // Let's go CCW.
            // Start Bottom-Right (0.65, 0.65).
            // Go Up to Top-Right (0.65, 0.35).
            points.push({ x: cx + r, y: botCy });
            points.push({ x: cx + r, y: topCy });

            // Part 2: Top Semicircle (CCW)
            // Center (0.5, 0.35). Angle 0 to PI.
            for (let i = 0; i <= segments; i++) {
                const ang = 0 + (Math.PI - 0) * (i / segments);
                // Wait, 0 is Right. PI is Left.
                // But we are at Top.
                // Math.cos(0) = 1 (Right). 
                // So angle 0 corresponds to (0.65, 0.35). Correct.
                // Angle PI corresponds to (0.35, 0.35). Correct.
                // We want the arc to go UP. sin(ang) > 0? No, y is inverted in screen coords?
                // Screen coords: Y increases DOWN.
                // So sin(0..PI) is Positive (Down).
                // We want the Top arc (y < 0.35).
                // So we need sin to be negative relative to center.
                // So angle range: -PI? No.
                // Center y=0.35. Top is 0.2.
                // We need y = 0.35 + r*sin(theta).
                // If theta=0..PI, sin is 0..1..0. y = 0.35..0.5..0.35. That's expanding DOWN.
                // We want expanding UP (Y < 0.35).
                // So typical math angle wrapping.
                // We need range that gives negative sin.
                // PI to 2PI (or -PI to 0).
                // Left is PI. Right is 2PI (0).
                // We are at Right (0). We want to go to Left (PI) via Top.
                // So we go 2PI -> PI? No, 0 -> -PI.
                // Or: Y = cy - r*sin(ang)? No, keep math standard.
                // Standard: 0 (Right), -PI/2 (Up/Top), -PI (Left).
                // So range: 0 down to -PI.
                const ang = 0 + (-Math.PI - 0) * (i / segments);
                points.push({
                    x: cx + r * Math.cos(ang),
                    y: topCy + r * Math.sin(ang)
                });
            }

            // Part 3: Left Line (Down)
            // Current point is (0.35, 0.35).
            // Go to (0.35, 0.65).
            points.push({ x: cx - r, y: botCy });

            // Part 4: Bottom Semicircle (CCW)
            // Center (0.5, 0.65).
            // We are at Left (PI). We want to go to Right (0/2PI) via Bottom.
            // Bottom means Y > 0.65.
            // sin must be positive.
            // range PI to 2PI? No. PI is Left. 0 is Right.
            // PI -> 0? sin(PI..0) is 0..1..0? No.
            // Quadrants:
            // 0..PI/2 (DownRight).
            // PI/2..PI (DownLeft).
            // We start at Left (PI). We need to go Down and Right.
            // So PI -> 2PI?
            // sin(PI) = 0. sin(3PI/2) = -1. Y increases?
            // Math.sin(3PI/2) = -1. y = cy - r = Up.
            // We want y = cy + r = Down.
            // So sin positive.
            // sin is positive in 0..PI.
            // But 0 is Right. PI is Left.
            // So we go PI -> 0.
            // sin(PI) = 0. sin(PI/2) = 1 (Down). sin(0) = 0.
            // So path PI -> 0 creates the Bottom arc.
            for (let i = 0; i <= segments; i++) {
                const ang = Math.PI + (0 - Math.PI) * (i / segments);
                points.push({
                    x: cx + r * Math.cos(ang),
                    y: botCy + r * Math.sin(ang)
                });
            }

            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 24,
        name: "The Crescent",
        description: "Waxing gibbous.",
        fact: "The shape produced when a circular disk has a segment of another circle removed from its edge. From Latin 'crescere' (to grow).",
        shape: (() => {
            // Mathematically perfect crescent
            // Generated by intersection of two circles
            const c1 = { x: 0.5, y: 0.5 };
            const r1 = 0.35;
            const c2 = { x: 0.62, y: 0.5 }; // Shifted right
            const r2 = 0.35;

            // Calculate intersection X (relative to c1)
            // x^2 + y^2 = r^2
            // (x-d)^2 + y^2 = r^2  => x = d/2
            const d = c2.x - c1.x;
            const xInt = d / 2;
            const yInt = Math.sqrt(r1 * r1 - xInt * xInt);

            // Angles on C1
            const theta1_top = Math.atan2(yInt, xInt);
            const theta1_bot = Math.atan2(-yInt, xInt);

            // Angles on C2 (relative to c2)
            // Intersection point relative to c2 is (-d/2, yInt)
            const theta2_top = Math.atan2(yInt, xInt - d);
            const theta2_bot = Math.atan2(-yInt, xInt - d);

            const points: Point[] = [];
            const segments = 60;

            // 1. Outer Arc (C1): From Top to Bottom (Counter-Clockwise via Left)
            // Start at top intersection, go around left side to bottom
            // Angle range: theta1_top to (theta1_bot + 2PI)
            let startAng = theta1_top;
            let endAng = theta1_bot + 2 * Math.PI;

            for (let i = 0; i <= segments; i++) {
                const ang = startAng + (endAng - startAng) * (i / segments);
                points.push({
                    x: c1.x + r1 * Math.cos(ang),
                    y: c1.y + r1 * Math.sin(ang)
                });
            }

            // 2. Inner Arc (C2): From Bottom to Top (Clockwise via Left)
            // We want to trace the cutout.
            // Rel to C2, we go from theta2_bot to theta2_top
            // But we derived theta2 based on yInt.
            // Let's verify continuity.
            // Last point of 1 is Bottom Tip.
            // Start of 2 should be Bottom Tip.
            // C2 angle at Bottom Tip is theta2_bot.
            // We want to go to Top Tip (theta2_top).
            // Do we go clockwise or CCW? 
            // We want the arc that is "inside" C1. C2 is shifted right.
            // The left side of C2 is inside C1. 
            // So we trace the Left side of C2.
            // Angle range: theta2_bot + 2PI to theta2_top ... wait.
            // theta2_top is approx 120-150 deg (Q2).
            // theta2_bot is approx 210-240 deg (Q3).
            // To trace Left side, we go from Q3 to Q2 via PI (180).
            // So range: theta2_bot to theta2_top (decreasing? no increasing if crossing PI is handled)
            // actually theta2_bot is negative. -2.something.
            // theta2_top is positive. +2.something.
            // So simple linear interp works if we assume -PI to PI range?
            // Let's just go theta2_bot to theta2_top??
            // theta2_bot is roughly -2.5 rad. theta2_top is +2.5 rad.
            // If we go -2.5 -> +2.5, we cross 0 (Right side). We want Left side.
            // So we must go the other way.
            // start = theta2_bot + 2PI? No.
            // Let's use logic:
            // C1 arc goes A -> B.
            // C2 arc goes B -> A.
            // We need points for C2 arc from Bottom to Top.
            // C2 center is to the right. Tips are on left.
            // So the arc closing the shape is the Left side of C2.
            // (Same side as Outer Arc).
            // So angles are similar.

            // Let's re-calculate angles carefully roughly.
            // d=0.12. r=0.35. xInt = 0.06. yInt = 0.34.
            // C1 Top Tip angle: atan2(0.34, 0.06) ~= 80 deg (1.4 rad).
            // C1 Bot Tip angle: -1.4 rad.
            // Outer loop: 1.4 -> ... -> 3.14 -> ... -> 4.88 (which is -1.4 + 2PI). CORRECT.

            // C2 angles. top tip relative to C2(0.62, 0.5) is (-0.06, 0.34).
            // Top Angle: atan2(0.34, -0.06) ~= 100 deg (1.74 rad).
            // Bot Angle: -1.74 rad.
            // We want to go Bottom -> Top.
            // -1.74 -> ... -> 3.14 -> ... -> 1.74 ?
            // No, -1.74 to 1.74 crosses 0 (Right Side).
            // We want Left side (crossing PI).
            // So start at Bottom: 2PI - 1.74 (4.54) or just -1.74?
            // If we go from -1.74 DOWN to -PI, wrap to PI, down to 1.74?
            // Or just: Start = theta2_bot + 2PI (if needed).
            // We want the "long way" around if the short way is right side.
            // Short way is -1.74 to 1.74 (range 3.5).
            // Long way is 1.74 to -1.74 (range 2PI - 3.5).
            // Since we want the "Left" side of C2 (which is the side contained in C1?),
            // Wait. C2 is shifted Right.
            // The intersection chord is vertical-ish.
            // The area of intersection is the lens.
            // We want C1 - C2.
            // So we keep the Left part of C1.
            // And we subtract C2.
            // So the boundary is Left part of C1 AND Left part of C2?
            // Yes.
            // So we trace Left part of C2 from Bottom to Top.
            // Left part of C2 includes angle PI.
            // So we go from Bottom (-1.74) to Top (1.74) passing through PI? No, passing through PI means crossing +/- 3.14.
            // -1.74 is Q3. 1.74 is Q2.
            // To go Q3 -> Q2 via Q2/3 border (PI), we assume angles are increasing?
            // -1.74 to -3.14 is decreasing.
            // Let's use positive 0-2PI.
            // Bot: 2PI - 1.74 = 4.54.
            // Top: 1.74.
            // We go 4.54 -> ... -> 3.14 is wrong direction (CW).
            // We want CCW?
            // Outer arc was 1.4 -> 4.8 (CCW).
            // If we continue CCW from Bottom Tip?
            // Bottom Tip is 4.8 on C1.
            // On C2 it is 4.54.
            // If we go CCW on C2: 4.54 -> 6.28 -> 0 -> 1.74. This is the Right side (bulge).
            // We want the inward curve. That is CW.
            // So we go CW from Bottom Tip to Top Tip.
            // 4.54 -> 3.14 -> 1.74.
            // Yes.

            const startAng2 = theta2_bot; // -1.74
            const endAng2 = theta2_top; // 1.74

            for (let i = 0; i <= segments; i++) {
                // We want CW from startAng2 to endAng2.
                // If startAng2 is greater than endAng2 (e.g., 4.54 to 1.74 in 0-2PI range),
                // or if startAng2 is negative and endAng2 is positive, and we want to go through -PI (or PI).
                // The range from startAng2 to endAng2 (e.g., -1.74 to 1.74) is CCW.
                // To go CW, we need to subtract 2*PI from the end angle to make it smaller.
                // E.g., -1.74 to (1.74 - 2*PI) = -4.54.
                // Then interpolate from -1.74 down to -4.54.
                const ang = startAng2 + ((endAng2 - 2 * Math.PI) - startAng2) * (i / segments);

                points.push({
                    x: c2.x + r2 * Math.cos(ang),
                    y: c2.y + r2 * Math.sin(ang)
                });
            }
            // Ensure closure
            points.push(points[0]);

            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 25,
        name: "The Heart",
        description: "With love (and curves).",
        fact: "Mathematically known as a Cardioid. The shape has been a symbol of love since the late Middle Ages.",
        shape: heartPoints,
        unlockScore: 92.0
    },
    {
        id: 26,
        name: "The Infinity",
        description: "Forever and ever.",
        fact: "The Lemniscate of Bernoulli. 'Lemniskos' means 'ribbon' in Greek. It represents the concept of eternity.",
        shape: infinityPoints,
        unlockScore: 92.0
    },
    {
        id: 27,
        name: "The Teardrop",
        description: "Cry me a river.",
        fact: "A hydrodynamic shape resembling a falling drop of water, which tapers at the top due to surface tension and air resistance.",
        shape: createParametric(
            (t) => Math.sin(t) * Math.pow(Math.sin(t / 2), 0.5),
            (t) => -Math.cos(t),
            0.35, { x: 0.5, y: 0.6 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 28,
        name: "The Guitar Pick",
        description: "Reuleaux Triangle Smoothness.",
        fact: "A curve of constant width. A Reuleaux triangle can rotate inside a square while maintaining contact with all four sides.",
        shape: createParametric(
            (t) => Math.cos(t) + 0.2 * Math.cos(2 * t),
            (t) => Math.sin(t) - 0.2 * Math.sin(2 * t),
            0.25, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 29,
        name: "The Club",
        description: "A clover by any other name.",
        fact: "One of the four suits of playing cards. It represents a clover leaf, which is a variation of the trefoil knot.",
        shape: createParametric(
            (t) => Math.cos(t) * (1 + Math.cos(3 * t)),
            (t) => Math.sin(t) * (1 + Math.cos(3 * t)),
            0.15, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 30,
        name: "The Mystic",
        description: "Hypocycloid Madness.",
        fact: "A hypocycloid is the curve traced by a point on a small circle rolling inside a larger circle.",
        shape: createParametric(
            (t) => 0.7 * Math.cos(t) + 0.3 * Math.cos(3.5 * t),
            (t) => 0.7 * Math.sin(t) - 0.3 * Math.sin(3.5 * t),
            0.25, { x: 0.5, y: 0.5 }, 0, 4 * Math.PI
        ),
        unlockScore: 92.0
    }
];

export default levels;
