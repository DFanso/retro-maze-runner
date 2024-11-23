import React from 'react';
import { GameState } from '../types/game';

type GameBoardProps = {
  gameState: GameState;
  gridSize: number;
};

export function GameBoard({ gameState, gridSize }: GameBoardProps) {
  const { player, ghosts, dots, isInvincible } = gameState;

  return (
    <div
      className="relative w-[400px] h-[400px] border-2 border-pink-500/50 rounded-lg overflow-hidden mb-6"
      style={{
        background: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
        backgroundSize: `${400/gridSize}px ${400/gridSize}px`
      }}
    >
      {/* Player */}
      <div
        className={`absolute bg-yellow-400 rounded-full transition-all duration-100 ${
          isInvincible ? 'animate-pulse opacity-70' : ''
        }`}
        style={{
          width: `${100/gridSize}%`,
          height: `${100/gridSize}%`,
          left: `${(player.x * 100)/gridSize}%`,
          top: `${(player.y * 100)/gridSize}%`,
          boxShadow: '0 0 10px rgba(255, 255, 0, 0.5)'
        }}
      />

      {/* Ghosts */}
      {ghosts.map((ghost, index) => (
        <div
          key={index}
          className="absolute transition-all duration-200"
          style={{
            width: `${100/gridSize}%`,
            height: `${100/gridSize}%`,
            left: `${(ghost.position.x * 100)/gridSize}%`,
            top: `${(ghost.position.y * 100)/gridSize}%`,
            backgroundColor: ghost.color,
            borderRadius: '40% 40% 0 0',
            boxShadow: `0 0 10px ${ghost.color}80`,
            transform: `scaleX(${ghost.direction.x < 0 ? -1 : 1})`,
          }}
        >
          {/* Ghost eyes */}
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white rounded-full" />
          <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-white rounded-full" />
        </div>
      ))}

      {/* Dots */}
      {dots.map((dot, index) => (
        <div
          key={index}
          className="absolute bg-purple-400 rounded-full animate-pulse"
          style={{
            width: `${50/gridSize}%`,
            height: `${50/gridSize}%`,
            left: `${(dot.x * 100)/gridSize + 25/gridSize}%`,
            top: `${(dot.y * 100)/gridSize + 25/gridSize}%`,
            boxShadow: '0 0 10px rgba(192, 132, 252, 0.5)'
          }}
        />
      ))}
    </div>
  );
}