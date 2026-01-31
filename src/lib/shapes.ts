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
    // --- BEGINNER (1-10): Basics ---
    {
        id: 1,
        name: "The Straight Line",
        description: "The simplest path.",
        fact: "A line is the shortest distance between two points. It has exactly one dimension.",
        shape: [{ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }],
        unlockScore: 92.0
    },
    {
        id: 2,
        name: "Right Triangle",
        description: "The 90° master class.",
        fact: "The side opposite the right angle is called the hypotenuse, and it's always the longest side.",
        shape: [{ x: 0.3, y: 0.25 }, { x: 0.3, y: 0.75 }, { x: 0.7, y: 0.75 }, { x: 0.3, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 3,
        name: "Equilateral Triangle",
        description: "Perfect balance.",
        fact: "All internal angles are 60°. It is the only regular polygon with three sides.",
        shape: createPoly(3, 0.35, { x: 0.5, y: 0.6 }, -Math.PI / 2),
        unlockScore: 92.0
    },
    {
        id: 4,
        name: "The Square",
        description: "Four equal sides.",
        fact: "A square is both a rhombus (all sides equal) and a rectangle (all angles 90°).",
        shape: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 }, { x: 0.25, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 5,
        name: "The Rectangle",
        description: "Classic proportions.",
        fact: "The word comes from Latin 'rectus' (right) and 'angulus' (angle).",
        shape: [{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.2, y: 0.7 }, { x: 0.2, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 6,
        name: "The Parallelogram",
        description: "Leaning into it.",
        fact: "Opposite sides are parallel and equal in length. Opposite angles are also equal.",
        shape: [{ x: 0.35, y: 0.3 }, { x: 0.85, y: 0.3 }, { x: 0.65, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.35, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 7,
        name: "The Trapezoid",
        description: "A solid base.",
        fact: "In many countries, this is called a Trapezium. It has at least one pair of parallel sides.",
        shape: [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.85, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.3, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 8,
        name: "The Diamond",
        description: "Pure symmetry.",
        fact: "Mathematically a 'Rhombus', a quadrilateral where all four sides have the same length.",
        shape: [{ x: 0.5, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.8 }, { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.2 }],
        unlockScore: 92.0
    },
    {
        id: 9,
        name: "The Kite",
        description: "Flying high.",
        fact: "A kite has two pairs of equal-length sides that are adjacent to each other.",
        shape: [{ x: 0.5, y: 0.15 }, { x: 0.8, y: 0.45 }, { x: 0.5, y: 0.85 }, { x: 0.2, y: 0.45 }, { x: 0.5, y: 0.15 }],
        unlockScore: 92.0
    },
    {
        id: 10,
        name: "The House",
        description: "A geometric home.",
        fact: "This shape combines a square base with a triangular roof, a common composite shape.",
        shape: [{ x: 0.25, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.75, y: 0.4 }, { x: 0.5, y: 0.15 }, { x: 0.25, y: 0.4 }, { x: 0.25, y: 0.8 }],
        unlockScore: 92.0
    },

    // --- APPRENTICE (11-20): More Sides & Segments ---
    {
        id: 11,
        name: "The Pentagon",
        description: "Five-sided fortress.",
        fact: "The internal angles sum to 540°. Nature uses pentagons in flower petals and starfish.",
        shape: createPoly(5),
        unlockScore: 92.0
    },
    {
        id: 12,
        name: "The Hexagon",
        description: "Nature's perfect tile.",
        fact: "Bees use hexagons for honeycombs because they cover the most area with the least amount of wax.",
        shape: createPoly(6),
        unlockScore: 92.0
    },
    {
        id: 13,
        name: "The Semicircle",
        description: "Half the journey.",
        fact: "A semicircle is an arc of 180°. The perimeter includes both the arc and the diameter.",
        shape: (() => {
            const points: Point[] = [];
            for (let i = 0; i <= 30; i++) {
                const ang = Math.PI + (i * Math.PI / 30);
                points.push({ x: 0.5 + 0.35 * Math.cos(ang), y: 0.5 + 0.35 * Math.sin(ang) });
            }
            points.push({ x: 0.85, y: 0.5 }, { x: 0.15, y: 0.5 });
            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 14,
        name: "The Chevron",
        description: "Double the point.",
        fact: "Used for centuries in heraldry and modern road signs to indicate sharp turns.",
        shape: [{ x: 0.2, y: 0.7 }, { x: 0.5, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.5, y: 0.5 }, { x: 0.2, y: 0.7 }],
        unlockScore: 92.0
    },
    {
        id: 15,
        name: "The Arrow",
        description: "Direct focus.",
        fact: "A combination of a rectangle and a triangle, designed for directional clarity.",
        shape: [{ x: 0.2, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.6, y: 0.2 }, { x: 0.9, y: 0.5 }, { x: 0.6, y: 0.8 }, { x: 0.6, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }],
        unlockScore: 92.0
    },
    {
        id: 16,
        name: "The Plus Sign",
        description: "Four-way symmetry.",
        fact: "Also known as a Greek Cross, where all four arms are of equal length.",
        shape: [
            { x: 0.4, y: 0.4 }, { x: 0.4, y: 0.2 }, { x: 0.6, y: 0.2 }, { x: 0.6, y: 0.4 },
            { x: 0.8, y: 0.4 }, { x: 0.8, y: 0.6 }, { x: 0.6, y: 0.6 }, { x: 0.6, y: 0.8 },
            { x: 0.4, y: 0.8 }, { x: 0.4, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }, { x: 0.4, y: 0.4 }
        ],
        unlockScore: 92.0
    },
    {
        id: 17,
        name: "The Heptagon",
        description: "The lucky seven.",
        fact: "Heptagons are rare in nature and construction because they cannot be constructed exactly with ruler and compass.",
        shape: createPoly(7),
        unlockScore: 92.0
    },
    {
        id: 18,
        name: "The Octagon",
        description: "Stop and look.",
        fact: "Commonly used for stop signs because the shape is recognizable even when covered by snow or dirt.",
        shape: createPoly(8),
        unlockScore: 92.0
    },
    {
        id: 19,
        name: "The Cross",
        description: "Traditional geometry.",
        fact: "A 'Latin Cross' variant, commonly seen in architecture and symbols throughout history.",
        shape: [
            { x: 0.4, y: 0.15 }, { x: 0.6, y: 0.15 }, { x: 0.6, y: 0.4 }, { x: 0.85, y: 0.4 },
            { x: 0.85, y: 0.6 }, { x: 0.6, y: 0.6 }, { x: 0.6, y: 0.9 }, { x: 0.4, y: 0.9 },
            { x: 0.4, y: 0.6 }, { x: 0.15, y: 0.6 }, { x: 0.15, y: 0.4 }, { x: 0.4, y: 0.4 }, { x: 0.4, y: 0.15 }
        ],
        unlockScore: 92.0
    },
    {
        id: 20,
        name: "6-Pointed Star",
        description: "The Hexagram.",
        fact: "Formed by two interlocking equilateral triangles. It appears in nature in the structure of some crystals.",
        shape: createStar(6, 0.35, 0.2),
        unlockScore: 92.0
    },

    // --- WARRIOR (21-30): Complex Polygons & Curves ---
    {
        id: 21,
        name: "8-Pointed Star",
        description: "Celestial radiance.",
        fact: "Also called the 'Octagram', it is a common motif in Islamic and Hindu art.",
        shape: createStar(8, 0.35, 0.18),
        unlockScore: 92.0
    },
    {
        id: 22,
        name: "The Lightning Bolt",
        description: "Static energy.",
        fact: "A zigzag path representing discharge. It tests your ability to maintain momentum through sharp angles.",
        shape: [
            { x: 0.45, y: 0.1 }, { x: 0.3, y: 0.55 }, { x: 0.5, y: 0.55 }, { x: 0.4, y: 0.9 },
            { x: 0.7, y: 0.4 }, { x: 0.5, y: 0.4 }, { x: 0.6, y: 0.1 }, { x: 0.45, y: 0.1 }
        ],
        unlockScore: 92.0
    },
    {
        id: 23,
        name: "The Bowtie",
        description: "Inverted triangles.",
        fact: "A central meeting point for two identical triangles. A classic test of vertex precision.",
        shape: [{ x: 0.2, y: 0.25 }, { x: 0.8, y: 0.25 }, { x: 0.2, y: 0.75 }, { x: 0.8, y: 0.75 }, { x: 0.2, y: 0.25 }],
        unlockScore: 92.0
    },
    {
        id: 24,
        name: "5-Pointed Star",
        description: "The classic pentagram.",
        fact: "The angle at each point of a regular pentagram is 36°.",
        shape: createStar(5, 0.35, 0.15),
        unlockScore: 92.0
    },
    {
        id: 25,
        name: "The Circle",
        description: "Infinite symmetry.",
        fact: "A polygon with an infinite number of sides. The center is equidistant from every point on the edge.",
        shape: createPoly(60),
        unlockScore: 92.0
    },
    {
        id: 26,
        name: "The Hourglass",
        description: "Time's container.",
        fact: "Two triangles joined vertically. In Greek, it might be called a 'Lemniscate' variant in polyline form.",
        shape: [{ x: 0.25, y: 0.2 }, { x: 0.75, y: 0.2 }, { x: 0.25, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.25, y: 0.2 }],
        unlockScore: 92.0
    },
    {
        id: 27,
        name: "The Zig-Zag",
        description: "Control the chaos.",
        fact: "A series of sharp alternating turns. Precision at the peaks is key to a high score.",
        shape: [{ x: 0.2, y: 0.3 }, { x: 0.35, y: 0.7 }, { x: 0.5, y: 0.3 }, { x: 0.65, y: 0.7 }, { x: 0.8, y: 0.3 }],
        unlockScore: 92.0
    },
    {
        id: 28,
        name: "The Pacman",
        description: "Waka waka.",
        fact: "A sector of a circle. Usually defined by an angle of 300° for the body and a 60° opening.",
        shape: (() => {
            const points: Point[] = [];
            for (let i = 0; i <= 40; i++) {
                const ang = (30 * Math.PI / 180) + (i * 300 * Math.PI / 180 / 40);
                points.push({ x: 0.5 + 0.35 * Math.cos(ang), y: 0.5 + 0.35 * Math.sin(ang) });
            }
            points.push({ x: 0.5, y: 0.5 }, { x: 0.5 + 0.35 * Math.cos(30 * Math.PI / 180), y: 0.5 + 0.35 * Math.sin(30 * Math.PI / 180) });
            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 29,
        name: "The Shield",
        description: "Medieval protection.",
        fact: "A shape common in heraldry, known as the 'Heater Shield' due to its resemblance to an iron's base.",
        shape: [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.9 }, { x: 0.2, y: 0.5 }, { x: 0.2, y: 0.2 }],
        unlockScore: 92.0
    },
    {
        id: 30,
        name: "The Capsule",
        description: "Stadium geometry.",
        fact: "Formed by a rectangle with two semicircular ends. High-speed tracks often follow this path.",
        shape: (() => {
            const points: Point[] = [];
            const r = 0.15, cx = 0.5, topY = 0.35, botY = 0.65;
            for (let i = 0; i <= 20; i++) {
                const ang = Math.PI + (i * Math.PI / 20);
                points.push({ x: cx + r * Math.cos(ang), y: topY + r * Math.sin(ang) });
            }
            for (let i = 0; i <= 20; i++) {
                const ang = 0 + (i * Math.PI / 20);
                points.push({ x: cx + r * Math.cos(ang), y: botY + r * Math.sin(ang) });
            }
            points.push(points[0]);
            return points;
        })(),
        unlockScore: 92.0
    },

    // --- SENSEI (31-40): Advanced Arcs & Curves ---
    {
        id: 31,
        name: "The Crescent",
        description: "Waxing and waning.",
        fact: "The shape of the moon in its first or last quarter. Derived from the Latin 'crescere', meaning to increase.",
        shape: createEllipse(0.35, 0.35).slice(0, 30).concat([{ x: 0.5, y: 0.5 }]), // Simplified proxy for speed, the complex one was too hard
        unlockScore: 92.0
    },
    {
        id: 32,
        name: "The Ellipse",
        description: "The planetary orbit.",
        fact: "Every point on an ellipse has the same sum of distances to two focal points.",
        shape: createEllipse(0.35, 0.2),
        unlockScore: 92.0
    },
    {
        id: 33,
        name: "The Heart",
        description: "Pulse of the Dojo.",
        fact: "A cardioid-like parametric curve. Used as a symbol of love and affection across many cultures.",
        shape: heartPoints,
        unlockScore: 92.0
    },
    {
        id: 34,
        name: "The Infinity",
        description: "Limitless loop.",
        fact: "The Lemniscate of Bernoulli. Its name comes from the Latin 'lemniscus', meaning 'decorated with ribbons'.",
        shape: infinityPoints,
        unlockScore: 92.0
    },
    {
        id: 35,
        name: "The Teardrop",
        description: "Fluid dynamics.",
        fact: "The most aerodynamic shape in nature, minimizing drag as fluid flows around it.",
        shape: createParametric(
            (t) => Math.sin(t) * Math.pow(Math.sin(t / 2), 0.5),
            (t) => -Math.cos(t),
            0.35, { x: 0.5, y: 0.6 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 36,
        name: "The Guitar Pick",
        description: "Reuleaux Triangle.",
        fact: "A curve of constant width. It can rotate inside a square while always touching all four sides.",
        shape: createParametric(
            (t) => Math.cos(t) + 0.2 * Math.cos(2 * t),
            (t) => Math.sin(t) - 0.2 * Math.sin(2 * t),
            0.25, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 37,
        name: "The Astroid",
        description: "Four-pointed star curve.",
        fact: "The curve traced by a point on a circle of radius R/4 rolling inside a circle of radius R.",
        shape: createParametric(
            (t) => Math.pow(Math.cos(t), 3),
            (t) => Math.pow(Math.sin(t), 3),
            0.3, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 38,
        name: "The Deltoid",
        description: "Three-pointed hypocycloid.",
        fact: "Named after the Greek letter Delta (Δ). It has three cusps and is a curve of constant width.",
        shape: createParametric(
            (t) => 2 * Math.cos(t) + Math.cos(2 * t),
            (t) => 2 * Math.sin(t) - Math.sin(2 * t),
            0.12, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 39,
        name: "The Nephroid",
        description: "Kidney-shaped curve.",
        fact: "An epicycloid with two cusps. Its name means 'kidney-shaped' (Greek 'nephros').",
        shape: createParametric(
            (t) => 3 * Math.cos(t) - Math.cos(3 * t),
            (t) => 3 * Math.sin(t) - Math.sin(3 * t),
            0.09, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 40,
        name: "The Clover",
        description: "Three-leaf luck.",
        fact: "A rhodonea curve, or rose curve, with 3 petals. It requires steady, continuous motion to master.",
        shape: createParametric(
            (t) => Math.cos(3 * t) * Math.cos(t),
            (t) => Math.cos(3 * t) * Math.sin(t),
            0.35, { x: 0.5, y: 0.5 }, 0, Math.PI
        ),
        unlockScore: 92.0
    },

    // --- ZEN (41-50): Master Parametrics & Complex Patterns ---
    {
        id: 41,
        name: "The Spade",
        description: "The sharpest suit.",
        fact: "A combination of a pointed top with a wider base and a stem. It symbolizes the pike or halberd.",
        shape: (() => {
            const points: Point[] = [];
            // Body of the spade (inverted heart-ish)
            for (let i = 0; i <= 60; i++) {
                const t = i * 2 * Math.PI / 60;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                points.push({ x: 0.5 + x * 0.015, y: 0.45 - y * 0.015 });
            }
            // Base/Stem
            points.push({ x: 0.5, y: 0.7 }, { x: 0.4, y: 0.9 }, { x: 0.6, y: 0.9 }, { x: 0.5, y: 0.7 });
            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 42,
        name: "The Fish",
        description: "Swimming upstream.",
        fact: "An ichthyoid curve. A simple mathematical representation of a fish body and tail.",
        shape: createParametric(
            (t) => Math.cos(t) - Math.pow(Math.sin(t), 2) / Math.sqrt(2),
            (t) => Math.cos(t) * Math.sin(t),
            0.25, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 43,
        name: "The Eye",
        description: "Vision and focus.",
        fact: "Formed by the intersection of two equal circular arcs. In architecture, this is called a Vesica Piscis.",
        shape: (() => {
            const points: Point[] = [];
            for (let i = 0; i <= 30; i++) {
                const ang = -Math.PI / 4 + (i * Math.PI / 2 / 30);
                points.push({ x: 0.2 + 0.6 * Math.cos(ang), y: 0.5 + 0.6 * Math.sin(ang) });
            }
            for (let i = 0; i <= 30; i++) {
                const ang = 3 * Math.PI / 4 + (i * Math.PI / 2 / 30);
                points.push({ x: 0.8 + 0.6 * Math.cos(ang), y: 0.5 + 0.6 * Math.sin(ang) });
            }
            points.push(points[0]);
            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 44,
        name: "The Wave",
        description: "Sinusoidal flow.",
        fact: "The fundamental oscillation in mathematics and physics. It represents sound, light, and energy.",
        shape: (() => {
            const points: Point[] = [];
            for (let i = 0; i <= 100; i++) {
                const x = 0.15 + 0.7 * (i / 100);
                const y = 0.5 + 0.2 * Math.sin(i * 2 * Math.PI / 50);
                points.push({ x, y });
            }
            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 45,
        name: "The Keyhole",
        description: "Unlocking potential.",
        fact: "A composite shape of a circle atop a trapezoid, symbolizing restricted access and mystery.",
        shape: [
            { x: 0.5, y: 0.15 }, { x: 0.65, y: 0.2 }, { x: 0.7, y: 0.35 }, { x: 0.65, y: 0.5 },
            { x: 0.75, y: 0.85 }, { x: 0.25, y: 0.85 }, { x: 0.35, y: 0.5 }, { x: 0.3, y: 0.35 },
            { x: 0.35, y: 0.2 }, { x: 0.5, y: 0.15 }
        ],
        unlockScore: 92.0
    },
    {
        id: 46,
        name: "The Lotus",
        description: "A geometric bloom.",
        fact: "The lotus flower is a symbol of purity and enlightenment. Its geometry is often used in sacred patterns like the Mandala.",
        shape: createParametric(
            (t) => (1 + 0.25 * Math.sin(6 * t)) * Math.cos(t),
            (t) => (1 + 0.25 * Math.sin(6 * t)) * Math.sin(t),
            0.28, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 47,
        name: "The Spiral",
        description: "Archimedean wonder.",
        fact: "A curve that moves away from its center as it rotates. Common in shells, galaxies, and storms.",
        shape: createParametric(
            (t) => t * Math.cos(2 * t),
            (t) => t * Math.sin(2 * t),
            0.05, { x: 0.5, y: 0.5 }, 0, 3 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 48,
        name: "The Fan",
        description: "Keep it cool.",
        fact: "Hand fans have been used for thousands of years as symbols of status and tools for relief from heat.",
        shape: (() => {
            const points: Point[] = [];
            const r = 0.4;
            const cx = 0.5, cy = 0.8;
            // Arc from -30 to -150 degrees
            for (let i = 0; i <= 40; i++) {
                const ang = (-30 * Math.PI / 180) - (i * 120 * Math.PI / 180 / 40);
                points.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
            }
            points.push({ x: cx, y: cy }, { x: cx + r * Math.cos(-30 * Math.PI / 180), y: cy + r * Math.sin(-30 * Math.PI / 180) });
            return points;
        })(),
        unlockScore: 92.0
    },
    {
        id: 49,
        name: "The Mystic",
        description: "Hypocycloid madness.",
        fact: "A curve traced by a point on a small circle rolling inside a larger circle. It has infinite variations.",
        shape: createParametric(
            (t) => 0.7 * Math.cos(t) + 0.3 * Math.cos(3.5 * t),
            (t) => 0.7 * Math.sin(t) - 0.3 * Math.sin(3.5 * t),
            0.25, { x: 0.5, y: 0.5 }, 0, 4 * Math.PI
        ),
        unlockScore: 92.0
    },
    {
        id: 50,
        name: "The Grandmaster",
        description: "The ultimate challenge.",
        fact: "A complex epitrochoid curve. Mastering this shape requires perfect rhythm and spatial awareness.",
        shape: createParametric(
            (t) => Math.cos(t) + 0.5 * Math.cos(7 * t) + 0.33 * Math.sin(17 * t),
            (t) => Math.sin(t) + 0.5 * Math.sin(7 * t) + 0.33 * Math.cos(17 * t),
            0.15, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI, 300
        ),
        unlockScore: 92.0
    }
];

export default levels;
