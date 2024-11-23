import React from 'react';
import { Trophy } from 'lucide-react';

type ScoreBoardProps = {
  score: number;
  highScore: number;
  speed: number;
};

export default function ScoreBoard({ score, highScore, speed }: ScoreBoardProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2 text-pink-500">
        <Trophy size={24} />
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-purple-400">High Score: {highScore}</div>
        <div className="text-purple-400 text-sm">Speed: {speed}x</div>
      </div>
    </div>
  );
}