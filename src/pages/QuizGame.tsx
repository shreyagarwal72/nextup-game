import { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Trophy, Clock, Brain } from "lucide-react";
import { saveGameScore } from "@/utils/gameStorage";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const quizData: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: "Blue Whale"
  },
  {
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    answer: "1945"
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "San Marino", "Vatican City", "Luxembourg"],
    answer: "Vatican City"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Iron"],
    answer: "Oxygen"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    answer: "Leonardo da Vinci"
  },
  {
    question: "What is the longest river in the world?",
    options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"],
    answer: "Nile River"
  }
];

export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, showResult]);

  const startGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer("");
    setShowResult(false);
    setGameComplete(false);
    setTimeLeft(30);
    setIsActive(true);
  };

  const handleTimeUp = () => {
    setSelectedAnswer("");
    setShowResult(true);
    setIsActive(false);
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleAnswerClick = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setIsActive(false);
    
    if (answer === quizData[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowResult(false);
      setTimeLeft(30);
      setIsActive(true);
    } else {
      setGameComplete(true);
      setIsActive(false);
      saveGameScore("Quiz Game", score);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option 
        ? "bg-gaming-accent/20 border-gaming-accent" 
        : "border-gaming-accent/50 hover:border-gaming-accent hover:bg-gaming-accent/10";
    }
    
    if (option === quizData[currentQuestion].answer) {
      return "bg-green-500/20 border-green-500 text-green-400";
    }
    
    if (selectedAnswer === option && option !== quizData[currentQuestion].answer) {
      return "bg-red-500/20 border-red-500 text-red-400";
    }
    
    return "border-gaming-accent/30 opacity-50";
  };

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Quiz Challenge</h1>
          <p className="text-muted-foreground">Test your knowledge across various topics!</p>
        </div>

        {!isActive && !gameComplete && (
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardContent className="p-8 text-center">
              <Brain className="h-16 w-16 text-gaming-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Test Your Knowledge?</h2>
              <p className="text-muted-foreground mb-6">Answer {quizData.length} questions correctly. You have 30 seconds per question!</p>
              <Button
                onClick={startGame}
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card text-lg px-8 py-3"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {isActive && !gameComplete && (
          <>
            {/* Progress & Timer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gaming-card border-gaming-accent/20 text-center">
                <CardContent className="p-4">
                  <div className="text-gaming-accent mb-2 flex justify-center">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-gaming-accent">{currentQuestion + 1}</div>
                  <div className="text-sm text-muted-foreground">of {quizData.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-gaming-card border-gaming-accent/20 text-center">
                <CardContent className="p-4">
                  <div className="text-gaming-accent mb-2 flex justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-gaming-accent'}`}>
                    {timeLeft}s
                  </div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </CardContent>
              </Card>
              <Card className="bg-gaming-card border-gaming-accent/20 text-center">
                <CardContent className="p-4">
                  <div className="text-gaming-accent mb-2 flex justify-center">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-gaming-accent">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Question */}
            <Card className="bg-gaming-card border-gaming-accent/20">
              <CardHeader>
                <CardTitle className="text-gaming-accent text-xl">
                  {quizData[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quizData[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    disabled={showResult}
                    variant="outline"
                    className={`w-full h-14 text-left justify-start text-lg transition-all duration-300 ${getOptionStyle(option)}`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Timer Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gaming-accent h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <Card className="bg-gaming-card border-gaming-accent/50 shadow-gaming-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-gaming-accent flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6" />
                Quiz Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">{score}/{quizData.length}</div>
                <div className="text-lg text-muted-foreground">
                  {score === quizData.length ? "Perfect Score! 🎉" :
                   score >= quizData.length * 0.8 ? "Excellent! 🌟" :
                   score >= quizData.length * 0.6 ? "Good Job! 👍" :
                   score >= quizData.length * 0.4 ? "Not Bad! 👌" : "Keep Practicing! 💪"}
                </div>
                <div className="text-gaming-accent">
                  Score: {Math.round((score / quizData.length) * 100)}%
                </div>
              </div>
              <Button
                onClick={startGame}
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
              >
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        {(isActive || gameComplete) && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={startGame}
              variant="outline"
              className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Restart Quiz
            </Button>
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Answer all {quizData.length} questions to complete the quiz</p>
            <p>• You have 30 seconds to answer each question</p>
            <p>• Click on your chosen answer before time runs out</p>
            <p>• Green answers are correct, red answers are wrong</p>
            <p>• Try to get the highest score possible!</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}