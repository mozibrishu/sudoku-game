// Sudoku game logic and utilities

export class SudokuGame {
  constructor() {
    this.board = Array(9).fill().map(() => Array(9).fill(0));
    this.solution = Array(9).fill().map(() => Array(9).fill(0));
    this.initialBoard = Array(9).fill().map(() => Array(9).fill(0));
  }

  // Check if a number is valid in a specific position
  isValidMove(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  // Solve the Sudoku puzzle using backtracking
  solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(board, row, col, num)) {
              board[row][col] = num;
              if (this.solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Generate a complete valid Sudoku solution
  generateSolution() {
    const board = Array(9).fill().map(() => Array(9).fill(0));
    
    // Fill diagonal 3x3 boxes first (they don't affect each other)
    for (let box = 0; box < 9; box += 3) {
      this.fillBox(board, box, box);
    }
    
    // Solve the rest
    this.solveSudoku(board);
    return board;
  }

  // Fill a 3x3 box with random valid numbers
  fillBox(board, row, col) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.shuffleArray(numbers);
    
    let index = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[row + i][col + j] = numbers[index++];
      }
    }
  }

  // Shuffle array in place
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Generate a puzzle by removing numbers from a complete solution
  generatePuzzle(difficulty = 'Medium') {
    const solution = this.generateSolution();
    const puzzle = solution.map(row => [...row]);
    
    // Difficulty settings (number of cells to remove)
    const difficultySettings = {
      'Easy': 35,
      'Medium': 45,
      'Hard': 55,
      'Expert': 65
    };
    
    const cellsToRemove = difficultySettings[difficulty] || 45;
    let removed = 0;
    
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== 0) {
        const backup = puzzle[row][col];
        puzzle[row][col] = 0;
        
        // Check if puzzle still has unique solution
        const testBoard = puzzle.map(row => [...row]);
        if (this.hasUniqueSolution(testBoard)) {
          removed++;
        } else {
          puzzle[row][col] = backup;
        }
      }
    }
    
    this.board = puzzle.map(row => [...row]);
    this.solution = solution;
    this.initialBoard = puzzle.map(row => [...row]);
    
    return {
      puzzle: this.board,
      solution: this.solution,
      initialBoard: this.initialBoard
    };
  }

  // Check if puzzle has a unique solution (simplified check)
  hasUniqueSolution(board) {
    const testBoard1 = board.map(row => [...row]);
    const testBoard2 = board.map(row => [...row]);
    
    const solution1 = this.solveSudoku(testBoard1);
    if (!solution1) return false;
    
    // Try to find a different solution
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (num !== testBoard1[row][col] && this.isValidMove(board, row, col, num)) {
              testBoard2[row][col] = num;
              if (this.solveSudoku(testBoard2)) {
                return false; // Found different solution
              }
              testBoard2[row][col] = 0;
            }
          }
          return true; // Only one solution found
        }
      }
    }
    return true;
  }

  // Make a move on the board
  makeMove(row, col, num) {
    if (this.initialBoard[row][col] !== 0) {
      return false; // Can't modify initial numbers
    }
    
    this.board[row][col] = num;
    return true;
  }

  // Check if the current board state is valid
  isValidBoard() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = this.board[row][col];
        if (num !== 0) {
          this.board[row][col] = 0; // Temporarily remove to check
          if (!this.isValidMove(this.board, row, col, num)) {
            this.board[row][col] = num; // Restore
            return false;
          }
          this.board[row][col] = num; // Restore
        }
      }
    }
    return true;
  }

  // Check if the puzzle is completed
  isCompleted() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }
    return this.isValidBoard();
  }

  // Get hint for next move
  getHint() {
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col, value: this.solution[row][col] });
        }
      }
    }
    
    if (emptyCells.length === 0) return null;
    
    // Return a random empty cell with its solution
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  // Get possible numbers for a cell
  getPossibleNumbers(row, col) {
    if (this.board[row][col] !== 0) return [];
    
    const possible = [];
    for (let num = 1; num <= 9; num++) {
      if (this.isValidMove(this.board, row, col, num)) {
        possible.push(num);
      }
    }
    return possible;
  }

  // Count remaining numbers needed
  getRemainingNumbers() {
    const count = {};
    for (let i = 1; i <= 9; i++) {
      count[i] = 9; // Each number appears 9 times in a complete puzzle
    }
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = this.board[row][col];
        if (num > 0) {
          count[num]--;
        }
      }
    }
    
    return count;
  }

  // Reset board to initial state
  reset() {
    this.board = this.initialBoard.map(row => [...row]);
  }

  // Get current board state
  getBoard() {
    return this.board.map(row => [...row]);
  }

  // Set board state
  setBoard(board) {
    this.board = board.map(row => [...row]);
  }
}

