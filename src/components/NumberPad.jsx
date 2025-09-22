import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const NumberPad = ({ onNumberClick, selectedNumber, remainingNumbers }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad bg-amber-50 p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-9 gap-2">
        {numbers.map(number => {
          const remaining = remainingNumbers[number] || 0;
          const isSelected = selectedNumber === number;
          const isDisabled = remaining === 0;
          
          return (
            <Button
              key={number}
              variant={isSelected ? "default" : "outline"}
              size="lg"
              className={`
                relative aspect-square text-lg font-bold transition-all duration-200
                ${isSelected ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-200 hover:bg-amber-300 text-amber-900 border-amber-400'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                shadow-md hover:shadow-lg
              `}
              onClick={() => !isDisabled && onNumberClick(number)}
              disabled={isDisabled}
            >
              <span className="text-xl">{number}</span>
              {remaining < 9 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {remaining}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default NumberPad;

