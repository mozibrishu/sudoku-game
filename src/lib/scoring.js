// Scoring system for Sudoku game

export class ScoringSystem {
  constructor() {
    this.baseScores = {
      'Easy': 1000,
      'Medium': 2000,
      'Hard': 3000,
      'Expert': 5000
    };
    
    this.timeBonus = {
      'Easy': 10,    // Points per second under target
      'Medium': 15,
      'Hard': 20,
      'Expert': 25
    };
    
    this.targetTimes = {
      'Easy': 300,    // 5 minutes
      'Medium': 600,  // 10 minutes
      'Hard': 900,    // 15 minutes
      'Expert': 1200  // 20 minutes
    };
  }

  // Calculate score based on completion time, difficulty, and accuracy
  calculateScore(difficulty, timeInSeconds, hintsUsed = 0, mistakes = 0) {
    const baseScore = this.baseScores[difficulty] || 1000;
    const targetTime = this.targetTimes[difficulty] || 600;
    const timeBonusRate = this.timeBonus[difficulty] || 10;
    
    let score = baseScore;
    
    // Time bonus (if completed under target time)
    if (timeInSeconds < targetTime) {
      const timeSaved = targetTime - timeInSeconds;
      score += timeSaved * timeBonusRate;
    }
    
    // Penalty for hints
    score -= hintsUsed * 100;
    
    // Penalty for mistakes
    score -= mistakes * 50;
    
    // Minimum score
    score = Math.max(score, 100);
    
    return Math.round(score);
  }

  // Calculate bonus multipliers
  getMultipliers(difficulty, timeInSeconds, hintsUsed, mistakes) {
    const multipliers = {
      difficulty: 1,
      speed: 1,
      accuracy: 1,
      noHints: 1
    };
    
    // Difficulty multiplier
    switch (difficulty) {
      case 'Easy': multipliers.difficulty = 1.0; break;
      case 'Medium': multipliers.difficulty = 1.5; break;
      case 'Hard': multipliers.difficulty = 2.0; break;
      case 'Expert': multipliers.difficulty = 3.0; break;
    }
    
    // Speed multiplier
    const targetTime = this.targetTimes[difficulty] || 600;
    if (timeInSeconds < targetTime * 0.5) {
      multipliers.speed = 2.0;
    } else if (timeInSeconds < targetTime * 0.75) {
      multipliers.speed = 1.5;
    }
    
    // Accuracy multiplier
    if (mistakes === 0) {
      multipliers.accuracy = 1.5;
    } else if (mistakes <= 2) {
      multipliers.accuracy = 1.2;
    }
    
    // No hints bonus
    if (hintsUsed === 0) {
      multipliers.noHints = 1.3;
    }
    
    return multipliers;
  }

  // Check if game qualifies as "perfect"
  isPerfectGame(hintsUsed, mistakes) {
    return hintsUsed === 0 && mistakes === 0;
  }

  // Get achievement based on performance
  getAchievement(difficulty, timeInSeconds, hintsUsed, mistakes) {
    const targetTime = this.targetTimes[difficulty] || 600;
    const isPerfect = this.isPerfectGame(hintsUsed, mistakes);
    
    if (isPerfect && timeInSeconds < targetTime * 0.5) {
      return {
        title: "Sudoku Master",
        description: "Perfect game in record time!",
        icon: "🏆",
        points: 1000
      };
    } else if (isPerfect) {
      return {
        title: "Perfect Game",
        description: "Completed without hints or mistakes!",
        icon: "⭐",
        points: 500
      };
    } else if (timeInSeconds < targetTime * 0.5) {
      return {
        title: "Speed Demon",
        description: "Lightning fast completion!",
        icon: "⚡",
        points: 300
      };
    } else if (hintsUsed === 0) {
      return {
        title: "No Hints Hero",
        description: "Solved without any hints!",
        icon: "🧠",
        points: 200
      };
    } else if (mistakes <= 1) {
      return {
        title: "Accuracy Expert",
        description: "Minimal mistakes made!",
        icon: "🎯",
        points: 150
      };
    }
    
    return null;
  }

  // Format score for display
  formatScore(score) {
    return score.toLocaleString();
  }

  // Calculate level progression
  calculateLevelProgress(totalScore) {
    const levelThresholds = [
      0,      // Level 1
      5000,   // Level 2
      15000,  // Level 3
      35000,  // Level 4
      70000,  // Level 5
      120000, // Level 6
      200000, // Level 7
      300000, // Level 8
      450000, // Level 9
      650000  // Level 10
    ];
    
    let level = 1;
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (totalScore >= levelThresholds[i]) {
        level = i + 1;
        break;
      }
    }
    
    const nextThreshold = levelThresholds[level] || levelThresholds[levelThresholds.length - 1];
    const currentThreshold = levelThresholds[level - 1] || 0;
    const progress = Math.min(100, ((totalScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
    
    return {
      level,
      progress: Math.round(progress),
      nextThreshold,
      pointsToNext: Math.max(0, nextThreshold - totalScore)
    };
  }
}

// Statistics tracking
export class GameStatistics {
  constructor() {
    this.stats = this.loadStats();
  }

  // Load statistics from localStorage
  loadStats() {
    try {
      const saved = localStorage.getItem('sudoku-stats');
      return saved ? JSON.parse(saved) : this.getDefaultStats();
    } catch (error) {
      return this.getDefaultStats();
    }
  }

  // Save statistics to localStorage
  saveStats() {
    try {
      localStorage.setItem('sudoku-stats', JSON.stringify(this.stats));
    } catch (error) {
      console.error('Failed to save statistics:', error);
    }
  }

  // Get default statistics structure
  getDefaultStats() {
    return {
      totalGames: 0,
      totalScore: 0,
      totalTime: 0,
      perfectGames: 0,
      levels: {
        'Easy': { gamesCompleted: 0, bestScore: 0, bestTime: null, perfectGames: 0 },
        'Medium': { gamesCompleted: 0, bestScore: 0, bestTime: null, perfectGames: 0 },
        'Hard': { gamesCompleted: 0, bestScore: 0, bestTime: null, perfectGames: 0 },
        'Expert': { gamesCompleted: 0, bestScore: 0, bestTime: null, perfectGames: 0 }
      }
    };
  }

  // Record a completed game
  recordGame(difficulty, score, timeInSeconds, hintsUsed, mistakes) {
    const isPerfect = hintsUsed === 0 && mistakes === 0;
    
    // Update overall stats
    this.stats.totalGames++;
    this.stats.totalScore += score;
    this.stats.totalTime += timeInSeconds;
    if (isPerfect) this.stats.perfectGames++;
    
    // Update level-specific stats
    const levelStats = this.stats.levels[difficulty];
    levelStats.gamesCompleted++;
    
    if (score > levelStats.bestScore) {
      levelStats.bestScore = score;
    }
    
    if (!levelStats.bestTime || timeInSeconds < levelStats.bestTime) {
      levelStats.bestTime = timeInSeconds;
    }
    
    if (isPerfect) {
      levelStats.perfectGames++;
    }
    
    this.saveStats();
  }

  // Get statistics
  getStats() {
    return { ...this.stats };
  }

  // Reset all statistics
  resetStats() {
    this.stats = this.getDefaultStats();
    this.saveStats();
  }

  // Get level unlock status
  getLevelUnlockStatus() {
    const unlocked = {
      'Easy': true,
      'Medium': this.stats.levels.Easy.gamesCompleted >= 3,
      'Hard': this.stats.levels.Medium.gamesCompleted >= 5,
      'Expert': this.stats.levels.Hard.gamesCompleted >= 3
    };
    
    return unlocked;
  }
}

