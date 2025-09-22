import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Trophy, Clock, Star, RotateCcw, Home } from 'lucide-react';

const GameComplete = ({ 
  score, 
  time, 
  level, 
  hintsUsed, 
  mistakes, 
  achievement,
  onPlayAgain, 
  onGoHome 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isPerfect = hintsUsed === 0 && mistakes === 0;

  return (
    <div className="game-complete fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-amber-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {isPerfect ? '🏆' : '🎉'}
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">
            {isPerfect ? 'Perfect Game!' : 'Congratulations!'}
          </h2>
          <p className="text-amber-700">
            You completed {level} level!
          </p>
        </div>

        {achievement && (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-4 mb-6 border-2 border-yellow-300">
            <div className="text-center">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-bold text-yellow-800">{achievement.title}</h3>
              <p className="text-sm text-yellow-700">{achievement.description}</p>
              <div className="text-lg font-bold text-yellow-800 mt-2">
                +{achievement.points} bonus points!
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-200 rounded-lg p-4 text-center">
            <Trophy className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-sm text-amber-700">Final Score</div>
            <div className="text-xl font-bold text-amber-900">
              {score.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-amber-200 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-sm text-amber-700">Time</div>
            <div className="text-xl font-bold text-amber-900">
              {formatTime(time)}
            </div>
          </div>
          
          <div className="bg-amber-200 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-sm text-amber-700">Hints Used</div>
            <div className="text-xl font-bold text-amber-900">
              {hintsUsed}
            </div>
          </div>
          
          <div className="bg-amber-200 rounded-lg p-4 text-center">
            <div className="w-6 h-6 text-amber-600 mx-auto mb-2 flex items-center justify-center text-lg">
              ❌
            </div>
            <div className="text-sm text-amber-700">Mistakes</div>
            <div className="text-xl font-bold text-amber-900">
              {mistakes}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="outline"
            className="flex-1 bg-amber-200 hover:bg-amber-300 border-amber-400 text-amber-900 font-semibold py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;

