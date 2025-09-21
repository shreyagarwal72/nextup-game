import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { gameAudio } from "@/utils/gameAudio";
import { updateScore } from "@/utils/gameStorage";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("snakeHighScore") || "0");
  });

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    gameAudio.stopBackgroundMusic();
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    gameAudio.playBackgroundMusic();
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameAudio.playSound('gameOver');
        gameAudio.stopBackgroundMusic();
        setGameOver(true);
        setIsPlaying(false);
        updateScore('snake', score);
        return prevSnake;
      }

      // Check self collision
      if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        gameAudio.playSound('gameOver');
        gameAudio.stopBackgroundMusic();
        setGameOver(true);
        setIsPlaying(false);
        updateScore('snake', score);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        gameAudio.playSound('score');
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snakeHighScore", newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, isPlaying, gameOver, food, generateFood, highScore]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (direction !== "DOWN") {
            setDirection("UP");
            gameAudio.playSound('move');
          }
          break;
        case "ArrowDown":
        case "s":
          if (direction !== "UP") {
            setDirection("DOWN");
            gameAudio.playSound('move');
          }
          break;
        case "ArrowLeft":
        case "a":
          if (direction !== "RIGHT") {
            setDirection("LEFT");
            gameAudio.playSound('move');
          }
          break;
        case "ArrowRight":
        case "d":
          if (direction !== "LEFT") {
            setDirection("RIGHT");
            gameAudio.playSound('move');
          }
          break;
        case " ":
          e.preventDefault();
          gameAudio.playSound('click');
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isPlaying]);

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Snake Game</h1>
          <p className="text-muted-foreground">Use arrow keys or WASD to control the snake</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gaming-accent">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gaming-accent">{highScore}</div>
              <div className="text-sm text-muted-foreground">High Score</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gaming-accent">{snake.length}</div>
              <div className="text-sm text-muted-foreground">Length</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-6">
            <div
              className="grid gap-1 mx-auto bg-gaming-darker p-4 rounded-lg relative"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: "min(500px, 90vw)",
                height: "min(500px, 90vw)",
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
                const isHead = snake[0]?.x === x && snake[0]?.y === y;
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-sm transition-all duration-75 ${
                      isFood
                        ? "bg-red-500 shadow-md gaming-pulse"
                        : isHead
                        ? "bg-gaming-accent shadow-gaming"
                        : isSnake
                        ? "bg-gaming-accent/80"
                        : "bg-gaming-card/50"
                    }`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => {
                gameAudio.playSound('click');
                if (!isPlaying && !gameOver) {
                  startGame();
                } else {
                  setIsPlaying(!isPlaying);
                }
              }}
              disabled={gameOver}
              className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
            >
              {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              onClick={() => {
                gameAudio.playSound('click');
                resetGame();
              }}
              variant="outline"
              className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden">
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={() => {
                  if (direction !== "DOWN") {
                    setDirection("UP");
                    gameAudio.playSound('move');
                  }
                }}
                variant="outline"
                size="sm"
                className="border-gaming-accent text-gaming-accent"
                disabled={!isPlaying}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (direction !== "RIGHT") {
                      setDirection("LEFT");
                      gameAudio.playSound('move');
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gaming-accent text-gaming-accent"
                  disabled={!isPlaying}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    if (direction !== "LEFT") {
                      setDirection("RIGHT");
                      gameAudio.playSound('move');
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gaming-accent text-gaming-accent"
                  disabled={!isPlaying}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => {
                  if (direction !== "UP") {
                    setDirection("DOWN");
                    gameAudio.playSound('move');
                  }
                }}
                variant="outline"
                size="sm"
                className="border-gaming-accent text-gaming-accent"
                disabled={!isPlaying}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <Card className="bg-gaming-card border-gaming-accent/50 shadow-gaming-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-gaming-accent flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6" />
                Game Over!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <div className="text-2xl font-bold text-foreground">Final Score: {score}</div>
                {score === highScore && score > 0 && (
                  <div className="text-gaming-accent font-semibold">🎉 New High Score!</div>
                )}
              </div>
                <Button
                  onClick={() => {
                    gameAudio.playSound('click');
                    resetGame();
                  }}
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                >
                  Play Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-gaming-accent">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>• Use arrow keys, WASD, or mobile controls to move</p>
              <p>• Eat the red food to grow and increase your score</p>
              <p>• Avoid hitting the walls or yourself</p>
              <p>• Press spacebar to pause/resume the game</p>
            </CardContent>
          </Card>
        </div>
    </GameLayout>
  );
}