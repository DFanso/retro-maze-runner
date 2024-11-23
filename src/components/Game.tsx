import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { ScorePanel } from './ScorePanel';
import { Controls } from './Controls';
import { Position, Direction, Ghost, GameState } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_LIVES = 3;
const GHOST_COUNT = 4;
const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];
const DOT_COUNT = 50;
const INVINCIBILITY_DURATION = 2000; // 2 seconds of invincibility after hit
const GHOST_SPEED = 400; // Slightly slower ghost movement

const createInitialState = (): GameState => {
  // Ensure player starts in the center
  const player = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
  
  // Generate dots away from player starting position
  const dots: Position[] = [];
  while (dots.length < DOT_COUNT) {
    const position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const distanceFromPlayer = Math.abs(position.x - player.x) + Math.abs(position.y - player.y);
    if (
      !dots.some(dot => dot.x === position.x && dot.y === position.y) &&
      distanceFromPlayer > 2 // Minimum distance from player
    ) {
      dots.push(position);
    }
  }

  // Place ghosts in corners
  const corners = [
    { x: 1, y: 1 },
    { x: GRID_SIZE - 2, y: 1 },
    { x: 1, y: GRID_SIZE - 2 },
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 },
  ];

  const ghosts: Ghost[] = Array.from({ length: GHOST_COUNT }, (_, i) => ({
    position: corners[i],
    direction: { x: 1, y: 0 },
    color: GHOST_COLORS[i],
    previousPosition: corners[i], // Add for smooth movement
  }));

  return {
    player,
    ghosts,
    dots,
    score: 0,
    lives: INITIAL_LIVES,
    gameOver: false,
    isInvincible: false,
  };
};

export function Game() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const movePlayer = useCallback((direction: Direction) => {
    if (!isPlaying || gameState.gameOver) return;

    setGameState(prev => {
      const newPosition = {
        x: (prev.player.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prev.player.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      const dotIndex = prev.dots.findIndex(
        dot => dot.x === newPosition.x && dot.y === newPosition.y
      );

      const newDots = [...prev.dots];
      const newScore = dotIndex >= 0 ? prev.score + 10 : prev.score;
      if (dotIndex >= 0) {
        newDots.splice(dotIndex, 1);
      }

      // Win condition
      if (newDots.length === 0) {
        return {
          ...prev,
          dots: newDots,
          score: newScore,
          gameOver: true,
          isWinner: true,
        };
      }

      return {
        ...prev,
        player: newPosition,
        dots: newDots,
        score: newScore,
      };
    });
  }, [isPlaying, gameState.gameOver]);

  const moveGhosts = useCallback(() => {
    setGameState(prev => {
      const newGhosts = prev.ghosts.map(ghost => {
        // Store previous position for smooth movement
        const previousPosition = { ...ghost.position };

        // Calculate direction towards player with 60% probability
        const shouldChasePlayer = Math.random() < 0.6;
        let direction: Direction;

        if (shouldChasePlayer) {
          const dx = prev.player.x - ghost.position.x;
          const dy = prev.player.y - ghost.position.y;
          
          // Choose either horizontal or vertical movement, not both
          if (Math.abs(dx) > Math.abs(dy)) {
            direction = { x: Math.sign(dx), y: 0 };
          } else {
            direction = { x: 0, y: Math.sign(dy) };
          }
        } else {
          // Random movement
          const possibleDirections = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];
          direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }

        const newPosition = {
          x: (ghost.position.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (ghost.position.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        return {
          ...ghost,
          position: newPosition,
          direction,
          previousPosition,
        };
      });

      // Check collision only if not invincible
      if (!prev.isInvincible) {
        const collision = newGhosts.some(
          ghost =>
            ghost.position.x === prev.player.x && ghost.position.y === prev.player.y
        );

        if (collision) {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            return {
              ...prev,
              lives: 0,
              gameOver: true,
              ghosts: newGhosts,
            };
          }

          // Set invincibility
          setTimeout(() => {
            setGameState(current => ({
              ...current,
              isInvincible: false,
            }));
          }, INVINCIBILITY_DURATION);

          return {
            ...prev,
            lives: newLives,
            ghosts: newGhosts,
            isInvincible: true,
          };
        }
      }

      return {
        ...prev,
        ghosts: newGhosts,
      };
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const directions: { [key: string]: Direction } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };

      const direction = directions[e.key];
      if (direction) {
        e.preventDefault(); // Prevent page scrolling
        movePlayer(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  useEffect(() => {
    if (!isPlaying || gameState.gameOver) return;

    const gameLoop = setInterval(() => {
      moveGhosts();
    }, GHOST_SPEED);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameState.gameOver, moveGhosts]);

  useEffect(() => {
    if (gameState.gameOver && gameState.score > highScore) {
      setHighScore(gameState.score);
    }
  }, [gameState.gameOver, gameState.score, highScore]);

  const startGame = () => {
    setGameState(createInitialState());
    setIsPlaying(true);
  };

  const resetGame = () => {
    setGameState(createInitialState());
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-black/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-pink-500/20">
        <ScorePanel
          score={gameState.score}
          highScore={highScore}
          lives={gameState.lives}
        />
        <GameBoard
          gameState={gameState}
          gridSize={GRID_SIZE}
        />
        <Controls
          isPlaying={isPlaying}
          gameOver={gameState.gameOver}
          isWinner={gameState.isWinner}
          onStart={startGame}
          onReset={resetGame}
        />
      </div>
    </div>
  );
}