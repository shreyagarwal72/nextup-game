import { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { gameAudio } from "@/utils/gameAudio";
import { updateScore } from "@/utils/gameStorage";

type Cell = 0 | 1;
type Board = Cell[][];
type Piece = {
  shape: number[][];
  x: number;
  y: number;
  color: string;
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" }, // I
  { shape: [[1, 1], [1, 1]], color: "bg-yellow-400" }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: "bg-purple-400" }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-green-400" }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-red-400" }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: "bg-orange-400" }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: "bg-blue-400" }, // L
];

export default function TetrisGame() {
  const [board, setBoard] = useState<Board>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [dropTime, setDropTime] = useState(1000);

  const createPiece = useCallback((): Piece => {
    const pieceTemplate = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: pieceTemplate.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(pieceTemplate.shape[0].length / 2),
      y: 0,
      color: pieceTemplate.color,
    };
  }, []);

  const rotatePiece = (piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  const isValidMove = (piece: Piece, board: Board): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = (piece: Piece, board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }
    return newBoard;
  };

  const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { newBoard, linesCleared };
  };

  const resetGame = () => {
    gameAudio.stopBackgroundMusic();
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(null);
    setNextPiece(null);
    setScore(0);
    setLevel(1);
    setLines(0);
    setIsPlaying(false);
    setGameOver(false);
    setDropTime(1000);
  };

  const startGame = () => {
    const piece = createPiece();
    const next = createPiece();
    setCurrentPiece(piece);
    setNextPiece(next);
    setIsPlaying(true);
    gameAudio.playBackgroundMusic();
  };

  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    if (!currentPiece || !isPlaying || gameOver) return;

    let newPiece = { ...currentPiece };
    
    switch (direction) {
      case 'left':
        newPiece.x -= 1;
        break;
      case 'right':
        newPiece.x += 1;
        break;
      case 'down':
        newPiece.y += 1;
        break;
      case 'rotate':
        newPiece = rotatePiece(newPiece);
        break;
    }

    if (isValidMove(newPiece, board)) {
      setCurrentPiece(newPiece);
      if (direction === 'rotate') {
        gameAudio.playSound('rotate');
      } else if (direction !== 'down') {
        gameAudio.playSound('move');
      }
    } else if (direction === 'down') {
      // Piece can't move down, place it
      const newBoard = placePiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      if (linesCleared > 0) {
        gameAudio.playSound('line');
      }
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor(lines / 10) + 1);
      
      // Create new piece
      const nextPieceToUse = nextPiece || createPiece();
      const newNextPiece = createPiece();
      
      if (isValidMove(nextPieceToUse, clearedBoard)) {
        setCurrentPiece(nextPieceToUse);
        setNextPiece(newNextPiece);
      } else {
        gameAudio.playSound('gameOver');
        gameAudio.stopBackgroundMusic();
        updateScore('tetris', score);
        setGameOver(true);
        setIsPlaying(false);
      }
    }
  }, [currentPiece, board, isPlaying, gameOver, nextPiece, createPiece, lines, level]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && !gameOver) {
        movePiece('down');
      }
    }, dropTime);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, movePiece, dropTime]);

  useEffect(() => {
    setDropTime(Math.max(100, 1000 - (level - 1) * 100));
  }, [level]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          movePiece('left');
          break;
        case 'ArrowRight':
        case 'd':
          movePiece('right');
          break;
        case 'ArrowDown':
        case 's':
          movePiece('down');
          break;
        case 'ArrowUp':
        case 'w':
        case ' ':
          e.preventDefault();
          movePiece('rotate');
          break;
        case 'p':
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, movePiece]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 1;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  return (
    <GameLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Tetris</h1>
          <p className="text-muted-foreground">Clear lines by filling horizontal rows!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Stats */}
          <div className="space-y-4">
            <Card className="bg-gaming-card border-gaming-accent/20">
              <CardHeader>
                <CardTitle className="text-gaming-accent">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gaming-accent">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gaming-accent">{level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gaming-accent">{lines}</div>
                  <div className="text-sm text-muted-foreground">Lines</div>
                </div>
              </CardContent>
            </Card>

            {/* Next Piece */}
            <Card className="bg-gaming-card border-gaming-accent/20">
              <CardHeader>
                <CardTitle className="text-gaming-accent">Next Piece</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1 mx-auto w-fit">
                  {nextPiece?.shape.map((row, y) => (
                    <div key={y} className="flex gap-1">
                      {row.map((cell, x) => (
                        <div
                          key={x}
                          className={`w-6 h-6 rounded-sm ${
                            cell ? nextPiece.color : 'bg-gaming-darker'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-gaming-card border-gaming-accent/20">
              <CardHeader>
                <CardTitle className="text-gaming-accent">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>← → : Move left/right</p>
                <p>↓ : Soft drop</p>
                <p>↑ / Space : Rotate</p>
                <p>P : Pause</p>
              </CardContent>
            </Card>
          </div>

          {/* Game Board */}
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardContent className="p-6">
              <div 
                className="grid gap-1 mx-auto bg-gaming-darker p-4 rounded-lg"
                style={{ 
                  gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                  width: 'min(300px, 80vw)',
                  height: 'min(600px, 60vh)'
                }}
              >
                {renderBoard().map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${y}-${x}`}
                      className={`aspect-square rounded-sm transition-all ${
                        cell ? 'bg-gaming-accent' : 'bg-gaming-card/50'
                      }`}
                      style={{
                        width: 'min(20px, 3vw)',
                        height: 'min(20px, 3vw)'
                      }}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Controls & Info */}
          <div className="space-y-4">
            <Card className="bg-gaming-card border-gaming-accent/20">
              <CardContent className="p-6 space-y-4">
                {!isPlaying && !gameOver && (
                  <Button
                    onClick={() => {
                      gameAudio.playSound('click');
                      startGame();
                    }}
                    className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Game
                  </Button>
                )}
                
                {isPlaying && (
                  <Button
                    onClick={() => {
                      gameAudio.playSound('click');
                      setIsPlaying(false);
                    }}
                    className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                {!isPlaying && currentPiece && !gameOver && (
                  <Button
                    onClick={() => {
                      gameAudio.playSound('click');
                      setIsPlaying(true);
                    }}
                    className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Resume
                  </Button>
                )}

                <Button
                  onClick={() => {
                    gameAudio.playSound('click');
                    resetGame();
                  }}
                  variant="outline"
                  className="w-full border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset Game
                </Button>

                {/* Mobile Controls */}
                <div className="md:hidden space-y-3">
                  <p className="text-sm text-muted-foreground text-center">Mobile Controls</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => movePiece('left')}
                      variant="outline"
                      size="sm"
                      className="border-gaming-accent text-gaming-accent"
                      disabled={!isPlaying}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => movePiece('rotate')}
                      variant="outline"
                      size="sm"
                      className="border-gaming-accent text-gaming-accent"
                      disabled={!isPlaying}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => movePiece('right')}
                      variant="outline"
                      size="sm"
                      className="border-gaming-accent text-gaming-accent"
                      disabled={!isPlaying}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => movePiece('down')}
                    variant="outline"
                    size="sm"
                    className="w-full border-gaming-accent text-gaming-accent"
                    disabled={!isPlaying}
                  >
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Drop
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Game Over */}
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
                    <div className="text-2xl font-bold text-foreground">Final Score</div>
                    <div className="text-gaming-accent text-xl">{score}</div>
                    <div className="text-muted-foreground">Level {level}</div>
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
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Move and rotate falling pieces</p>
                <p>• Fill complete horizontal lines to clear them</p>
                <p>• Game gets faster as level increases</p>
                <p>• Game ends when pieces reach the top</p>
                <p>• Use mobile controls on touch devices</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}