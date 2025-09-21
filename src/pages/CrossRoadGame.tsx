import { useState, useEffect, useRef, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { saveGameScore } from "@/utils/gameStorage";

interface Player {
  x: number;
  y: number;
  alive: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  speed: number;
  color: string;
}

export default function CrossRoadGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"waiting" | "playing" | "gameOver" | "won">("waiting");
  const [player, setPlayer] = useState<Player>({ x: 5, y: 9, alive: true });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const gameLoopRef = useRef<number>();
  const [isGameRunning, setIsGameRunning] = useState(false);

  const GRID_SIZE = 40;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
  const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

  const initializeGame = useCallback(() => {
    setPlayer({ x: 5, y: 9, alive: true });
    setObstacles([]);
    setLevel(1);
    setGameState("playing");
    setIsGameRunning(true);
    
    // Initialize obstacles
    const newObstacles: Obstacle[] = [];
    for (let row = 1; row < GRID_HEIGHT - 1; row++) {
      if (row % 2 === 1) { // Moving rows
        for (let i = 0; i < 2; i++) {
          newObstacles.push({
            x: Math.random() * GRID_WIDTH,
            y: row,
            speed: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5),
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          });
        }
      }
    }
    setObstacles(newObstacles);
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (!isGameRunning || gameState !== "playing") return;
    
    setPlayer(prev => {
      const newX = Math.max(0, Math.min(GRID_WIDTH - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(GRID_HEIGHT - 1, prev.y + dy));
      
      // Check if reached the top
      if (newY === 0) {
        setGameState("won");
        setIsGameRunning(false);
        setScore(score + level * 10);
        saveGameScore("Cross the Road", score + level * 10);
      }
      
      return { ...prev, x: newX, y: newY };
    });
  }, [isGameRunning, gameState, score, level]);

  const checkCollision = useCallback(() => {
    obstacles.forEach(obstacle => {
      const dx = Math.abs(player.x - obstacle.x);
      const dy = Math.abs(player.y - obstacle.y);
      
      if (dx < 0.8 && dy < 0.8) {
        setPlayer(prev => ({ ...prev, alive: false }));
        setGameState("gameOver");
        setIsGameRunning(false);
      }
    });
  }, [obstacles, player]);

  const gameLoop = useCallback(() => {
    if (!isGameRunning) return;

    // Update obstacles
    setObstacles(prev => prev.map(obstacle => ({
      ...obstacle,
      x: obstacle.x + obstacle.speed * 0.02
    })).map(obstacle => ({
      ...obstacle,
      x: obstacle.x < -1 ? GRID_WIDTH + 1 : 
         obstacle.x > GRID_WIDTH + 1 ? -1 : obstacle.x
    })));

    checkCollision();
  }, [isGameRunning, checkCollision]);

  // Game loop effect
  useEffect(() => {
    if (isGameRunning && gameState === "playing") {
      const loop = () => {
        gameLoop();
        gameLoopRef.current = requestAnimationFrame(loop);
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isGameRunning, gameState, gameLoop]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw road lanes
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (y === 0) {
        ctx.fillStyle = '#22c55e'; // Goal area
      } else if (y === GRID_HEIGHT - 1) {
        ctx.fillStyle = '#3b82f6'; // Start area
      } else {
        ctx.fillStyle = y % 2 === 0 ? '#374151' : '#4b5563'; // Road
      }
      ctx.fillRect(0, y * GRID_SIZE, CANVAS_WIDTH, GRID_SIZE);
    }

    // Draw lane dividers
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    for (let y = 1; y < GRID_HEIGHT; y++) {
      if (y % 2 === 1) {
        for (let x = 0; x < GRID_WIDTH; x += 2) {
          ctx.beginPath();
          ctx.moveTo(x * GRID_SIZE + GRID_SIZE / 2, y * GRID_SIZE + GRID_SIZE / 2);
          ctx.lineTo((x + 1) * GRID_SIZE, y * GRID_SIZE + GRID_SIZE / 2);
          ctx.stroke();
        }
      }
    }

    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(
        obstacle.x * GRID_SIZE + 2,
        obstacle.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
      );
    });

    // Draw player
    if (player.alive) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(
        player.x * GRID_SIZE + GRID_SIZE / 2,
        player.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }, [player, obstacles]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    if (gameState === "playing") {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState, movePlayer]);

  const resetGame = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    setGameState("waiting");
    setIsGameRunning(false);
    setPlayer({ x: 5, y: 9, alive: true });
    setObstacles([]);
  };

  const resetAll = () => {
    resetGame();
    setScore(0);
  };

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Cross the Road</h1>
          <p className="text-muted-foreground">Navigate through traffic to reach the other side!</p>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Game State: Waiting */}
              {gameState === "waiting" && (
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">🚸</div>
                  <h2 className="text-2xl font-bold text-foreground">Ready to Cross?</h2>
                  <p className="text-muted-foreground">
                    Navigate through the busy traffic to reach the green safe zone!
                  </p>
                  <Button
                    onClick={initializeGame}
                    className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card text-lg px-8 py-3"
                  >
                    Start Game
                  </Button>
                </div>
              )}

              {/* Game Canvas */}
              {(gameState === "playing" || gameState === "gameOver" || gameState === "won") && (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="border-2 border-gaming-accent/50 rounded-lg bg-gray-900"
                  />
                  
                  {/* Game Over Overlay */}
                  {gameState === "gameOver" && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">💥</div>
                        <div className="text-xl font-bold text-red-400">Game Over!</div>
                        <div className="text-muted-foreground">You got hit by traffic!</div>
                        <Button
                          onClick={resetGame}
                          className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Won Overlay */}
                  {gameState === "won" && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                      <div className="text-center space-y-4">
                        <div className="text-4xl gaming-scale-in">🎉</div>
                        <div className="text-xl font-bold text-green-400">You Made It!</div>
                        <div className="text-gaming-accent">+{level * 10} Points!</div>
                        <Button
                          onClick={initializeGame}
                          className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                        >
                          Next Level
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Controls */}
              {gameState === "playing" && (
                <div className="grid grid-cols-3 gap-2 mt-4 md:hidden">
                  <div></div>
                  <Button
                    onClick={() => movePlayer(0, -1)}
                    variant="outline"
                    size="sm"
                    className="border-gaming-accent/50 hover:border-gaming-accent"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => movePlayer(-1, 0)}
                    variant="outline"
                    size="sm"
                    className="border-gaming-accent/50 hover:border-gaming-accent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => movePlayer(0, 1)}
                    variant="outline"
                    size="sm"
                    className="border-gaming-accent/50 hover:border-gaming-accent"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => movePlayer(1, 0)}
                    variant="outline"
                    size="sm"
                    className="border-gaming-accent/50 hover:border-gaming-accent"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={resetAll}
            variant="outline"
            className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset All
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Use arrow keys or WASD to move your character (yellow circle)</p>
            <p>• On mobile, use the on-screen arrow buttons</p>
            <p>• Start at the blue area at the bottom</p>
            <p>• Avoid the moving colored obstacles (cars)</p>
            <p>• Reach the green safe zone at the top to win</p>
            <p>• Each successful crossing increases your score and level</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}