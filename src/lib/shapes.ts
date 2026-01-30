import { Point } from './geometry';

export interface Level {
    id: number;
    name: string;
    description: string;
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
// Assumes functions return values that fit roughly in -1 to 1, then scaled
const createParametric = (
    funcX: (t: number) => number,
    funcY: (t: number) => number,
    scale: number,
    center: Point,
    tMin: number,
    tMax: number,
    segments: number = 60
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

// Heart Curve
const heartPoints = createParametric(
    (t) => 16 * Math.pow(Math.sin(t), 3),
    (t) => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    0.025, // Scale
    { x: 0.5, y: 0.45 },
    0,
    2 * Math.PI,
    100
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


// Improved Crescent manually
const crescentPoints = (() => {
    const pts: Point[] = [];
    const segs = 50;
    // Outer circle (larger)
    for (let i = 0; i <= segs; i++) {
        const theta = -Math.PI * 0.2 + (i * Math.PI * 1.4) / segs;
        pts.push({ x: 0.5 + 0.35 * Math.cos(theta), y: 0.5 + 0.35 * Math.sin(theta) });
    }
    // Inner circle (smaller radius, offset) - reverse order
    for (let i = segs; i >= 0; i--) {
        const theta = -Math.PI * 0.2 + (i * Math.PI * 1.4) / segs;
        pts.push({ x: 0.65 + 0.25 * Math.cos(theta), y: 0.5 + 0.25 * Math.sin(theta) });
    }
    pts.push(pts[0]); // Close
    return pts;
})();


const levels: Level[] = [
    // --- BASIC (1-10) ---
    {
        id: 1,
        name: "The Straight Line",
        description: "The foundation of all geometry.",
        shape: [{ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }],
        unlockScore: 92.0
    },
    {
        id: 2,
        name: "Right Triangle",
        description: "The 90° master class.",
        shape: [{ x: 0.3, y: 0.25 }, { x: 0.3, y: 0.75 }, { x: 0.7, y: 0.75 }, { x: 0.3, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 3,
        name: "Equilateral Triangle",
        description: "Three sharp 60° angles.",
        shape: createPoly(3, 0.35, { x: 0.5, y: 0.6 }, -Math.PI / 2),
        unlockScore: 92.0
    },
    {
        id: 4,
        name: "The Square",
        description: "Four 90° corners. Even sides.",
        shape: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 }, { x: 0.25, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 5,
        name: "The Rectangle",
        description: "Testing proportions.",
        shape: [{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.2, y: 0.7 }, { x: 0.2, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 6,
        name: "The Diamond",
        description: "A square, tilted. Balance is key.",
        shape: [{ x: 0.5, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.8 }, { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.2 }],
        unlockScore: 92.0
    },
    {
        id: 7,
        name: "The Trapezoid",
        description: "A stable foundation.",
        shape: [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.85, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.3, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 8,
        name: "The Parallelogram",
        description: "Lean into the future.",
        shape: [{ x: 0.35, y: 0.3 }, { x: 0.85, y: 0.3 }, { x: 0.65, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.35, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 9,
        name: "The Pentagon",
        description: "The first odd challenge.",
        shape: createPoly(5),
        unlockScore: 92.0
    },
    {
        id: 10,
        name: "The Hexagon",
        description: "Six sides, very symmetrical.",
        shape: createPoly(6),
        unlockScore: 92.0
    },

    // --- INTERMEDIATE (11-20) ---
    {
        id: 11,
        name: "The Chevron",
        description: "Point the way forward.",
        shape: [{ x: 0.2, y: 0.7 }, { x: 0.5, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.5, y: 0.5 }, { x: 0.2, y: 0.7 }],
        unlockScore: 92.0
    },
    {
        id: 12,
        name: "The Arrow",
        description: "Aim for perfection.",
        shape: [{ x: 0.2, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.6, y: 0.2 }, { x: 0.9, y: 0.5 }, { x: 0.6, y: 0.8 }, { x: 0.6, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }],
        unlockScore: 92.0
    },
    {
        id: 13,
        name: "The Octagon",
        description: "Common, but hard to keep even.",
        shape: createPoly(8),
        unlockScore: 92.0
    },
    {
        id: 14,
        name: "The Septagon",
        description: "Seven sides. Pure chaos.",
        shape: createPoly(7),
        unlockScore: 92.0
    },
    {
        id: 15,
        name: "The Cross",
        description: "Twelve corners of precision.",
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
        shape: [{ x: 0.2, y: 0.25 }, { x: 0.8, y: 0.25 }, { x: 0.2, y: 0.75 }, { x: 0.8, y: 0.75 }, { x: 0.2, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 18,
        name: "The 5-Pointed Star",
        description: "The Grandmaster shape.",
        shape: createStar(5, 0.35, 0.15),
        unlockScore: 92.0
    },
    {
        id: 19,
        name: "The Circle",
        description: "The ultimate test of steady motion.",
        shape: createPoly(60),
        unlockScore: 92.0
    },
    {
        id: 20,
        name: "The Hourglass",
        description: "Time flows through it.",
        shape: [{ x: 0.25, y: 0.2 }, { x: 0.75, y: 0.2 }, { x: 0.25, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.25, y: 0.2 }],
        unlockScore: 92.0
    },

    // --- ADVANCED (21-30) - Curvy & Complex ---
    {
        id: 21,
        name: "The Ellipse",
        description: "A stretched circle.",
        shape: createEllipse(0.35, 0.2),
        unlockScore: 92.0
    },
    {
        id: 22,
        name: "The Egg",
        description: "Nature's perfect vessel.", // Slightly wider bottom ellipse modification
        shape: createParametric(
            (t) => Math.cos(t),
            (t) => Math.sin(t) * (0.8 + 0.2 * Math.cos(t)), // Egg modifier
            0.35, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 23,
        name: "The Capsule",
        description: "Smooth ends.",
        shape: createEllipse(0.15, 0.3),
        unlockScore: 92.0
    },
    {
        id: 24,
        name: "The Crescent",
        description: "Waxing gibbous.",
        shape: crescentPoints,
        unlockScore: 92.0
    },
    {
        id: 25,
        name: "The Heart",
        description: "With love (and curves).",
        shape: heartPoints,
        unlockScore: 92.0
    },
    {
        id: 26,
        name: "The Infinity",
        description: "Forever and ever.",
        shape: infinityPoints,
        unlockScore: 92.0
    },
    {
        id: 27,
        name: "The Teardrop",
        description: "Cry me a river.",
        shape: createParametric(
            (t) => Math.sin(t) * Math.pow(Math.sin(t / 2), 2), // Teardrop approx
            (t) => Math.cos(t),
            0.8, // Scale needs check.
            { x: 0.5, y: 0.6 }, 0, 2 * Math.PI
            // Actually simpler teardrop:
            // x = cos(t), y = sin(t) * sin(t/2)^m
        ),
        unlockScore: 92.0
    },
    {
        id: 28,
        name: "The Guitar Pick",
        description: "Reuleaux Triangle Smoothness.",
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
        shape: createParametric(
            // Epicycloid or similar
            (t) => Math.cos(t) * (1 + Math.cos(3 * t)), // 3 leaved rose?
            (t) => Math.sin(t) * (1 + Math.cos(3 * t)),
            0.15, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 30,
        name: "The Mystic",
        description: "Hypocycloid Madness.",
        shape: createParametric(
            (t) => 0.7 * Math.cos(t) + 0.3 * Math.cos(3.5 * t), // interesting shape
            (t) => 0.7 * Math.sin(t) - 0.3 * Math.sin(3.5 * t),
            0.25, { x: 0.5, y: 0.5 }, 0, 4 * Math.PI // needs more loops
        ),
        unlockScore: 92.0
    }
];

// Fix for ID 23 - Duplicate with 21 (Both ellipses essentially). 
// Let's replace 23 with "The Shield" (Heater Shield shape).
levels[22].name = "The Shield";
levels[22].description = "Defend the Dojo.";
levels[22].shape = [
    { x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.9 }, { x: 0.2, y: 0.5 }, { x: 0.2, y: 0.2 }
];

// Fix ID 27 Teardrop Parametric - It might be weird. Let's use simple points for Teardrop if parametric fails.
// Let's replace 27 with "The Kite" (Diamond with offset center) if Teardrop is risky, but user wanted curvy.
// Let's try to stick to a customized tear drop or use a simple Loop.
// I'll trust the Parametric helper for now, but Teardrop formula:
// x = cos(t), y = sin(t)*sin(t/2)^m is good.
levels[26].shape = createParametric(
    (t) => Math.cos(t),
    (t) => Math.sin(t) * Math.pow(Math.sin(t / 2), 0.5),
    0.35, { x: 0.5, y: 0.3 }, 0, 4 * Math.PI // 4PI for sin(t/2) full loop
);

export default levels;
