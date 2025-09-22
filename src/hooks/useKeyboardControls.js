import { useEffect } from 'react';

export const useKeyboardControls = ({
  gameState,
  selectedCell,
  setSelectedCell,
  handleNumberClick,
  setIsNoteMode,
  isNoteMode,
  getHint,
  resetGame,
  togglePause,
  board
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameState !== 'playing') return;

      const { key, ctrlKey, metaKey } = event;
      
      // Prevent default for game keys
      if (/^[1-9]$/.test(key) || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].includes(key)) {
        event.preventDefault();
      }

      // Number input (1-9)
      if (/^[1-9]$/.test(key) && selectedCell) {
        handleNumberClick(parseInt(key));
        return;
      }

      // Clear cell (Backspace, Delete, or 0)
      if ((key === 'Backspace' || key === 'Delete' || key === '0') && selectedCell) {
        handleNumberClick(0);
        return;
      }

      // Arrow key navigation
      if (selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        const { row, col } = selectedCell;
        let newRow = row;
        let newCol = col;

        switch (key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
        }

        setSelectedCell({ row: newRow, col: newCol });
        return;
      }

      // Toggle notes mode (N key)
      if (key.toLowerCase() === 'n') {
        setIsNoteMode(prev => !prev);
        return;
      }

      // Hint (H key)
      if (key.toLowerCase() === 'h') {
        getHint();
        return;
      }

      // Reset (R key with Ctrl/Cmd)
      if (key.toLowerCase() === 'r' && (ctrlKey || metaKey)) {
        event.preventDefault();
        resetGame();
        return;
      }

      // Pause (Space or P key)
      if (key === ' ' || key.toLowerCase() === 'p') {
        togglePause();
        return;
      }

      // Select first empty cell (Tab key)
      if (key === 'Tab') {
        event.preventDefault();
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
              setSelectedCell({ row, col });
              return;
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    selectedCell,
    setSelectedCell,
    handleNumberClick,
    setIsNoteMode,
    isNoteMode,
    getHint,
    resetGame,
    togglePause,
    board
  ]);
};

