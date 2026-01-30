import { Point } from './geometry';

export interface Level {
    id: number;
    name: string;
    description: string;
    shape: Point[];
    unlockScore: number;
}

const createPoly = (sides: number, radius: number = 0.35, center: Point = { x: 0.5, y: 0.5 }, startAngle: number = -Math.PI / 2): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= sides; i++) { // <= to close the loop
        const angle = startAngle + (i * 2 * Math.PI / sides);
        points.push({
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
        });
    }
    return points;
};

const levels: Level[] = [
    {
        id: 1,
        name: "The Straight Line",
        description: "The foundation of all geometry.",
        shape: [{ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }],
        unlockScore: 92.0
    },
    {
        id: 2,
        name: "The Square",
        description: "Four 90° corners. Even sides.",
        shape: [
            { x: 0.25, y: 0.25 },
            { x: 0.75, y: 0.25 },
            { x: 0.75, y: 0.75 },
            { x: 0.25, y: 0.75 },
            { x: 0.25, y: 0.25 }
        ],
        unlockScore: 92.0
    },
    {
        id: 3,
        name: "The Rectangle",
        description: "Testing proportions.",
        shape: [
            { x: 0.2, y: 0.3 },
            { x: 0.8, y: 0.3 },
            { x: 0.8, y: 0.7 },
            { x: 0.2, y: 0.7 },
            { x: 0.2, y: 0.3 }
        ],
        unlockScore: 92.0
    },
    {
        id: 4,
        name: "Equilateral Triangle",
        description: "Three sharp 60° angles.",
        shape: createPoly(3, 0.35, { x: 0.5, y: 0.6 }, -Math.PI / 2), // Adjust center to look good
        unlockScore: 92.0
    },
    {
        id: 5,
        name: "The Hexagon",
        description: "Six sides, very symmetrical.",
        shape: createPoly(6),
        unlockScore: 92.0
    },
    {
        id: 6,
        name: "The Pentagon",
        description: "The first odd challenge.",
        shape: createPoly(5),
        unlockScore: 92.0
    },
    {
        id: 7,
        name: "The Octagon",
        description: "Common, but hard to keep even.",
        shape: createPoly(8),
        unlockScore: 92.0
    },
    {
        id: 8,
        name: "The Septagon",
        description: "Seven sides. Pure chaos.",
        shape: createPoly(7),
        unlockScore: 92.0
    },
    {
        id: 9,
        name: "The Circle",
        description: "The ultimate test of steady motion.",
        shape: createPoly(60), // High res polygon = circle
        unlockScore: 92.0
    },
    {
        id: 10,
        name: "The 5-Pointed Star",
        description: "The Grandmaster shape.",
        shape: (() => {
            const points: Point[] = [];
            const outerRadius = 0.35;
            const innerRadius = 0.15;
            const center = { x: 0.5, y: 0.5 };
            const sides = 5;
            for (let i = 0; i <= sides * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = -Math.PI / 2 + (i * Math.PI / sides);
                points.push({
                    x: center.x + radius * Math.cos(angle),
                    y: center.y + radius * Math.sin(angle)
                });
            }
            return points;
        })(),
        unlockScore: 99.5
    }
    {
        id: 11,
        name: "The Diamond",
        description: "A square, tilted. Balance is key.",
        shape: [
            { x: 0.5, y: 0.2 },
            { x: 0.8, y: 0.5 },
            { x: 0.5, y: 0.8 },
            { x: 0.2, y: 0.5 },
            { x: 0.5, y: 0.2 }
        ],
        unlockScore: 92.0
    },
    {
        id: 12,
        name: "Right Triangle",
        description: "The 90° master class.",
        shape: [
            { x: 0.3, y: 0.25 },
            { x: 0.3, y: 0.75 },
            { x: 0.7, y: 0.75 },
            { x: 0.3, y: 0.25 }
        ],
        unlockScore: 92.0
    },
    {
        id: 13,
        name: "The Parallelogram",
        description: "Lean into the future.",
        shape: [
            { x: 0.35, y: 0.3 },
            { x: 0.85, y: 0.3 },
            { x: 0.65, y: 0.7 },
            { x: 0.15, y: 0.7 },
            { x: 0.35, y: 0.3 }
        ],
        unlockScore: 92.0
    },
    {
        id: 14,
        name: "The Trapezoid",
        description: "A stable foundation.",
        shape: [
            { x: 0.3, y: 0.3 },
            { x: 0.7, y: 0.3 },
            { x: 0.85, y: 0.7 },
            { x: 0.15, y: 0.7 },
            { x: 0.3, y: 0.3 }
        ],
        unlockScore: 92.0
    },
    {
        id: 15,
        name: "The Chevron",
        description: "Point the way forward.",
        shape: [
            { x: 0.2, y: 0.7 },
            { x: 0.5, y: 0.3 },
            { x: 0.8, y: 0.7 },
            { x: 0.5, y: 0.5 },
            { x: 0.2, y: 0.7 }
        ],
        unlockScore: 92.0
    },
    {
        id: 16,
        name: "The Lightning Bolt",
        description: "Strike fast, strike true.",
        shape: [
            { x: 0.45, y: 0.1 },
            { x: 0.3, y: 0.55 },
            { x: 0.5, y: 0.55 },
            { x: 0.4, y: 0.9 },
            { x: 0.7, y: 0.4 },
            { x: 0.5, y: 0.4 },
            { x: 0.6, y: 0.1 },
            { x: 0.45, y: 0.1 }
        ],
        unlockScore: 92.0
    },
    {
        id: 17,
        name: "The Arrow",
        description: "Aim for perfection.",
        shape: [
            { x: 0.2, y: 0.4 },
            { x: 0.6, y: 0.4 },
            { x: 0.6, y: 0.2 },
            { x: 0.9, y: 0.5 },
            { x: 0.6, y: 0.8 },
            { x: 0.6, y: 0.6 },
            { x: 0.2, y: 0.6 },
            { x: 0.2, y: 0.4 }
        ],
        unlockScore: 92.0
    },
    {
        id: 18,
        name: "The Bowtie",
        description: "Infinite loop in disguise.",
        shape: [
            { x: 0.2, y: 0.25 },
            { x: 0.8, y: 0.25 },
            { x: 0.2, y: 0.75 },
            { x: 0.8, y: 0.75 },
            { x: 0.2, y: 0.25 }
        ],
        unlockScore: 92.0
    },
    {
        id: 19,
        name: "The Cross",
        description: "Twelve corners of precision.",
        shape: [
            { x: 0.4, y: 0.2 },
            { x: 0.6, y: 0.2 },
            { x: 0.6, y: 0.4 },
            { x: 0.8, y: 0.4 },
            { x: 0.8, y: 0.6 },
            { x: 0.6, y: 0.6 },
            { x: 0.6, y: 0.8 },
            { x: 0.4, y: 0.8 },
            { x: 0.4, y: 0.6 },
            { x: 0.2, y: 0.6 },
            { x: 0.2, y: 0.4 },
            { x: 0.4, y: 0.4 },
            { x: 0.4, y: 0.2 }
        ],
        unlockScore: 92.0
    },
    {
        id: 20,
        name: "The Heart",
        description: "With love, from Geometry.",
        shape: [
            { x: 0.5, y: 0.3 },
            { x: 0.35, y: 0.15 },
            { x: 0.15, y: 0.2 },
            { x: 0.1, y: 0.45 },
            { x: 0.5, y: 0.85 },
            { x: 0.9, y: 0.45 },
            { x: 0.85, y: 0.2 },
            { x: 0.65, y: 0.15 },
            { x: 0.5, y: 0.3 }
        ],
        unlockScore: 92.0
    }
];

export default levels;
