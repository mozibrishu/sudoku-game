import React, { useRef, useEffect } from 'react';
import P5SudokuEffects from './P5SudokuEffects.jsx';

const SudokuBoard = ({ 
  board, 
  selectedCell, 
  onCellClick, 
  notes, 
  isNoteMode,
  highlightedNumber,
  errors,
  lastMove,
  isComplete,
  onEffectComplete
}) => {
  const boardRef = useRef();
  const effectsRef = useRef();

  const renderCell = (row, col) => {
    const cellValue = board[row][col];
    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isHighlighted = highlightedNumber && cellValue === highlightedNumber;
    const hasError = errors && errors[row] && errors[row][col];
    const cellNotes = notes[row] && notes[row][col] ? notes[row][col] : [];
    
    // Determine if cell is in same row, column, or 3x3 box as selected cell
    const isRelated = selectedCell && (
      selectedCell.row === row || 
      selectedCell.col === col || 
      (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && 
       Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
    );

    // Enhanced styling with P5.js integration
    const cellClasses = `
      sudoku-cell aspect-square flex items-center justify-center text-lg font-semibold
      border border-amber-800/30 cursor-pointer transition-all duration-300
      relative overflow-hidden
      ${isSelected ? 'bg-gradient-to-br from-amber-200 to-amber-300 ring-2 ring-amber-500 shadow-lg transform scale-105' : ''}
      ${isHighlighted ? 'bg-gradient-to-br from-blue-100 to-blue-200 shadow-md' : ''}
      ${isRelated ? 'bg-gradient-to-br from-amber-50 to-amber-100' : 'bg-gradient-to-br from-amber-25 to-white'}
      ${hasError ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-600 animate-pulse' : ''}
      ${cellValue === 0 ? 'hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-150 hover:shadow-md hover:scale-102' : ''}
      ${col % 3 === 2 && col !== 8 ? 'border-r-2 border-r-amber-800' : ''}
      ${row % 3 === 2 && row !== 8 ? 'border-b-2 border-b-amber-800' : ''}
    `;

    return (
      <div
        key={`${row}-${col}`}
        className={cellClasses}
        onClick={() => onCellClick(row, col)}
        style={{
          background: isSelected 
            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
            : isHighlighted 
            ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
            : isRelated 
            ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
            : 'linear-gradient(135deg, #fefce8 0%, #ffffff 100%)',
          boxShadow: isSelected 
            ? '0 8px 25px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
            : hasError 
            ? '0 4px 15px rgba(239, 68, 68, 0.3)' 
            : '0 2px 8px rgba(139, 69, 19, 0.1)',
        }}
      >
        {/* Shimmer effect for empty cells */}
        {cellValue === 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
        )}
        
        {/* Cell content */}
        {cellValue !== 0 ? (
          <span 
            className={`text-amber-900 font-bold text-xl relative z-10 ${cellValue > 0 ? 'drop-shadow-sm' : ''}`}
            style={{
              textShadow: '0 1px 2px rgba(139, 69, 19, 0.3)',
              color: isHighlighted ? '#1e40af' : '#92400e'
            }}
          >
            {Math.abs(cellValue)}
          </span>
        ) : cellNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-0 text-xs text-amber-600 w-full h-full p-1 relative z-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <div key={num} className="flex items-center justify-center">
                {cellNotes.includes(num) ? (
                  <span className="font-medium drop-shadow-sm">{num}</span>
                ) : ''}
              </div>
            ))}
          </div>
        ) : null}

        {/* Glow effect for selected cell */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-radial from-amber-300/30 via-transparent to-transparent animate-pulse" />
        )}
      </div>
    );
  };

  // Trigger error effect when errors change
  useEffect(() => {
    if (errors && effectsRef.current?.triggerErrorEffect) {
      Object.keys(errors).forEach(row => {
        Object.keys(errors[row]).forEach(col => {
          if (errors[row][col]) {
            effectsRef.current.triggerErrorEffect(parseInt(row), parseInt(col));
          }
        });
      });
    }
  }, [errors]);

  return (
    <div className="sudoku-board-container relative">
      <div 
        ref={boardRef}
        className="sudoku-board bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 p-4 rounded-xl shadow-2xl border-4 border-amber-800 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f3e8d3 0%, #e8d5b7 25%, #d4c4a8 50%, #c8b99c 75%, #b8a082 100%)',
          boxShadow: `
            0 20px 40px rgba(139, 69, 19, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.2),
            inset 0 -2px 0 rgba(139, 69, 19, 0.2),
            0 0 0 1px rgba(139, 69, 19, 0.1)
          `,
        }}
      >
        {/* Wood grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(139, 69, 19, 0.1) 2px,
                rgba(139, 69, 19, 0.1) 4px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(139, 69, 19, 0.05) 20px,
                rgba(139, 69, 19, 0.05) 22px
              )
            `
          }}
        />
        
        {/* Main grid */}
        <div className="grid grid-cols-9 gap-0 bg-amber-900/20 p-2 rounded-lg relative z-10">
          {Array.from({ length: 9 }, (_, row) =>
            Array.from({ length: 9 }, (_, col) => renderCell(row, col))
          )}
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-amber-800/30 rounded-full" />
        <div className="absolute top-2 right-2 w-4 h-4 bg-amber-800/30 rounded-full" />
        <div className="absolute bottom-2 left-2 w-4 h-4 bg-amber-800/30 rounded-full" />
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-amber-800/30 rounded-full" />
      </div>

      {/* P5.js Effects Layer */}
      <P5SudokuEffects
        ref={effectsRef}
        board={board}
        selectedCell={selectedCell}
        lastMove={lastMove}
        isComplete={isComplete}
        containerRef={boardRef}
        onEffectComplete={onEffectComplete}
      />
    </div>
  );
};

export default SudokuBoard;

