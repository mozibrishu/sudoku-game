import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Trophy, Clock, Star } from 'lucide-react';

const LevelSelection = ({ levels, onLevelSelect, statistics }) => {
  const getDifficultyIcon = (difficulty) => {
    const icons = {
      'Easy': '🟢',
      'Medium': '🟡', 
      'Hard': '🟠',
      'Expert': '🔴'
    };
    return icons[difficulty] || '⚪';
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="level-selection max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">Sudoku Master</h1>
        <p className="text-amber-700">Choose your challenge level</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level) => {
          const stats = statistics[level.name] || {};
          const isLocked = level.locked;
          
          return (
            <div
              key={level.name}
              className={`
                level-card bg-gradient-to-br from-amber-50 to-amber-100 
                rounded-xl shadow-lg border-2 border-amber-200 p-6
                transition-all duration-300 hover:shadow-xl
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
              `}
              onClick={() => !isLocked && onLevelSelect(level)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDifficultyIcon(level.name)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-amber-900">{level.name}</h3>
                    <p className="text-sm text-amber-700">{level.description}</p>
                  </div>
                </div>
                {isLocked && (
                  <div className="text-amber-600">🔒</div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="w-4 h-4 text-amber-600 mr-1" />
                    <span className="text-xs text-amber-700">Best Score</span>
                  </div>
                  <div className="font-bold text-amber-900">
                    {stats.bestScore ? stats.bestScore.toLocaleString() : '--'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-amber-600 mr-1" />
                    <span className="text-xs text-amber-700">Best Time</span>
                  </div>
                  <div className="font-bold text-amber-900">
                    {formatTime(stats.bestTime)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-4 h-4 text-amber-600 mr-1" />
                    <span className="text-xs text-amber-700">Completed</span>
                  </div>
                  <div className="font-bold text-amber-900">
                    {stats.gamesCompleted || 0}
                  </div>
                </div>
              </div>

              <Button
                className={`
                  w-full font-semibold transition-all duration-200
                  ${isLocked 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg'
                  }
                `}
                disabled={isLocked}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLocked) onLevelSelect(level);
                }}
              >
                {isLocked ? 'Locked' : 'Play'}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="bg-amber-100 rounded-lg p-4 inline-block">
          <h3 className="font-bold text-amber-900 mb-2">Overall Statistics</h3>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-amber-700">Total Games</div>
              <div className="font-bold text-amber-900">
                {Object.values(statistics).reduce((sum, stat) => sum + (stat.gamesCompleted || 0), 0)}
              </div>
            </div>
            <div>
              <div className="text-amber-700">Best Overall Score</div>
              <div className="font-bold text-amber-900">
                {Math.max(...Object.values(statistics).map(stat => stat.bestScore || 0)).toLocaleString() || '--'}
              </div>
            </div>
            <div>
              <div className="text-amber-700">Perfect Games</div>
              <div className="font-bold text-amber-900">
                {Object.values(statistics).reduce((sum, stat) => sum + (stat.perfectGames || 0), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;

