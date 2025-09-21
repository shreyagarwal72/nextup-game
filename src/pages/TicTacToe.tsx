import { useState } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trophy, User, Bot } from "lucide-react";

type Player = "X" | "O" | null;
type Board = Player[];
type GameMode = "pvp" | "ai";

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (board: Board): Player => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const getAvailableMoves = (board: Board): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(val => val !== -1);
  };

  const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board);
    
    if (winner === "O") return 1;
    if (winner === "X") return -1;
    if (getAvailableMoves(board).length === 0) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board];
        newBoard[move] = "O";
        const score = minimax(newBoard, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board];
        newBoard[move] = "X";
        const score = minimax(newBoard, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const getBestMove = (board: Board): number => {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (const move of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = "O";
      const score = minimax(newBoard, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      return;
    }

    if (getAvailableMoves(newBoard).length === 0) {
      setIsDraw(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(nextPlayer);

    // AI move
    if (gameMode === "ai" && nextPlayer === "O") {
      setTimeout(() => {
        const aiMove = getBestMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = "O";
        setBoard(aiBoard);

        const aiWinner = checkWinner(aiBoard);
        if (aiWinner) {
          setWinner(aiWinner);
          setScores(prev => ({ ...prev, [aiWinner]: prev[aiWinner] + 1 }));
          return;
        }

        if (getAvailableMoves(aiBoard).length === 0) {
          setIsDraw(true);
          setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          return;
        }

        setCurrentPlayer("X");
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <GameLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Tic Tac Toe</h1>
          <p className="text-muted-foreground">Get three in a row to win!</p>
        </div>

        {/* Game Mode Selection */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent text-center">Game Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setGameMode("pvp");
                  resetGame();
                }}
                variant={gameMode === "pvp" ? "default" : "outline"}
                className={gameMode === "pvp" 
                  ? "bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                  : "border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
                }
              >
                <User className="h-5 w-5 mr-2" />
                Player vs Player
              </Button>
              <Button
                onClick={() => {
                  setGameMode("ai");
                  resetGame();
                }}
                variant={gameMode === "ai" ? "default" : "outline"}
                className={gameMode === "ai" 
                  ? "bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                  : "border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
                }
              >
                <Bot className="h-5 w-5 mr-2" />
                Player vs AI
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gaming-accent">{scores.X}</div>
              <div className="text-sm text-muted-foreground">Player X</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gaming-accent">{scores.draws}</div>
              <div className="text-sm text-muted-foreground">Draws</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gaming-accent">{scores.O}</div>
              <div className="text-sm text-muted-foreground">
                {gameMode === "ai" ? "AI" : "Player O"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Status */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-4 text-center">
            {winner ? (
              <div className="text-gaming-accent font-bold text-xl">
                🎉 Player {winner} Wins!
              </div>
            ) : isDraw ? (
              <div className="text-gaming-accent font-bold text-xl">
                🤝 It's a Draw!
              </div>
            ) : (
              <div className="text-foreground font-semibold">
                Current Player: <span className="text-gaming-accent">{currentPlayer}</span>
                {gameMode === "ai" && currentPlayer === "O" && " (AI thinking...)"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Board */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {board.map((cell, index) => (
                <Button
                  key={index}
                  onClick={() => makeMove(index)}
                  disabled={!!cell || !!winner || isDraw || (gameMode === "ai" && currentPlayer === "O")}
                  variant="outline"
                  className="h-20 w-20 text-3xl font-bold border-gaming-accent/50 hover:border-gaming-accent hover:bg-gaming-accent/10 transition-all duration-300"
                >
                  <span className={cell === "X" ? "text-gaming-accent" : "text-red-400"}>
                    {cell}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={resetGame}
            className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            New Game
          </Button>
          <Button
            onClick={resetScores}
            variant="outline"
            className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
          >
            <Trophy className="h-5 w-5 mr-2" />
            Reset Scores
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Players take turns placing X or O on the grid</p>
            <p>• Get three of your marks in a row (horizontal, vertical, or diagonal) to win</p>
            <p>• In AI mode, you play as X and the computer plays as O</p>
            <p>• The AI uses the minimax algorithm and is unbeatable when playing optimally</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}