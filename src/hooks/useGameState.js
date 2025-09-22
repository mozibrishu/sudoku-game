import { useState, useEffect, useCallback, useRef } from 'react';
import { SudokuGame } from '../lib/sudokuLogic.js';
import { ScoringSystem, GameStatistics } from '../lib/scoring.js';
import { antiCheat } from '../lib/antiCheat.js';

export const useGameState = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'completed'
  const [currentLevel, setCurrentLevel] = useState(null);
  const [sudokuGame] = useState(() => new SudokuGame());
  const [scoringSystem] = useState(() => new ScoringSystem());
  const [statistics] = useState(() => new GameStatistics());
  
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [notes, setNotes] = useState(Array(9).fill().map(() => Array(9).fill().map(() => [])));
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [highlightedNumber, setHighlightedNumber] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Available levels
  const levels = [
    { 
      name: 'Easy', 
      description: 'Perfect for beginners',
      locked: false
    },
    { 
      name: 'Medium', 
      description: 'A moderate challenge',
      locked: false
    },
    { 
      name: 'Hard', 
      description: 'For experienced players',
      locked: false
    },
    { 
      name: 'Expert', 
      description: 'Ultimate challenge',
      locked: false
    }
  ];

  // Update level lock status based on statistics
  useEffect(() => {
    const unlockStatus = statistics.getLevelUnlockStatus();
    levels.forEach(level => {
      level.locked = !unlockStatus[level.name];
    });
  }, [statistics]);

  // Timer management
  useEffect(() => {
    if (gameState === 'playing') {
      startTimeRef.current = Date.now() - (time * 1000);
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTime(elapsed);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, time]);

  // Start a new game
  const startGame = useCallback((level) => {
    // Reset anti-cheat system for new game
    antiCheat.reset();
    
    const puzzle = sudokuGame.generatePuzzle(level.name);
    setCurrentLevel(level);
    setBoard(puzzle.puzzle);
    setGameState('playing');
    setSelectedCell(null);
    setSelectedNumber(null);
    setNotes(Array(9).fill().map(() => Array(9).fill().map(() => [])));
    setIsNoteMode(false);
    setHighlightedNumber(null);
    setErrors({});
    setScore(0);
    setTime(0);
    setHintsUsed(0);
    setMistakes(0);
    setHintsRemaining(3);

    // Track game start with anti-cheat
    antiCheat.trackAction({
      type: 'game_start',
      level: level.name,
      difficulty: level.name
    });
  }, [sudokuGame]);

  // Make a move on the board
  const makeMove = useCallback((row, col, num) => {
    if (gameState !== 'playing') return false;
    
    const currentBoard = sudokuGame.getBoard();
    if (sudokuGame.initialBoard[row][col] !== 0) {
      return false; // Can't modify initial numbers
    }

    if (isNoteMode) {
      // Handle note mode
      setNotes(prevNotes => {
        const newNotes = prevNotes.map(row => row.map(cell => [...cell]));
        const cellNotes = newNotes[row][col];
        const noteIndex = cellNotes.indexOf(num);
        
        if (noteIndex > -1) {
          cellNotes.splice(noteIndex, 1);
        } else {
          cellNotes.push(num);
          cellNotes.sort();
        }
        
        return newNotes;
      });
      
      // Track note action with anti-cheat
      antiCheat.trackAction({
        type: 'note_toggle',
        row,
        col,
        number: num,
        isNoteMode: true
      });
      
      return true;
    }

    // Regular move
    const isValid = sudokuGame.isValidMove(currentBoard, row, col, num);
    
    // Track move attempt with anti-cheat
    antiCheat.trackAction({
      type: 'number_place',
      row,
      col,
      number: num,
      correct: isValid,
      isNoteMode: false,
      timeSinceGameStart: time * 1000
    });
    
    if (!isValid) {
      // Mark as error
      setErrors(prev => ({
        ...prev,
        [row]: { ...prev[row], [col]: true }
      }));
      setMistakes(prev => prev + 1);
      
      // Track mistake with anti-cheat
      antiCheat.trackAction({
        type: 'mistake',
        row,
        col,
        attemptedNumber: num
      });
      
      // Clear error after 2 seconds
      setTimeout(() => {
        setErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors[row]) {
            delete newErrors[row][col];
            if (Object.keys(newErrors[row]).length === 0) {
              delete newErrors[row];
            }
          }
          return newErrors;
        });
      }, 2000);
      
      return false;
    }

    // Make the move
    sudokuGame.makeMove(row, col, num);
    setBoard(sudokuGame.getBoard());
    
    // Clear notes for this cell
    setNotes(prevNotes => {
      const newNotes = prevNotes.map(row => row.map(cell => [...cell]));
      newNotes[row][col] = [];
      return newNotes;
    });

    // Check if game is completed
    if (sudokuGame.isCompleted()) {
      completeGame();
    }

    return true;
  }, [gameState, isNoteMode, sudokuGame, time]);

  // Complete the game
  const completeGame = useCallback(() => {
    setGameState('completed');
    
    const finalScore = scoringSystem.calculateScore(
      currentLevel.name,
      time,
      hintsUsed,
      mistakes
    );
    
    // Validate completion with anti-cheat
    const validation = antiCheat.validateCompletion({
      difficulty: currentLevel.name,
      completionTime: time * 1000,
      correctMoves: board.flat().filter(cell => cell !== 0).length,
      totalMoves: antiCheat.playerActions.filter(a => a.type === 'number_place').length,
      mistakes,
      hintsUsed
    });

    // Track completion with anti-cheat
    antiCheat.trackAction({
      type: 'game_complete',
      completionTime: time * 1000,
      validation: validation.legitimate,
      confidence: validation.confidence
    });

    // Only record legitimate completions in statistics
    if (validation.legitimate) {
      setScore(finalScore);
      
      // Record statistics
      statistics.recordGame(
        currentLevel.name,
        finalScore,
        time,
        hintsUsed,
        mistakes
      );
    } else {
      // Show warning for suspicious completion
      console.warn('[Anti-Cheat] Suspicious game completion detected:', validation.issues);
      setScore(0); // Invalidate score for suspicious completion
    }
  }, [currentLevel, time, hintsUsed, mistakes, scoringSystem, statistics, board]);

  // Handle cell click
  const handleCellClick = useCallback((row, col) => {
    if (gameState !== 'playing') return;
    
    // Track cell click with anti-cheat
    antiCheat.trackAction({
      type: 'cell_click',
      row,
      col,
      cellValue: board[row][col],
      mousePosition: true // Will be filled by anti-cheat system
    });
    
    setSelectedCell({ row, col });
    
    // Highlight same numbers
    const cellValue = board[row][col];
    if (cellValue !== 0) {
      setHighlightedNumber(cellValue);
    } else {
      setHighlightedNumber(null);
    }
  }, [gameState, board]);

  // Handle number pad click
  const handleNumberClick = useCallback((num) => {
    if (!selectedCell || gameState !== 'playing') return;
    
    setSelectedNumber(num);
    makeMove(selectedCell.row, selectedCell.col, num);
  }, [selectedCell, gameState, makeMove]);

  // Get hint
  const getHint = useCallback(() => {
    if (hintsRemaining <= 0 || gameState !== 'playing') return;
    
    const hint = sudokuGame.getHint();
    if (hint) {
      // Track hint usage with anti-cheat
      antiCheat.trackAction({
        type: 'hint_used',
        row: hint.row,
        col: hint.col,
        hintNumber: hint.value,
        hintsRemaining: hintsRemaining - 1
      });
      
      makeMove(hint.row, hint.col, hint.value);
      setHintsUsed(prev => prev + 1);
      setHintsRemaining(prev => prev - 1);
    }
  }, [hintsRemaining, gameState, sudokuGame, makeMove]);

  // Reset game
  const resetGame = useCallback(() => {
    if (!currentLevel) return;
    
    // Track reset with anti-cheat
    antiCheat.trackAction({
      type: 'game_reset',
      timeElapsed: time * 1000,
      progress: board.flat().filter(cell => cell !== 0).length
    });
    
    sudokuGame.reset();
    setBoard(sudokuGame.getBoard());
    setSelectedCell(null);
    setSelectedNumber(null);
    setNotes(Array(9).fill().map(() => Array(9).fill().map(() => [])));
    setIsNoteMode(false);
    setHighlightedNumber(null);
    setErrors({});
    setScore(0);
    setTime(0);
    setHintsUsed(0);
    setMistakes(0);
    setHintsRemaining(3);
    setGameState('playing');
  }, [currentLevel, sudokuGame, time, board]);

  // Pause/resume game
  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      antiCheat.trackAction({ type: 'game_paused' });
    } else if (gameState === 'paused') {
      setGameState('playing');
      antiCheat.trackAction({ type: 'game_resumed' });
    }
  }, [gameState]);

  // Go back to menu
  const goToMenu = useCallback(() => {
    setGameState('menu');
    setCurrentLevel(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    antiCheat.trackAction({ type: 'return_to_menu' });
  }, []);

  // Get remaining numbers count
  const getRemainingNumbers = useCallback(() => {
    return sudokuGame.getRemainingNumbers();
  }, [sudokuGame, board]);

  // Get anti-cheat status (for debugging/monitoring)
  const getAntiCheatStatus = useCallback(() => {
    return antiCheat.getStatus();
  }, []);

  return {
    // Game state
    gameState,
    currentLevel,
    levels,
    
    // Board state
    board,
    selectedCell,
    selectedNumber,
    notes,
    isNoteMode,
    highlightedNumber,
    errors,
    
    // Game metrics
    score,
    time,
    hintsUsed,
    mistakes,
    hintsRemaining,
    
    // Statistics
    statistics: statistics.getStats(),
    
    // Actions
    startGame,
    makeMove,
    handleCellClick,
    handleNumberClick,
    getHint,
    resetGame,
    togglePause,
    goToMenu,
    setIsNoteMode,
    getRemainingNumbers,
    getAntiCheatStatus
  };
};

