import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Play, Home, RotateCcw } from 'lucide-react';

const PauseScreen = ({ onResume, onRestart, onGoHome }) => {
  return (
    <div className="pause-screen fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl p-8 max-w-sm w-full border-4 border-amber-200">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⏸️</div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Game Paused</h2>
          <p className="text-amber-700">Take a break and come back when ready!</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onResume}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Resume Game
          </Button>
          
          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full bg-amber-200 hover:bg-amber-300 border-amber-400 text-amber-900 font-semibold py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Level
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="outline"
            className="w-full bg-amber-200 hover:bg-amber-300 border-amber-400 text-amber-900 font-semibold py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;

