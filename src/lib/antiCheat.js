/**
 * Comprehensive Anti-Cheat System for Sudoku Master
 * Prevents automated play, cheating, and ensures fair gameplay
 */

export class AntiCheatSystem {
  constructor() {
    this.playerActions = [];
    this.sessionStart = Date.now();
    this.mouseMovements = [];
    this.keystrokes = [];
    this.timingPatterns = [];
    this.suspicionLevel = 0;
    this.maxSuspicionLevel = 100;
    this.warnings = [];
    
    // Behavioral analysis thresholds
    this.thresholds = {
      minActionTime: 100,        // Minimum time between actions (ms)
      maxActionTime: 30000,      // Maximum time for a single action (ms)
      minMouseMovement: 5,       // Minimum mouse movement between clicks
      maxPerfectSequence: 10,    // Max consecutive perfect moves
      minHumanVariation: 0.15,   // Minimum timing variation expected from humans
      maxInputSpeed: 20,         // Maximum inputs per second
      minPauseTime: 500,         // Minimum pause time between complex moves
      maxSimilarityScore: 0.8    // Maximum similarity in timing patterns
    };
    
    // Pattern detection
    this.patterns = {
      roboticTiming: [],
      perfectSequences: 0,
      unusualSpeed: 0,
      lackOfErrors: 0,
      mousePatterns: [],
      keyboardPatterns: []
    };
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
      this.trackMouseMovement(e.clientX, e.clientY);
    });

    // Keyboard tracking
    document.addEventListener('keydown', (e) => {
      this.trackKeystroke(e.key, e.timeStamp);
    });

    // Focus/blur detection (tab switching)
    document.addEventListener('visibilitychange', () => {
      this.trackFocusChange();
    });

    // Paste detection
    document.addEventListener('paste', (e) => {
      this.flagSuspiciousActivity('paste_detected', 'Paste operation detected');
    });
  }

  /**
   * Track player action and analyze for suspicious patterns
   */
  trackAction(action) {
    const timestamp = Date.now();
    const actionData = {
      ...action,
      timestamp,
      sessionTime: timestamp - this.sessionStart,
      mousePosition: this.getLastMousePosition(),
      timeSinceLastAction: this.getTimeSinceLastAction()
    };

    this.playerActions.push(actionData);
    this.analyzeAction(actionData);
    this.detectPatterns();
    
    // Keep only recent actions to prevent memory issues
    if (this.playerActions.length > 1000) {
      this.playerActions = this.playerActions.slice(-500);
    }
  }

  /**
   * Analyze individual action for suspicious behavior
   */
  analyzeAction(action) {
    // Check for impossibly fast actions
    if (action.timeSinceLastAction < this.thresholds.minActionTime) {
      this.flagSuspiciousActivity('too_fast', 
        `Action performed in ${action.timeSinceLastAction}ms (min: ${this.thresholds.minActionTime}ms)`);
    }

    // Check for lack of mouse movement
    if (action.type === 'cell_click' && this.getMouseMovementSinceLastAction() < this.thresholds.minMouseMovement) {
      this.flagSuspiciousActivity('no_mouse_movement', 
        'Cell clicked without mouse movement');
    }

    // Check for perfect timing patterns
    this.checkTimingPatterns(action);

    // Check for superhuman solving speed
    this.checkSolvingSpeed(action);

    // Check for lack of exploration (no wrong moves)
    this.checkExplorationPattern(action);
  }

  /**
   * Detect complex behavioral patterns
   */
  detectPatterns() {
    if (this.playerActions.length < 10) return;

    const recentActions = this.playerActions.slice(-20);
    
    // Analyze timing consistency
    this.analyzeTimingConsistency(recentActions);
    
    // Analyze move quality
    this.analyzeMoveQuality(recentActions);
    
    // Analyze input patterns
    this.analyzeInputPatterns(recentActions);
    
    // Check for bot-like sequences
    this.checkBotSequences(recentActions);
  }

  /**
   * Analyze timing consistency for robotic patterns
   */
  analyzeTimingConsistency(actions) {
    const timings = actions.map(a => a.timeSinceLastAction).filter(t => t > 0);
    if (timings.length < 5) return;

    const mean = timings.reduce((a, b) => a + b) / timings.length;
    const variance = timings.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / timings.length;
    const coefficient = Math.sqrt(variance) / mean;

    // Human players should have natural variation in timing
    if (coefficient < this.thresholds.minHumanVariation) {
      this.flagSuspiciousActivity('robotic_timing', 
        `Timing too consistent (coefficient: ${coefficient.toFixed(3)})`);
    }

    // Check for repeated exact timings
    const exactMatches = this.findExactTimingMatches(timings);
    if (exactMatches > 3) {
      this.flagSuspiciousActivity('exact_timing_matches', 
        `${exactMatches} exact timing matches found`);
    }
  }

  /**
   * Analyze move quality for superhuman performance
   */
  analyzeMoveQuality(actions) {
    const correctMoves = actions.filter(a => a.type === 'number_place' && a.correct).length;
    const totalMoves = actions.filter(a => a.type === 'number_place').length;
    
    if (totalMoves > 0) {
      const accuracy = correctMoves / totalMoves;
      
      // Flag if accuracy is suspiciously high
      if (accuracy > 0.95 && totalMoves > 10) {
        this.flagSuspiciousActivity('perfect_accuracy', 
          `Accuracy too high: ${(accuracy * 100).toFixed(1)}%`);
      }
    }

    // Check for consecutive perfect moves
    let consecutivePerfect = 0;
    let maxConsecutive = 0;
    
    actions.forEach(action => {
      if (action.type === 'number_place') {
        if (action.correct) {
          consecutivePerfect++;
          maxConsecutive = Math.max(maxConsecutive, consecutivePerfect);
        } else {
          consecutivePerfect = 0;
        }
      }
    });

    if (maxConsecutive > this.thresholds.maxPerfectSequence) {
      this.flagSuspiciousActivity('perfect_sequence', 
        `${maxConsecutive} consecutive perfect moves`);
    }
  }

  /**
   * Analyze input patterns for automation
   */
  analyzeInputPatterns(actions) {
    // Check input speed
    const inputActions = actions.filter(a => a.type === 'number_place' || a.type === 'cell_click');
    if (inputActions.length > 0) {
      const timeSpan = inputActions[inputActions.length - 1].timestamp - inputActions[0].timestamp;
      const inputsPerSecond = (inputActions.length / timeSpan) * 1000;
      
      if (inputsPerSecond > this.thresholds.maxInputSpeed) {
        this.flagSuspiciousActivity('input_speed', 
          `Input speed too high: ${inputsPerSecond.toFixed(1)} inputs/second`);
      }
    }

    // Check for keyboard-only play (suspicious for Sudoku)
    const mouseActions = actions.filter(a => a.mousePosition && 
      (a.mousePosition.x > 0 || a.mousePosition.y > 0)).length;
    const keyboardActions = actions.filter(a => a.type === 'keyboard_input').length;
    
    if (keyboardActions > 10 && mouseActions === 0) {
      this.flagSuspiciousActivity('keyboard_only', 
        'Only keyboard input detected (no mouse movement)');
    }
  }

  /**
   * Check for bot-like action sequences
   */
  checkBotSequences(actions) {
    // Look for repetitive patterns
    const sequences = this.extractActionSequences(actions, 3);
    const repeatedSequences = this.findRepeatedSequences(sequences);
    
    if (repeatedSequences.length > 2) {
      this.flagSuspiciousActivity('repeated_sequences', 
        `${repeatedSequences.length} repeated action sequences found`);
    }

    // Check for grid-scanning patterns (typical of solvers)
    const cellClicks = actions.filter(a => a.type === 'cell_click');
    if (this.detectGridScanning(cellClicks)) {
      this.flagSuspiciousActivity('grid_scanning', 
        'Systematic grid scanning pattern detected');
    }
  }

  /**
   * Track mouse movement for human behavior analysis
   */
  trackMouseMovement(x, y) {
    const timestamp = Date.now();
    this.mouseMovements.push({ x, y, timestamp });
    
    // Keep only recent movements
    if (this.mouseMovements.length > 100) {
      this.mouseMovements = this.mouseMovements.slice(-50);
    }
  }

  /**
   * Track keystroke patterns
   */
  trackKeystroke(key, timestamp) {
    this.keystrokes.push({ key, timestamp });
    
    // Keep only recent keystrokes
    if (this.keystrokes.length > 100) {
      this.keystrokes = this.keystrokes.slice(-50);
    }
  }

  /**
   * Track focus changes (tab switching detection)
   */
  trackFocusChange() {
    const timestamp = Date.now();
    this.trackAction({
      type: 'focus_change',
      hidden: document.hidden,
      timestamp
    });
    
    if (document.hidden) {
      this.flagSuspiciousActivity('tab_switch', 'Player switched tabs during game');
    }
  }

  /**
   * Flag suspicious activity and increase suspicion level
   */
  flagSuspiciousActivity(type, description, severity = 'medium') {
    const severityScores = { low: 5, medium: 15, high: 30, critical: 50 };
    const score = severityScores[severity] || 15;
    
    this.suspicionLevel += score;
    this.warnings.push({
      type,
      description,
      severity,
      timestamp: Date.now(),
      suspicionIncrease: score
    });

    console.warn(`[Anti-Cheat] ${severity.toUpperCase()}: ${description}`);
    
    // Take action if suspicion level is too high
    if (this.suspicionLevel >= this.thresholds.maxSuspicionLevel) {
      this.handleHighSuspicion();
    }
  }

  /**
   * Handle high suspicion level
   */
  handleHighSuspicion() {
    const actions = [
      'invalidate_score',
      'show_warning',
      'require_verification',
      'limit_features'
    ];
    
    // For now, just log and show warning
    console.error('[Anti-Cheat] High suspicion level reached:', this.suspicionLevel);
    
    // Could implement more severe measures here
    this.showAntiCheatWarning();
  }

  /**
   * Show anti-cheat warning to user
   */
  showAntiCheatWarning() {
    // This would integrate with the game UI
    const message = `
      ⚠️ Unusual gameplay patterns detected.
      
      Our anti-cheat system has identified behavior that may indicate:
      • Use of automated tools or bots
      • External assistance or solvers
      • Manipulation of game timing
      
      Fair play is important for all players. If you believe this is an error,
      please continue playing normally and the system will readjust.
      
      Repeated violations may result in score invalidation.
    `;
    
    // In a real implementation, this would show a proper modal
    alert(message);
  }

  /**
   * Validate game completion for legitimacy
   */
  validateCompletion(gameData) {
    const validation = {
      legitimate: true,
      issues: [],
      confidence: 1.0
    };

    // Check completion time vs difficulty
    const expectedMinTime = this.getExpectedMinTime(gameData.difficulty);
    if (gameData.completionTime < expectedMinTime) {
      validation.issues.push('Completion time too fast for difficulty level');
      validation.confidence -= 0.3;
    }

    // Check move efficiency
    const efficiency = gameData.correctMoves / gameData.totalMoves;
    if (efficiency > 0.98) {
      validation.issues.push('Move efficiency suspiciously high');
      validation.confidence -= 0.2;
    }

    // Check for human-like errors
    if (gameData.mistakes === 0 && gameData.totalMoves > 30) {
      validation.issues.push('No mistakes made in complex puzzle');
      validation.confidence -= 0.2;
    }

    // Check suspicion level
    if (this.suspicionLevel > 50) {
      validation.issues.push('High anti-cheat suspicion level');
      validation.confidence -= 0.4;
    }

    validation.legitimate = validation.confidence > 0.5;
    
    return validation;
  }

  /**
   * Get expected minimum time for difficulty level
   */
  getExpectedMinTime(difficulty) {
    const baseTimes = {
      'Easy': 60000,    // 1 minute
      'Medium': 120000, // 2 minutes
      'Hard': 300000,   // 5 minutes
      'Expert': 600000  // 10 minutes
    };
    
    return baseTimes[difficulty] || 60000;
  }

  /**
   * Helper methods for pattern detection
   */
  getLastMousePosition() {
    return this.mouseMovements.length > 0 ? 
      this.mouseMovements[this.mouseMovements.length - 1] : { x: 0, y: 0 };
  }

  getTimeSinceLastAction() {
    if (this.playerActions.length < 2) return 0;
    const lastAction = this.playerActions[this.playerActions.length - 1];
    const secondLastAction = this.playerActions[this.playerActions.length - 2];
    return lastAction.timestamp - secondLastAction.timestamp;
  }

  getMouseMovementSinceLastAction() {
    if (this.mouseMovements.length < 2) return 0;
    const recent = this.mouseMovements.slice(-2);
    return Math.sqrt(
      Math.pow(recent[1].x - recent[0].x, 2) + 
      Math.pow(recent[1].y - recent[0].y, 2)
    );
  }

  findExactTimingMatches(timings) {
    const matches = {};
    timings.forEach(timing => {
      matches[timing] = (matches[timing] || 0) + 1;
    });
    return Math.max(...Object.values(matches)) - 1;
  }

  extractActionSequences(actions, length) {
    const sequences = [];
    for (let i = 0; i <= actions.length - length; i++) {
      sequences.push(actions.slice(i, i + length).map(a => a.type).join(','));
    }
    return sequences;
  }

  findRepeatedSequences(sequences) {
    const counts = {};
    sequences.forEach(seq => {
      counts[seq] = (counts[seq] || 0) + 1;
    });
    return Object.entries(counts).filter(([seq, count]) => count > 1);
  }

  detectGridScanning(cellClicks) {
    if (cellClicks.length < 10) return false;
    
    // Check for systematic row/column scanning
    const positions = cellClicks.map(click => ({ row: click.row, col: click.col }));
    let sequentialCount = 0;
    
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      
      // Check if moving in sequence (row by row or column by column)
      if ((curr.row === prev.row && Math.abs(curr.col - prev.col) === 1) ||
          (curr.col === prev.col && Math.abs(curr.row - prev.row) === 1)) {
        sequentialCount++;
      }
    }
    
    return sequentialCount / positions.length > 0.6; // 60% sequential moves
  }

  /**
   * Get current anti-cheat status
   */
  getStatus() {
    return {
      suspicionLevel: this.suspicionLevel,
      warnings: this.warnings.length,
      actionsTracked: this.playerActions.length,
      sessionDuration: Date.now() - this.sessionStart,
      recentWarnings: this.warnings.slice(-5)
    };
  }

  /**
   * Reset anti-cheat system for new game
   */
  reset() {
    this.playerActions = [];
    this.mouseMovements = [];
    this.keystrokes = [];
    this.suspicionLevel = 0;
    this.warnings = [];
    this.sessionStart = Date.now();
  }
}

// Export singleton instance
export const antiCheat = new AntiCheatSystem();

