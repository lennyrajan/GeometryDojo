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
        shape: createEllipse(0.15, 0.3), // Simplified to vertical ellipse logic for now or custom logic if we fixed it
        unlockScore: 92.0
    },
    {
        id: 24,
        name: "The Crescent",
        description: "Waxing gibbous.",
        fact: "The shape produced when a circular disk has a segment of another circle removed from its edge. From Latin 'crescere' (to grow).",
        shape: (() => {
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
            (t) => Math.cos(t),
            (t) => Math.sin(t) * Math.pow(Math.sin(t / 2), 0.5),
            0.35, { x: 0.5, y: 0.3 }, 0, 4 * Math.PI
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
