import React from 'react';
import { Trophy, Heart } from 'lucide-react';

type ScorePanelProps = {
  score: number;
  highScore: number;
  lives: number;
};

export function ScorePanel({ score, highScore, lives }: ScorePanelProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2 text-pink-500">
        <Trophy size={24} />
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-purple-400">High Score: {highScore}</div>
        <div className="flex items-center gap-1">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart
              key={i}
              size={20}
              className="text-red-500 fill-red-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}