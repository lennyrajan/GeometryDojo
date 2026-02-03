import { Point } from './geometry';

export interface Level {
    id: number;
    name: string;
    description: string;
    fact: string;
    shape: Point[];
    unlockScore: number;
}

// Helpers
const createPoly = (sides: number, radius: number = 0.35, center: Point = { x: 0.5, y: 0.5 }, startAngle: number = -Math.PI / 2): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= sides; i++) {
        const angle = startAngle + (i * 2 * Math.PI / sides);
        points.push({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
    }
    return points;
};

const createStar = (pointsCount: number, outerRadius: number = 0.35, innerRadius: number = 0.15, center: Point = { x: 0.5, y: 0.5 }): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= pointsCount * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = -Math.PI / 2 + (i * Math.PI / pointsCount);
        points.push({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
    }
    return points;
};

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

const createParametric = (funcX: (t: number) => number, funcY: (t: number) => number, scale: number, center: Point, tMin: number, tMax: number, segments: number = 80): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
        const t = tMin + (tMax - tMin) * (i / segments);
        points.push({ x: center.x + funcX(t) * scale, y: center.y + funcY(t) * scale });
    }
    return points;
};

// --- LEVEL DEFINITIONS ---

const levels: Level[] = [
    // --- BEGINNER (1-10) ---
    { id: 1, name: "The Straight Line", description: "The simplest path.", fact: "A line is the shortest distance between two points.", shape: [{ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }], unlockScore: 92.0 },
    { id: 2, name: "Right Triangle", description: "The 90° master class.", fact: "The side opposite the right angle is the hypotenuse.", shape: [{ x: 0.3, y: 0.25 }, { x: 0.3, y: 0.75 }, { x: 0.7, y: 0.75 }, { x: 0.3, y: 0.25 }], unlockScore: 92.0 },
    { id: 3, name: "Equilateral Triangle", description: "Perfect balance.", fact: "All internal angles are 60°.", shape: createPoly(3, 0.35, { x: 0.5, y: 0.6 }), unlockScore: 92.0 },
    { id: 4, name: "The Square", description: "Four equal sides.", fact: "A square is both a rhombus and a rectangle.", shape: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 }, { x: 0.25, y: 0.25 }], unlockScore: 92.0 },
    { id: 5, name: "The Rectangle", description: "Classic proportions.", fact: "The word comes from Latin 'rectus' (right) and 'angulus' (angle).", shape: [{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.2, y: 0.7 }, { x: 0.2, y: 0.3 }], unlockScore: 92.0 },
    { id: 6, name: "The Parallelogram", description: "Leaning into it.", fact: "Opposite sides are parallel and equal in length.", shape: [{ x: 0.35, y: 0.3 }, { x: 0.85, y: 0.3 }, { x: 0.65, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.35, y: 0.3 }], unlockScore: 92.0 },
    { id: 7, name: "The Trapezoid", description: "A solid base.", fact: "It has at least one pair of parallel sides.", shape: [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.85, y: 0.7 }, { x: 0.15, y: 0.7 }, { x: 0.3, y: 0.3 }], unlockScore: 92.0 },
    { id: 8, name: "The Diamond", description: "Pure symmetry.", fact: "Mathematically a 'Rhombus', with equal sides.", shape: [{ x: 0.5, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.8 }, { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.2 }], unlockScore: 92.0 },
    { id: 9, name: "The Kite", description: "Flying high.", fact: "A kite has two pairs of adjacent equal-length sides.", shape: [{ x: 0.5, y: 0.15 }, { x: 0.8, y: 0.45 }, { x: 0.5, y: 0.85 }, { x: 0.2, y: 0.45 }, { x: 0.5, y: 0.15 }], unlockScore: 92.0 },
    { id: 10, name: "The House", description: "A geometric home.", fact: "Combines a square base with a triangular roof.", shape: [{ x: 0.25, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.75, y: 0.4 }, { x: 0.5, y: 0.15 }, { x: 0.25, y: 0.4 }, { x: 0.25, y: 0.8 }], unlockScore: 92.0 },

    // --- APPRENTICE (11-20) ---
    { id: 11, name: "The Pentagon", description: "Five-sided fortress.", fact: "Internal angles sum to 540°.", shape: createPoly(5), unlockScore: 92.0 },
    { id: 12, name: "The Hexagon", description: "Nature's perfect tile.", fact: "Bees use hexagons to cover area with minimum wax.", shape: createPoly(6), unlockScore: 92.0 },
    { id: 13, name: "The Chevron", description: "Double the point.", fact: "Used in heraldry to indicate sharp turns.", shape: [{ x: 0.2, y: 0.7 }, { x: 0.5, y: 0.3 }, { x: 0.8, y: 0.7 }, { x: 0.5, y: 0.5 }, { x: 0.2, y: 0.7 }], unlockScore: 92.0 },
    { id: 14, name: "The Arrow", description: "Direct focus.", fact: "A combination of a rectangle and a triangle.", shape: [{ x: 0.2, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.6, y: 0.2 }, { x: 0.9, y: 0.5 }, { x: 0.6, y: 0.8 }, { x: 0.6, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }], unlockScore: 92.0 },
    { id: 15, name: "The Heptagon", description: "The lucky seven.", fact: "Cannot be constructed exactly with ruler and compass.", shape: createPoly(7), unlockScore: 92.0 },
    { id: 16, name: "The Octagon", description: "Stop and look.", fact: "Recognizable shape even when obscured.", shape: createPoly(8), unlockScore: 92.0 },
    { id: 17, name: "The Plus Sign", description: "Four-way symmetry.", fact: "Also known as a Greek Cross.", shape: [{ x: 0.4, y: 0.4 }, { x: 0.4, y: 0.2 }, { x: 0.6, y: 0.2 }, { x: 0.6, y: 0.4 }, { x: 0.8, y: 0.4 }, { x: 0.8, y: 0.6 }, { x: 0.6, y: 0.6 }, { x: 0.6, y: 0.8 }, { x: 0.4, y: 0.8 }, { x: 0.4, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }, { x: 0.4, y: 0.4 }], unlockScore: 92.0 },
    { id: 18, name: "The Cross", description: "Traditional geometry.", fact: "A Latin Cross variant common in architecture.", shape: [{ x: 0.4, y: 0.15 }, { x: 0.6, y: 0.15 }, { x: 0.6, y: 0.4 }, { x: 0.85, y: 0.4 }, { x: 0.85, y: 0.6 }, { x: 0.6, y: 0.6 }, { x: 0.6, y: 0.9 }, { x: 0.4, y: 0.9 }, { x: 0.4, y: 0.6 }, { x: 0.15, y: 0.6 }, { x: 0.15, y: 0.4 }, { x: 0.4, y: 0.4 }, { x: 0.4, y: 0.15 }], unlockScore: 92.0 },
    { id: 19, name: "The Shield", description: "Medieval protection.", fact: "Known as the 'Heater Shield' in heraldry.", shape: [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.5 }, { x: 0.5, y: 0.9 }, { x: 0.2, y: 0.5 }, { x: 0.2, y: 0.2 }], unlockScore: 92.0 },
    { id: 20, name: "The Keyhole", description: "Unlocking potential.", fact: "A composite of a circle atop a trapezoid.", shape: [{ x: 0.5, y: 0.15 }, { x: 0.65, y: 0.2 }, { x: 0.7, y: 0.35 }, { x: 0.65, y: 0.5 }, { x: 0.75, y: 0.85 }, { x: 0.25, y: 0.85 }, { x: 0.35, y: 0.5 }, { x: 0.3, y: 0.35 }, { x: 0.35, y: 0.2 }, { x: 0.5, y: 0.15 }], unlockScore: 92.0 },

    // --- WARRIOR (21-30) ---
    { id: 21, name: "5-Pointed Star", description: "The classic pentagram.", fact: "Each point angle is 36°.", shape: createStar(5, 0.35, 0.15), unlockScore: 92.0 },
    { id: 22, name: "6-Pointed Star", description: "The Hexagram.", fact: "Interlocking equilateral triangles.", shape: createStar(6, 0.35, 0.2), unlockScore: 92.0 },
    { id: 23, name: "The Mug", description: "Start your day.", fact: "A topological equivalent of a donut (torus).", shape: [{ x: 0.3, y: 0.35 }, { x: 0.6, y: 0.35 }, { x: 0.6, y: 0.7 }, { x: 0.3, y: 0.7 }, { x: 0.3, y: 0.35 }, { x: 0.6, y: 0.4 }, { x: 0.7, y: 0.45 }, { x: 0.7, y: 0.6 }, { x: 0.6, y: 0.65 }], unlockScore: 92.0 },
    { id: 24, name: "The Bowtie", description: "Inverted triangles.", fact: "A classic test of vertex precision.", shape: [{ x: 0.2, y: 0.25 }, { x: 0.8, y: 0.25 }, { x: 0.2, y: 0.75 }, { x: 0.8, y: 0.75 }, { x: 0.2, y: 0.25 }], unlockScore: 92.0 },
    { id: 25, name: "The Hourglass", description: "Time's container.", fact: "Two triangles joined vertically.", shape: [{ x: 0.25, y: 0.2 }, { x: 0.75, y: 0.2 }, { x: 0.25, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.25, y: 0.2 }], unlockScore: 92.0 },
    { id: 26, name: "The Zig-Zag", description: "Control the chaos.", fact: "Sharp alternating turns test precision.", shape: [{ x: 0.2, y: 0.3 }, { x: 0.35, y: 0.7 }, { x: 0.5, y: 0.3 }, { x: 0.65, y: 0.7 }, { x: 0.8, y: 0.3 }], unlockScore: 92.0 },
    { id: 27, name: "The Lightning Bolt", description: "Static energy.", fact: "Tests momentum through sharp angles.", shape: [{ x: 0.45, y: 0.1 }, { x: 0.3, y: 0.55 }, { x: 0.5, y: 0.55 }, { x: 0.4, y: 0.9 }, { x: 0.7, y: 0.4 }, { x: 0.5, y: 0.4 }, { x: 0.6, y: 0.1 }, { x: 0.45, y: 0.1 }], unlockScore: 92.0 },
    { id: 28, name: "The Pencil", description: "Write your path.", fact: "Graphite was once called 'black lead'.", shape: [{ x: 0.2, y: 0.4 }, { x: 0.7, y: 0.4 }, { x: 0.85, y: 0.5 }, { x: 0.7, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }, { x: 0.7, y: 0.4 }, { x: 0.7, y: 0.6 }], unlockScore: 92.0 },
    { id: 29, name: "The Paperclip", description: "Holding it together.", fact: "Invented by Johan Vaaler in 1899.", shape: [{ x: 0.4, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.7, y: 0.5 }, { x: 0.6, y: 0.7 }, { x: 0.3, y: 0.7 }, { x: 0.2, y: 0.5 }, { x: 0.3, y: 0.3 }, { x: 0.7, y: 0.3 }, { x: 0.8, y: 0.5 }, { x: 0.7, y: 0.8 }, { x: 0.3, y: 0.8 }], unlockScore: 92.0 },
    { id: 30, name: "The Envelope", description: "Send a message.", fact: "Envelopes were traditionally made of paper or parchment.", shape: [{ x: 0.2, y: 0.35 }, { x: 0.8, y: 0.35 }, { x: 0.8, y: 0.75 }, { x: 0.2, y: 0.75 }, { x: 0.2, y: 0.35 }, { x: 0.5, y: 0.55 }, { x: 0.8, y: 0.35 }], unlockScore: 92.0 },

    // --- ARTISAN (31-40) ---
    { id: 31, name: "The Cloud", description: "Floating high.", fact: "Clouds represent the accumulation of droplets.", shape: createParametric((t) => 2 * Math.cos(t) - Math.cos(2 * t), (t) => 2 * Math.sin(t) - Math.sin(2 * t), 0.1, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 32, name: "The Moon", description: "Night's eye.", fact: "A crescent moon is called 'waxing' or 'waning'.", shape: createEllipse(0.35, 0.35).slice(0, 30).concat([{ x: 0.5, y: 0.5 }]), unlockScore: 92.0 },
    { id: 33, name: "The Skull", description: "Memento mori.", fact: "The human skull is made of 22 different bones.", shape: createParametric((t) => 0.4 * Math.cos(t) + 0.05 * Math.cos(3 * t), (t) => 0.5 * Math.sin(t) + 0.05 * Math.sin(2 * t), 0.5, { x: 0.5, y: 0.45 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 34, name: "The Glass", description: "Stay hydrated.", fact: "Glass is an amorphous solid.", shape: [{ x: 0.35, y: 0.2 }, { x: 0.65, y: 0.2 }, { x: 0.6, y: 0.8 }, { x: 0.4, y: 0.8 }, { x: 0.35, y: 0.2 }], unlockScore: 92.0 },
    { id: 35, name: "The Leaf", description: "Nature's solar panel.", fact: "Leaves contain chlorophyll for photosynthesis.", shape: createParametric((t) => Math.sin(t) * Math.cos(t), (t) => Math.sin(t), 0.4, { x: 0.5, y: 0.5 }, 0, Math.PI), unlockScore: 92.0 },
    { id: 36, name: "The Key", description: "Unlock secrets.", fact: "Ancient keys were often made of bronze or iron.", shape: [{ x: 0.25, y: 0.5 }, { x: 0.7, y: 0.5 }, { x: 0.7, y: 0.6 }, { x: 0.75, y: 0.6 }, { x: 0.75, y: 0.5 }, { x: 0.8, y: 0.5 }, { x: 0.8, y: 0.6 }, { x: 0.85, y: 0.6 }, { x: 0.85, y: 0.4 }, { x: 0.25, y: 0.4 }, { x: 0.15, y: 0.45 }, { x: 0.15, y: 0.55 }, { x: 0.25, y: 0.5 }], unlockScore: 92.0 },
    { id: 37, name: "The T-Shirt", description: "Casual style.", fact: "T-shirts were originally undershirts for the US Navy.", shape: [{ x: 0.3, y: 0.2 }, { x: 0.4, y: 0.2 }, { x: 0.4, y: 0.3 }, { x: 0.6, y: 0.3 }, { x: 0.6, y: 0.2 }, { x: 0.7, y: 0.2 }, { x: 0.85, y: 0.4 }, { x: 0.75, y: 0.5 }, { x: 0.7, y: 0.45 }, { x: 0.7, y: 0.85 }, { x: 0.3, y: 0.85 }, { x: 0.3, y: 0.45 }, { x: 0.25, y: 0.5 }, { x: 0.15, y: 0.4 }, { x: 0.3, y: 0.2 }], unlockScore: 92.0 },
    { id: 38, name: "The Water Bottle", description: "Keep flowing.", fact: "PET plastic is the most common material for bottles.", shape: [{ x: 0.4, y: 0.15 }, { x: 0.6, y: 0.15 }, { x: 0.6, y: 0.25 }, { x: 0.65, y: 0.3 }, { x: 0.65, y: 0.85 }, { x: 0.35, y: 0.85 }, { x: 0.35, y: 0.3 }, { x: 0.4, y: 0.25 }, { x: 0.4, y: 0.15 }], unlockScore: 92.0 },
    { id: 39, name: "The Sword", description: "A warrior's tool.", fact: "Steel swords became dominant in the Iron Age.", shape: [{ x: 0.5, y: 0.1 }, { x: 0.55, y: 0.7 }, { x: 0.7, y: 0.7 }, { x: 0.7, y: 0.75 }, { x: 0.55, y: 0.75 }, { x: 0.55, y: 0.9 }, { x: 0.45, y: 0.9 }, { x: 0.45, y: 0.75 }, { x: 0.3, y: 0.75 }, { x: 0.3, y: 0.7 }, { x: 0.45, y: 0.7 }, { x: 0.5, y: 0.1 }], unlockScore: 92.0 },
    { id: 40, name: "The Rocket", description: "To the stars.", fact: "Rockets work on Newton's third law of motion.", shape: [{ x: 0.5, y: 0.1 }, { x: 0.65, y: 0.5 }, { x: 0.7, y: 0.8 }, { x: 0.6, y: 0.8 }, { x: 0.6, y: 0.9 }, { x: 0.4, y: 0.9 }, { x: 0.4, y: 0.8 }, { x: 0.3, y: 0.8 }, { x: 0.35, y: 0.5 }, { x: 0.5, y: 0.1 }], unlockScore: 92.0 },

    // --- VOYAGER (41-50) ---
    {
        id: 41, name: "The Umbrella", description: "Rain protection.", fact: "The word comes from Latin 'umbra', meaning shadow.", shape: (() => {
            const pts: Point[] = [];
            for (let i = 0; i <= 20; i++) {
                const a = Math.PI + (i * Math.PI / 20);
                pts.push({ x: 0.5 + 0.35 * Math.cos(a), y: 0.5 + 0.35 * Math.sin(a) });
            }
            pts.push({ x: 0.85, y: 0.5 }, { x: 0.15, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.85 }, { x: 0.4, y: 0.85 }, { x: 0.4, y: 0.8 });
            return pts;
        })(), unlockScore: 92.0
    },
    { id: 42, name: "The Scissors", description: "Cut through.", fact: "Leonardo da Vinci is often credited with inventing scissors.", shape: [{ x: 0.3, y: 0.3 }, { x: 0.7, y: 0.7 }, { x: 0.8, y: 0.8 }, { x: 0.8, y: 0.6 }, { x: 0.7, y: 0.7 }, { x: 0.3, y: 0.7 }, { x: 0.2, y: 0.8 }, { x: 0.2, y: 0.6 }, { x: 0.3, y: 0.7 }, { x: 0.7, y: 0.3 }], unlockScore: 92.0 },
    { id: 43, name: "The Lamp", description: "Brighten up.", fact: "The first electric lamps were arc lamps.", shape: [{ x: 0.4, y: 0.85 }, { x: 0.6, y: 0.85 }, { x: 0.5, y: 0.85 }, { x: 0.5, y: 0.6 }, { x: 0.3, y: 0.6 }, { x: 0.4, y: 0.3 }, { x: 0.6, y: 0.3 }, { x: 0.7, y: 0.6 }, { x: 0.3, y: 0.6 }], unlockScore: 92.0 },
    { id: 44, name: "The Camera", description: "Capture moments.", fact: "Camera obscura was the precursor to the modern camera.", shape: [{ x: 0.25, y: 0.35 }, { x: 0.75, y: 0.35 }, { x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 }, { x: 0.25, y: 0.35 }, { x: 0.4, y: 0.35 }, { x: 0.4, y: 0.25 }, { x: 0.6, y: 0.25 }, { x: 0.6, y: 0.35 }, { x: 0.5, y: 0.35 }, { x: 0.5, y: 0.55 }, { x: 0.6, y: 0.55 }, { x: 0.5, y: 0.55 }, { x: 0.5, y: 0.45 }], unlockScore: 92.0 },
    {
        id: 45, name: "The Headphones", description: "Audio immersion.", fact: "First headphones were used by telephone operators in the 1880s.", shape: (() => {
            const pts: Point[] = [];
            for (let i = 0; i <= 20; i++) {
                const a = Math.PI + (i * Math.PI / 20);
                pts.push({ x: 0.5 + 0.3 * Math.cos(a), y: 0.5 + 0.3 * Math.sin(a) });
            }
            pts.push({ x: 0.8, y: 0.5 }, { x: 0.8, y: 0.7 }, { x: 0.7, y: 0.7 }, { x: 0.7, y: 0.5 }, { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.7 }, { x: 0.2, y: 0.7 }, { x: 0.2, y: 0.5 });
            return pts;
        })(), unlockScore: 92.0
    },
    { id: 46, name: "The Boat", description: "Sailing away.", fact: "The earliest boats were log boats or rafts.", shape: [{ x: 0.2, y: 0.7 }, { x: 0.8, y: 0.7 }, { x: 0.7, y: 0.9 }, { x: 0.3, y: 0.9 }, { x: 0.2, y: 0.7 }, { x: 0.5, y: 0.7 }, { x: 0.5, y: 0.2 }, { x: 0.7, y: 0.6 }, { x: 0.5, y: 0.6 }], unlockScore: 92.0 },
    { id: 47, name: "The Tree", description: "Rooted down.", fact: "Trees are essential for recycling carbon dioxide.", shape: [{ x: 0.45, y: 0.9 }, { x: 0.55, y: 0.9 }, { x: 0.55, y: 0.7 }, { x: 0.75, y: 0.7 }, { x: 0.5, y: 0.2 }, { x: 0.25, y: 0.7 }, { x: 0.45, y: 0.7 }, { x: 0.45, y: 0.9 }], unlockScore: 92.0 },
    { id: 48, name: "The Mountain", description: "Summit peak.", fact: "Mountains cover about 24% of Earth's land surface.", shape: [{ x: 0.1, y: 0.85 }, { x: 0.4, y: 0.3 }, { x: 0.6, y: 0.55 }, { x: 0.8, y: 0.25 }, { x: 0.95, y: 0.85 }, { x: 0.1, y: 0.85 }], unlockScore: 92.0 },
    { id: 49, name: "The Skyline", description: "Urban jungle.", fact: "The word was first used in 1896 for New York City.", shape: [{ x: 0.1, y: 0.9 }, { x: 0.1, y: 0.6 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }, { x: 0.35, y: 0.4 }, { x: 0.35, y: 0.7 }, { x: 0.5, y: 0.7 }, { x: 0.5, y: 0.2 }, { x: 0.7, y: 0.2 }, { x: 0.7, y: 0.5 }, { x: 0.85, y: 0.5 }, { x: 0.85, y: 0.9 }, { x: 0.1, y: 0.9 }], unlockScore: 92.0 },
    { id: 50, name: "The Anchor", description: "Hold fast.", fact: "Anchors were once just heavy stones.", shape: [{ x: 0.5, y: 0.15 }, { x: 0.5, y: 0.85 }, { x: 0.3, y: 0.75 }, { x: 0.3, y: 0.65 }, { x: 0.3, y: 0.75 }, { x: 0.5, y: 0.85 }, { x: 0.7, y: 0.75 }, { x: 0.7, y: 0.65 }, { x: 0.7, y: 0.75 }, { x: 0.5, y: 0.85 }, { x: 0.5, y: 0.3 }, { x: 0.4, y: 0.3 }, { x: 0.6, y: 0.3 }, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.15 }], unlockScore: 92.0 },

    // --- MASTER (51-60) ---
    {
        id: 51, name: "The Pacman", description: "Waka waka.", fact: "A sector of a circle, usually 300°.", shape: (() => {
            const points: Point[] = [];
            for (let i = 0; i <= 40; i++) {
                const ang = (30 * Math.PI / 180) + (i * 300 * Math.PI / 180 / 40);
                points.push({ x: 0.5 + 0.35 * Math.cos(ang), y: 0.5 + 0.35 * Math.sin(ang) });
            }
            points.push({ x: 0.5, y: 0.5 }, { x: 0.5 + 0.35 * Math.cos(30 * Math.PI / 180), y: 0.5 + 0.35 * Math.sin(30 * Math.PI / 180) });
            return points;
        })(), unlockScore: 92.0
    },
    {
        id: 52, name: "The Fan", description: "Keep it cool.", fact: "Symbol of status and tools for relief from heat.", shape: (() => {
            const points: Point[] = [];
            const r = 0.4, cx = 0.5, cy = 0.8;
            for (let i = 0; i <= 40; i++) {
                const ang = (-30 * Math.PI / 180) - (i * 120 * Math.PI / 180 / 40);
                points.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
            }
            points.push({ x: cx, y: cy }, { x: cx + r * Math.cos(-30 * Math.PI / 180), y: cy + r * Math.sin(-30 * Math.PI / 180) });
            return points;
        })(), unlockScore: 92.0
    },
    {
        id: 53, name: "The Semicircle", description: "Half the journey.", fact: "The perimeter includes arc and diameter.", shape: (() => {
            const points: Point[] = [];
            for (let i = 0; i <= 30; i++) {
                const ang = Math.PI + (i * Math.PI / 30);
                points.push({ x: 0.5 + 0.35 * Math.cos(ang), y: 0.5 + 0.35 * Math.sin(ang) });
            }
            points.push({ x: 0.85, y: 0.5 }, { x: 0.15, y: 0.5 });
            return points;
        })(), unlockScore: 92.0
    },
    { id: 54, name: "The Circle", description: "Infinite symmetry.", fact: "Equidistant points from the center.", shape: createPoly(60), unlockScore: 92.0 },
    { id: 55, name: "The Ellipse", description: "The planetary orbit.", fact: "Constants sum of distances to two focal points.", shape: createEllipse(0.35, 0.2), unlockScore: 92.0 },
    {
        id: 56, name: "The Capsule", description: "Stadium geometry.", fact: "Rectangle with two semicircular ends.", shape: (() => {
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
        })(), unlockScore: 92.0
    },
    {
        id: 57, name: "The Eye", description: "Vision and focus.", fact: "Intersection of two circular arcs.", shape: (() => {
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
        })(), unlockScore: 92.0
    },
    {
        id: 58, name: "The Wave", description: "Sinusoidal flow.", fact: "Represents sound, light, and energy oscillations.", shape: (() => {
            const points: Point[] = [];
            for (let i = 0; i <= 100; i++) {
                const x = 0.15 + 0.7 * (i / 100);
                const y = 0.5 + 0.2 * Math.sin(i * 2 * Math.PI / 50);
                points.push({ x, y });
            }
            return points;
        })(), unlockScore: 92.0
    },
    { id: 59, name: "The Crescent", description: "Waxing and waning.", fact: "From Latin 'crescere', meaning to increase.", shape: createEllipse(0.35, 0.35).slice(0, 30).concat([{ x: 0.5, y: 0.5 }]), unlockScore: 92.0 },
    { id: 60, name: "The Teardrop", description: "Fluid dynamics.", fact: "Aerodynamic shape minimizing drag.", shape: createParametric((t) => Math.sin(t) * Math.pow(Math.sin(t / 2), 0.5), (t) => -Math.cos(t), 0.35, { x: 0.5, y: 0.6 }, 0, 2 * Math.PI), unlockScore: 92.0 },

    // --- ZEN (61-70) ---
    { id: 61, name: "The Heart", description: "Pulse of the Dojo.", fact: "A cardioid-like parametric curve.", shape: createParametric((t) => 16 * Math.pow(Math.sin(t), 3), (t) => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)), 0.02, { x: 0.5, y: 0.45 }, 0, 2 * Math.PI, 120), unlockScore: 92.0 },
    { id: 62, name: "The Infinity", description: "Limitless loop.", fact: "The Lemniscate of Bernoulli.", shape: createParametric((t) => (Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2)), (t) => (Math.cos(t) * Math.sin(t)) / (1 + Math.pow(Math.sin(t), 2)), 0.35, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI, 100), unlockScore: 92.0 },
    { id: 63, name: "The Guitar Pick", description: "Reuleaux Triangle.", fact: "Can rotate inside a square touching all sides.", shape: createParametric((t) => Math.cos(t) + 0.2 * Math.cos(2 * t), (t) => Math.sin(t) - 0.2 * Math.sin(2 * t), 0.25, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 64, name: "The Deltoid", description: "Three-pointed hypocycloid.", fact: "Curve of constant width with three cusps.", shape: createParametric((t) => 2 * Math.cos(t) + Math.cos(2 * t), (t) => 2 * Math.sin(t) - Math.sin(2 * t), 0.12, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 65, name: "The Astroid", description: "Four-pointed star curve.", fact: "Traced by circle of radius R/4 rolling inside R.", shape: createParametric((t) => Math.pow(Math.cos(t), 3), (t) => Math.pow(Math.sin(t), 3), 0.3, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 66, name: "The Nephroid", description: "Kidney-shaped curve.", fact: "An epicycloid with two cusps.", shape: createParametric((t) => 3 * Math.cos(t) - Math.cos(3 * t), (t) => 3 * Math.sin(t) - Math.sin(3 * t), 0.09, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 67, name: "The Clover", description: "Three-leaf luck.", fact: "A rhodonea curve with 3 petals.", shape: createParametric((t) => Math.cos(3 * t) * Math.cos(t), (t) => Math.cos(3 * t) * Math.sin(t), 0.35, { x: 0.5, y: 0.5 }, 0, Math.PI), unlockScore: 92.0 },
    { id: 68, name: "The Lotus", description: "A geometric bloom.", fact: "Symbol of purity used in Mandala patterns.", shape: createParametric((t) => (1 + 0.25 * Math.sin(6 * t)) * Math.cos(t), (t) => (1 + 0.25 * Math.sin(6 * t)) * Math.sin(t), 0.28, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 69, name: "The Spade", description: "The sharpest suit.", fact: "Symbolizes the pike or halberd.", shape: createParametric((t) => 16 * Math.pow(Math.sin(t), 3), (t) => -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)), 0.015, { x: 0.5, y: 0.45 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 70, name: "8-Pointed Star", description: "Celestial radiance.", fact: "Common motif in Islamic and Hindu art.", shape: createStar(8, 0.35, 0.18), unlockScore: 92.0 },

    // --- LEGEND (71-80) ---
    { id: 71, name: "The Fish", description: "Swimming upstream.", fact: "A simple mathematical representation of a fish.", shape: createParametric((t) => Math.cos(t) - Math.pow(Math.sin(t), 2) / Math.sqrt(2), (t) => Math.cos(t) * Math.sin(t), 0.25, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI), unlockScore: 92.0 },
    { id: 72, name: "The Spiral", description: "Archimedean wonder.", fact: "Moves away from center as it rotates.", shape: createParametric((t) => t * Math.cos(2 * t), (t) => t * Math.sin(2 * t), 0.05, { x: 0.5, y: 0.5 }, 0, 3 * Math.PI), unlockScore: 92.0 },
    { id: 73, name: "The Mystic", description: "Hypocycloid madness.", fact: "Small circle rolling inside a larger one.", shape: createParametric((t) => 0.7 * Math.cos(t) + 0.3 * Math.cos(3.5 * t), (t) => 0.7 * Math.sin(t) - 0.3 * Math.sin(3.5 * t), 0.25, { x: 0.5, y: 0.5 }, 0, 4 * Math.PI), unlockScore: 92.0 },
    { id: 74, name: "The Grandmaster", description: "The ultimate challenge.", fact: "Complex epitrochoid curve with high frequency.", shape: createParametric((t) => Math.cos(t) + 0.5 * Math.cos(7 * t) + 0.33 * Math.sin(17 * t), (t) => Math.sin(t) + 0.5 * Math.sin(7 * t) + 0.33 * Math.cos(17 * t), 0.15, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI, 300), unlockScore: 92.0 },
    { id: 75, name: "The Butterfly", description: "Flutters of precision.", fact: "The butterfly curve is a transcendental plane curve.", shape: createParametric((t) => Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5)), (t) => Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5)), 0.1, { x: 0.5, y: 0.5 }, 0, 4 * Math.PI, 200), unlockScore: 92.0 },
    { id: 76, name: "The Bicycle", description: "Pedal to perfection.", fact: "Bicycles are the most efficient human-powered vehicles.", shape: [{ x: 0.3, y: 0.7 }, { x: 0.4, y: 0.7 }, { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.5 }, { x: 0.8, y: 0.7 }, { x: 0.7, y: 0.7 }, { x: 0.6, y: 0.5 }, { x: 0.6, y: 0.4 }, { x: 0.7, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.6, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.4, y: 0.5 }, { x: 0.3, y: 0.7 }], unlockScore: 92.0 },
    { id: 77, name: "The Phoenix", description: "Rising from ashes.", fact: "Phoenix is a mythical bird that regenerates from its own ashes.", shape: createParametric((t) => (Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5))) * 1.2, (t) => (Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5))) * 1.2, 0.1, { x: 0.5, y: 0.45 }, 0, 4 * Math.PI, 300), unlockScore: 92.0 },
    { id: 78, name: "The Hand", description: "Manual mastery.", fact: "There are 27 bones in the human hand.", shape: [{ x: 0.5, y: 0.9 }, { x: 0.3, y: 0.85 }, { x: 0.2, y: 0.7 }, { x: 0.2, y: 0.4 }, { x: 0.25, y: 0.3 }, { x: 0.3, y: 0.4 }, { x: 0.35, y: 0.2 }, { x: 0.4, y: 0.4 }, { x: 0.45, y: 0.15 }, { x: 0.5, y: 0.4 }, { x: 0.55, y: 0.2 }, { x: 0.6, y: 0.4 }, { x: 0.7, y: 0.6 }, { x: 0.7, y: 0.85 }, { x: 0.5, y: 0.9 }], unlockScore: 92.0 },
    { id: 79, name: "The Eiffel Tower", description: "Parisian landmark.", fact: "The tower was originally intended to be temporary.", shape: [{ x: 0.5, y: 0.1 }, { x: 0.55, y: 0.4 }, { x: 0.45, y: 0.4 }, { x: 0.5, y: 0.1 }, { x: 0.65, y: 0.7 }, { x: 0.35, y: 0.7 }, { x: 0.5, y: 0.1 }, { x: 0.8, y: 0.9 }, { x: 0.7, y: 0.9 }, { x: 0.5, y: 0.7 }, { x: 0.3, y: 0.9 }, { x: 0.2, y: 0.9 }, { x: 0.5, y: 0.1 }], unlockScore: 92.0 },
    { id: 80, name: "The Zen Master", description: "Ultimate harmony.", fact: "A complex epitrochoid representing the flow of life.", shape: createParametric((t) => Math.cos(t) + 0.5 * Math.cos(13 * t) + 0.33 * Math.sin(23 * t), (t) => Math.sin(t) + 0.5 * Math.sin(13 * t) + 0.33 * Math.cos(23 * t), 0.12, { x: 0.5, y: 0.5 }, 0, 2 * Math.PI, 400), unlockScore: 92.0 }
];

export default levels;
