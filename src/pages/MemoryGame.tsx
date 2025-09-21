import { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trophy, Clock, Eye } from "lucide-react";

interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardValues = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    return parseInt(localStorage.getItem("memoryBestTime") || "999");
  });

  const initializeGame = () => {
    const duplicatedValues = [...cardValues, ...cardValues];
    const shuffledCards = duplicatedValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setTime(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon]);

  useEffect(() => {
    if (matches === cardValues.length) {
      setGameWon(true);
      setIsPlaying(false);
      if (time < bestTime) {
        setBestTime(time);
        localStorage.setItem("memoryBestTime", time.toString());
      }
    }
  }, [matches, time, bestTime]);

  const handleCardClick = (cardId: number) => {
    if (!isPlaying || gameWon) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards => 
      prevCards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard?.value === secondCard?.value) {
          // Match found
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches(matches + 1);
        } else {
          // No match, flip cards back
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
        }
        
        setFlippedCards([]);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficulty = () => {
    if (moves <= 12) return "Expert";
    if (moves <= 16) return "Good";
    if (moves <= 20) return "Average";
    return "Beginner";
  };

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Memory Game</h1>
          <p className="text-muted-foreground">Match all the pairs to win!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Eye className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{moves}</div>
              <div className="text-sm text-muted-foreground">Moves</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{matches}</div>
              <div className="text-sm text-muted-foreground">Matches</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{formatTime(time)}</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">
                {bestTime === 999 ? "--" : formatTime(bestTime)}
              </div>
              <div className="text-sm text-muted-foreground">Best Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {cards.map((card) => (
                <Button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isFlipped || card.isMatched || flippedCards.length >= 2}
                  variant="outline"
                  className={`h-20 w-20 text-3xl border-gaming-accent/50 transition-all duration-300 ${
                    card.isMatched
                      ? "bg-gaming-accent/20 border-gaming-accent text-gaming-accent"
                      : card.isFlipped
                      ? "bg-gaming-accent/10 border-gaming-accent"
                      : "hover:border-gaming-accent hover:bg-gaming-accent/5"
                  }`}
                >
                  {card.isFlipped || card.isMatched ? card.value : "?"}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Won Modal */}
        {gameWon && (
          <Card className="bg-gaming-card border-gaming-accent/50 shadow-gaming-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-gaming-accent flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6" />
                Congratulations!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">You Won!</div>
                <div className="text-muted-foreground">
                  <div>Time: {formatTime(time)}</div>
                  <div>Moves: {moves}</div>
                  <div>Difficulty: <span className="text-gaming-accent">{getDifficulty()}</span></div>
                  {time === bestTime && bestTime !== 999 && (
                    <div className="text-gaming-accent font-semibold">🎉 New Best Time!</div>
                  )}
                </div>
              </div>
              <Button
                onClick={initializeGame}
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
              >
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center">
          <Button
            onClick={initializeGame}
            className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            New Game
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Click on cards to flip them and reveal the symbols</p>
            <p>• Find two cards with matching symbols</p>
            <p>• Match all pairs to win the game</p>
            <p>• Try to complete the game in the fewest moves and fastest time</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}