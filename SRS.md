# SRS - Geometry Dojo

## 1. Introduction
Geometry Dojo is a web-based geometric tracing game designed to test and improve user precision and focus. Players trace various geometric shapes and parametric curves, aiming for 100% accuracy.

## 2. Overall Description
The application provides a series of 80 levels, categorized by difficulty. It features a responsive design, multiple themes, and a global leaderboard.

## 3. System Features

### 3.1 Gameplay Mechanics
- **Geometric Tracing**: Users draw over a target shape on a canvas.
- **Scoring**: Accuracy is calculated based on how closely the user's path follows the target shape.
- **Level Progression**: Levels are unlocked sequentially based on achieving a minimum score (92%).
- **Time-based Greetings**: Dynamic greetings based on the time of day (Morning/Afternoon/Evening).
- **Motivational Quotes**: Auto-cycling quotes to encourage the player.

### 3.2 Level Categories
- **Beginner (1-10)**: Simple lines and basic polygons.
- **Apprentice (11-20)**: Ellipses, sectors, and basic composites.
- **Warrior (21-30)**: Sharp turns, cross shapes, and simple stars.
- **Artisan (31-40)**: Object-inspired shapes (Mug, Pencil, etc.).
- **Voyager (41-50)**: Parametric curves and more complex objects.
- **Master (51-60)**: Intricate object outlines.
- **Zen (61-70)**: Complex mathematical curves (Infinity, Clover, etc.).
- **Legend (71-80)**: High-frequency epitrochoids and advanced parametric shapes.

### 3.3 Player Management
- **Multiple Profiles**: Users can create and switch between multiple local profiles.
- **Local Storage**: Progress and scores are saved locally using `localStorage`.

### 3.4 Leaderboard
- **Local Leaderboard**: Tracks scores for all profiles on the device.
- **Global Leaderboard**: Periodically syncs high scores to a Firebase-backed global database.

### 3.5 Customization
- **Difficulty Levels**: Easy, Medium, and Hard (affecting scoring strictness/feedback).
- **Themes**: Classic and Space (affecting background and level grid appearance).

## 4. Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS.
- **Icons**: Lucide-React.
- **Physics/Math**: Custom geometry utility functions for distance and accuracy calculation.
- **Backend/Database**: Firebase (for global leaderboard).
- **Hosting**: Netlify.

## 5. Design Constraints
### 5.1 Single-Stroke Continuity
All shapes in the game must satisfy the Eulerian path principle: they must be drawable in a single continuous stroke without the user needing to pick up their pen or mouse. This ensures a consistent gameplay experience and prevents "impossible" jumps in complex objects.

### 5.2 Mobile Optimization
Complex parametric shapes (Zen Master, Phoenix, etc.) must be scaled appropriately (typically 0.15 - 0.35 relative to center) to ensure they are legible and drawable on mobile viewports without excessive line congestion.

## 6. Versioning
The application uses semantic versioning to track updates and trigger cache refreshes for the Progressive Web App (PWA).

- **Current Version**: 3.2.0
- **Version Check**: Performed every 30 minutes to ensure players are on the latest build.
