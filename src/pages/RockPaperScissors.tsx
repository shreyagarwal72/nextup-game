import { useState } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trophy } from "lucide-react";

type Choice = "rock" | "paper" | "scissors" | null;
type Result = "win" | "lose" | "draw" | null;

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const choices = [
    { id: "rock", emoji: "🪨", name: "Rock" },
    { id: "paper", emoji: "📄", name: "Paper" },
    { id: "scissors", emoji: "✂️", name: "Scissors" }
  ];

  const getRandomChoice = (): Choice => {
    const choices: Choice[] = ["rock", "paper", "scissors"];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return "draw";
    
    const winConditions = {
      rock: "scissors",
      paper: "rock", 
      scissors: "paper"
    };
    
    return winConditions[player as keyof typeof winConditions] === computer ? "win" : "lose";
  };

  const playRound = (choice: Choice) => {
    if (gameOver || isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choice);
    
    // Animate computer choice
    const computerChoice = getRandomChoice();
    
    setTimeout(() => {
      setComputerChoice(computerChoice);
      const roundResult = determineWinner(choice, computerChoice);
      setResult(roundResult);
      
      setScores(prev => {
        const newScores = { ...prev };
        if (roundResult === "win") newScores.player++;
        else if (roundResult === "lose") newScores.computer++;
        else newScores.draws++;
        return newScores;
      });
      
      if (round >= 5) {
        setGameOver(true);
      } else {
        setRound(round + 1);
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScores({ player: 0, computer: 0, draws: 0 });
    setRound(1);
    setGameOver(false);
    setIsAnimating(false);
  };

  const getResultMessage = () => {
    if (!result) return "";
    if (result === "win") return "You Win! 🎉";
    if (result === "lose") return "Computer Wins! 🤖";
    return "It's a Draw! 🤝";
  };

  const getFinalMessage = () => {
    if (scores.player > scores.computer) return "🎉 You Won the Match!";
    if (scores.computer > scores.player) return "🤖 Computer Won the Match!";
    return "🤝 Match Ended in a Draw!";
  };

  const getChoiceEmoji = (choice: Choice) => {
    if (!choice) return "❓";
    const choiceMap = { rock: "🪨", paper: "📄", scissors: "✂️" };
    return choiceMap[choice];
  };

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Rock Paper Scissors</h1>
          <p className="text-muted-foreground">Best of 5 rounds wins the match!</p>
        </div>

        {/* Round Counter */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-4 text-center">
            <div className="text-gaming-accent font-bold text-xl">
              {gameOver ? "Match Complete!" : `Round ${round} of 5`}
            </div>
          </CardContent>
        </Card>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gaming-accent">{scores.player}</div>
              <div className="text-sm text-muted-foreground">Player</div>
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
              <div className="text-2xl font-bold text-gaming-accent">{scores.computer}</div>
              <div className="text-sm text-muted-foreground">Computer</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Arena */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Player Choice */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Choice</h3>
                <div className="text-8xl mb-4 gaming-float">
                  {getChoiceEmoji(playerChoice)}
                </div>
                <div className="text-gaming-accent font-semibold">
                  {playerChoice ? choices.find(c => c.id === playerChoice)?.name : "Make your choice"}
                </div>
              </div>

              {/* VS & Result */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gaming-accent mb-4">VS</div>
                {result && (
                  <div className="text-lg font-bold text-foreground gaming-scale-in">
                    {getResultMessage()}
                  </div>
                )}
              </div>

              {/* Computer Choice */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-4">Computer Choice</h3>
                <div className="text-8xl mb-4 gaming-float">
                  {isAnimating ? "❓" : getChoiceEmoji(computerChoice)}
                </div>
                <div className="text-gaming-accent font-semibold">
                  {computerChoice ? choices.find(c => c.id === computerChoice)?.name : "Thinking..."}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Choices */}
        {!gameOver && (
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-gaming-accent text-center">Make Your Choice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {choices.map((choice) => (
                  <Button
                    key={choice.id}
                    onClick={() => playRound(choice.id as Choice)}
                    disabled={isAnimating}
                    variant="outline"
                    className="h-24 text-4xl border-gaming-accent/50 hover:border-gaming-accent hover:bg-gaming-accent/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-1">{choice.emoji}</div>
                      <div className="text-sm">{choice.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
              <div className="text-2xl font-bold text-foreground">
                {getFinalMessage()}
              </div>
              <div className="text-muted-foreground">
                Final Score: You {scores.player} - {scores.computer} Computer
              </div>
              <Button
                onClick={resetGame}
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
            onClick={resetGame}
            variant="outline"
            className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset Game
          </Button>
        </div>

        {/* Instructions */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent">Game Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Rock beats Scissors</p>
            <p>• Scissors beats Paper</p>
            <p>• Paper beats Rock</p>
            <p>• First to win 3 out of 5 rounds wins the match</p>
            <p>• Choose your move and see if you can beat the computer!</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}