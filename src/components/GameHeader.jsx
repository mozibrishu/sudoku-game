import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { 
  ArrowLeft, 
  RotateCcw, 
  Lightbulb, 
  Edit3, 
  Pause, 
  Play,
  Info
} from 'lucide-react';

const GameHeader = ({ 
  score, 
  time, 
  level, 
  isPaused, 
  isNoteMode,
  hintsRemaining,
  onBack, 
  onReset, 
  onHint, 
  onToggleNotes, 
  onPause,
  onInfo
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-header bg-gradient-to-r from-amber-100 to-amber-200 p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="bg-amber-200 hover:bg-amber-300 border-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-bold text-amber-900">
            Level: {level}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-sm text-amber-700">Score</div>
            <div className="text-lg font-bold text-amber-900">{score.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-amber-700">Time</div>
            <div className="text-lg font-bold text-amber-900">{formatTime(time)}</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="bg-amber-200 hover:bg-amber-300 border-amber-400"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onInfo}
            className="bg-amber-200 hover:bg-amber-300 border-amber-400"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isNoteMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleNotes}
            className={`${
              isNoteMode 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-amber-200 hover:bg-amber-300 border-amber-400'
            }`}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Notes
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onHint}
            disabled={hintsRemaining === 0}
            className="bg-amber-200 hover:bg-amber-300 border-amber-400 disabled:opacity-50"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Hint ({hintsRemaining})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="bg-amber-200 hover:bg-amber-300 border-amber-400"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;

