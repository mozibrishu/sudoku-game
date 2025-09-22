# Sudoku Master - Enhanced Edition

This is a visually enriched, level-based Sudoku game built with React, P5.js, and Tailwind CSS. It features a comprehensive scoring system, anti-cheat protection, and a beautiful, responsive design.

## ✨ Features

- **Four Difficulty Levels**: Easy, Medium, Hard, and Expert with progressive unlocking.
- **P5.js Visual Effects**: Dynamic animated background with floating particles and colorful effects.
- **Enhanced UI Components**: Colorful number pad, animated buttons, and a wood-grain design.
- **Comprehensive Scoring System**: Time-based scoring, achievements, and persistent statistics.
- **Anti-Cheat Protection**: Real-time behavioral analysis to ensure fair gameplay.
- **Interactive Gameplay**: Notes system, hint system, and pause/resume functionality.
- **Responsive Design**: Works perfectly on all devices, from mobile to desktop.
- **Keyboard and Mouse Controls**: Full support for both input methods.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sudoku-master.git
   ```
2. Navigate to the project directory:
   ```bash
   cd sudoku-master
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Development Server

To run the game in development mode, use the following command:

```bash
pnpm run dev
```

This will start a local development server at `http://localhost:5173`.

### Building for Production

To create a production build of the game, use the following command:

```bash
pnpm run build
```

The production-ready files will be located in the `dist` directory.

## 🔧 Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **P5.js**: A JavaScript library for creative coding, used for visual effects.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Vite**: A fast build tool and development server for modern web projects.
- **Framer Motion**: A library for creating animations in React.
- **Lucide React**: A library of beautiful and consistent icons.
- **clsx & tailwind-merge**: Utilities for constructing dynamic class names.

## 📁 Project Structure

```
/sudoku-master
├── /dist                # Production build files
├── /public              # Static assets
├── /src
│   ├── /components      # Reusable UI components
│   ├── /hooks           # Custom React hooks
│   ├── /lib             # Core game logic and utilities
│   ├── App.css          # Main stylesheet
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point of the application
├── .eslintrc.cjs        # ESLint configuration
├── index.html           # Main HTML file
├── package.json         # Project dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── README.md            # This file
└── vite.config.js       # Vite configuration
```

## 🎮 Gameplay

- **Select a Level**: Choose from four difficulty levels to start a new game.
- **Fill the Board**: Use the number pad or your keyboard to fill in the empty cells.
- **Use Notes**: Toggle the "Notes" mode to add or remove pencil marks in cells.
- **Get Hints**: Use the "Hint" button to reveal a correct number in a selected cell.
- **Track Your Progress**: The game tracks your time, score, and mistakes in real-time.
- **Complete the Puzzle**: Fill the entire board correctly to complete the game and see your final score.

## 🛡️ Anti-Cheat System

The game includes a comprehensive anti-cheat system that monitors player behavior to ensure fair gameplay. It tracks:

- **Timing Patterns**: Detects impossibly fast actions and robotic timing.
- **Input Sequences**: Analyzes mouse movements and keyboard inputs for signs of automation.
- **Move Quality**: Monitors accuracy and looks for suspiciously perfect gameplay.
- **Focus Changes**: Detects when the player switches tabs or leaves the game window.

If suspicious behavior is detected, the system may invalidate the player's score to maintain the integrity of the leaderboards.

## 🎨 Visual Design

The game features a visually rich design inspired by classic wooden board games, enhanced with modern animations and effects powered by P5.js and Framer Motion.

- **Dynamic Background**: A subtle, animated background with floating particles creates an engaging atmosphere.
- **Colorful UI**: The number pad and other UI elements use a vibrant color palette to make the game more visually appealing.
- **Smooth Animations**: All interactions are accompanied by smooth, satisfying animations.

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


