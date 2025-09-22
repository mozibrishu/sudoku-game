import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState.js';
import { useKeyboardControls } from './hooks/useKeyboardControls.js';
import LevelSelection from './components/LevelSelection.jsx';
import GameHeader from './components/GameHeader.jsx';
import SudokuBoard from './components/SudokuBoard.jsx';
import NumberPad from './components/NumberPad.jsx';
import GameComplete from './components/GameComplete.jsx';
import PauseScreen from './components/PauseScreen.jsx';
import P5Background from './components/P5Background.jsx';
import { ScoringSystem } from './lib/scoring.js';
import './App.css';

function App() {
  const {
    gameState,
    currentLevel,
    levels,
    board,
    selectedCell,
    selectedNumber,
    notes,
    isNoteMode,
    highlightedNumber,
    errors,
    score,
    time,
    hintsUsed,
    mistakes,
    hintsRemaining,
    statistics,
    startGame,
    handleCellClick,
    handleNumberClick,
    getHint,
    resetGame,
    togglePause,
    goToMenu,
    setIsNoteMode,
    setSelectedCell,
    getRemainingNumbers
  } = useGameState();

  // Track last move for P5.js effects
  const [lastMove, setLastMove] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Enhanced keyboard controls
  useKeyboardControls({
    gameState,
    selectedCell,
    setSelectedCell,
    handleNumberClick: (num) => {
      const result = handleNumberClick(num);
      if (result && selectedCell) {
        setLastMove({
          row: selectedCell.row,
          col: selectedCell.col,
          number: num,
          timestamp: Date.now()
        });
      }
      return result;
    },
    setIsNoteMode,
    isNoteMode,
    getHint,
    resetGame,
    togglePause,
    board
  });

  // Enhanced number click handler with P5.js effects
  const enhancedHandleNumberClick = (num) => {
    const result = handleNumberClick(num);
    if (result && selectedCell) {
      setLastMove({
        row: selectedCell.row,
        col: selectedCell.col,
        number: num,
        timestamp: Date.now()
      });
    }
    return result;
  };

  // Enhanced hint handler with P5.js effects
  const enhancedGetHint = () => {
    const result = getHint();
    // The hint effect will be triggered by the game state change
    return result;
  };

  // Check for game completion
  useEffect(() => {
    if (gameState === 'completed' && !isGameComplete) {
      setIsGameComplete(true);
      setTimeout(() => setIsGameComplete(false), 3000); // Reset after effects
    }
  }, [gameState, isGameComplete]);

  const scoringSystem = new ScoringSystem();

  const handleInfo = () => {
    alert(`🎮 Sudoku Master - Enhanced Edition

🎯 Game Rules:
• Fill the 9×9 grid with digits 1-9
• Each row must contain all digits 1-9
• Each column must contain all digits 1-9
• Each 3×3 box must contain all digits 1-9

⌨️ Keyboard Controls:
• Arrow keys: Navigate cells
• 1-9: Enter numbers
• 0/Backspace/Delete: Clear cell
• N: Toggle notes mode
• H: Get hint
• P/Space: Pause game
• Tab: Jump to next empty cell
• Ctrl+R: Reset game

🖱️ Mouse Controls:
• Click cell to select
• Click number pad to enter
• Use toolbar buttons for actions

✨ Visual Features:
• Colorful particle effects
• Dynamic backgrounds
• Celebration animations
• Error feedback effects
• Hint sparkle effects

🛡️ Anti-Cheat Protection:
• Movement pattern analysis
• Timing validation
• Input sequence monitoring
• Fair play enforcement`);
  };

  const getAchievement = () => {
    if (gameState === 'completed') {
      return scoringSystem.getAchievement(
        currentLevel.name,
        time,
        hintsUsed,
        mistakes
      );
    }
    return null;
  };

  const handleEffectComplete = (effectType) => {
    if (effectType === 'completion') {
      // Additional completion handling if needed
      console.log('Completion effects finished');
    }
  };

  return (
    <div className="app min-h-screen relative overflow-hidden">
      {/* P5.js Animated Background */}
      <P5Background 
        gameState={gameState} 
        isActive={true}
      />
      
      {/* Enhanced gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/80 pointer-events-none z-0" />
      
      <div className="relative z-10">
        {gameState === 'menu' && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                🎮 Sudoku Master
              </h1>
              <p className="text-xl text-amber-700 font-medium">
                Enhanced with Colorful Effects & Anti-Cheat Protection
              </p>
            </div>
            
            <LevelSelection
              levels={levels}
              onLevelSelect={startGame}
              statistics={statistics.levels}
            />
          </div>
        )}

        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="container mx-auto px-4 py-4 max-w-2xl">
            <GameHeader
              score={score}
              time={time}
              level={currentLevel?.name}
              isPaused={gameState === 'paused'}
              isNoteMode={isNoteMode}
              hintsRemaining={hintsRemaining}
              onBack={goToMenu}
              onReset={resetGame}
              onHint={enhancedGetHint}
              onToggleNotes={() => setIsNoteMode(!isNoteMode)}
              onPause={togglePause}
              onInfo={handleInfo}
            />

            <div className="mb-6">
              <SudokuBoard
                board={board}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
                notes={notes}
                isNoteMode={isNoteMode}
                highlightedNumber={highlightedNumber}
                errors={errors}
                lastMove={lastMove}
                isComplete={isGameComplete}
                onEffectComplete={handleEffectComplete}
              />
            </div>

            <NumberPad
              onNumberClick={enhancedHandleNumberClick}
              selectedNumber={selectedNumber}
              remainingNumbers={getRemainingNumbers()}
            />

            {/* Enhanced keyboard shortcuts hint */}
            <div className="mt-4 text-center">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-3 border border-amber-200 shadow-md">
                <p className="text-sm text-amber-700 font-medium">
                  ✨ Enhanced with colorful effects! Use keyboard: Arrow keys to navigate, 1-9 to enter numbers, N for notes, H for hints
                </p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <PauseScreen
            onResume={togglePause}
            onRestart={resetGame}
            onGoHome={goToMenu}
          />
        )}

        {gameState === 'completed' && (
          <GameComplete
            score={score}
            time={time}
            level={currentLevel?.name}
            hintsUsed={hintsUsed}
            mistakes={mistakes}
            achievement={getAchievement()}
            onPlayAgain={() => startGame(currentLevel)}
            onGoHome={goToMenu}
          />
        )}
      </div>
    </div>
  );
}

export default App;
