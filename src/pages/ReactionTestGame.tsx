import { useState, useEffect, useRef } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Zap, Trophy, Clock } from "lucide-react";
import { saveGameScore } from "@/utils/gameStorage";

interface ReactionTime {
  time: number;
  timestamp: Date;
}

export default function ReactionTestGame() {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "result" | "tooearly">("waiting");
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<ReactionTime[]>([]);
  const [bestTime, setBestTime] = useState<number>(0);
  const [attempts, setAttempts] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  // Load best time from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reactionTestBest");
    if (saved) {
      setBestTime(parseFloat(saved));
    }
  }, []);

  const startTest = () => {
    setGameState("ready");
    
    // Random delay between 2-6 seconds
    const delay = Math.random() * 4000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState("go");
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState("tooearly");
    } else if (gameState === "go") {
      // Calculate reaction time
      const endTime = performance.now();
      const reaction = endTime - startTimeRef.current;
      
      setReactionTime(reaction);
      setAttempts(attempts + 1);
      
      // Add to history
      const newReaction: ReactionTime = {
        time: reaction,
        timestamp: new Date()
      };
      const newTimes = [...reactionTimes, newReaction].slice(-10); // Keep last 10
      setReactionTimes(newTimes);
      
      // Update best time
      if (bestTime === 0 || reaction < bestTime) {
        setBestTime(reaction);
        localStorage.setItem("reactionTestBest", reaction.toString());
      }
      
      // Save score (higher score for faster reaction)
      const score = Math.max(0, Math.round(1000 - reaction));
      saveGameScore("Reaction Test", score);
      
      setGameState("result");
    }
  };

  const resetTest = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setGameState("waiting");
    setReactionTime(0);
  };

  const resetAll = () => {
    resetTest();
    setReactionTimes([]);
    setBestTime(0);
    setAttempts(0);
    localStorage.removeItem("reactionTestBest");
  };

  const getAverageTime = () => {
    if (reactionTimes.length === 0) return 0;
    const sum = reactionTimes.reduce((acc, rt) => acc + rt.time, 0);
    return sum / reactionTimes.length;
  };

  const getPerformanceRating = (time: number) => {
    if (time < 200) return { rating: "Superhuman! ⚡", color: "text-yellow-400" };
    if (time < 250) return { rating: "Excellent! 🌟", color: "text-green-400" };
    if (time < 300) return { rating: "Very Good! 👍", color: "text-blue-400" };
    if (time < 400) return { rating: "Good! 👌", color: "text-cyan-400" };
    if (time < 500) return { rating: "Average 🙂", color: "text-yellow-300" };
    return { rating: "Keep Practicing! 💪", color: "text-orange-400" };
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Reaction Time Test</h1>
          <p className="text-muted-foreground">Test how fast your reflexes are!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-lg font-bold text-gaming-accent">
                {reactionTime > 0 ? `${reactionTime.toFixed(0)}ms` : "--"}
              </div>
              <div className="text-sm text-muted-foreground">Last Time</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-lg font-bold text-gaming-accent">
                {bestTime > 0 ? `${bestTime.toFixed(0)}ms` : "--"}
              </div>
              <div className="text-sm text-muted-foreground">Best Time</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-lg font-bold text-gaming-accent">
                {reactionTimes.length > 0 ? `${getAverageTime().toFixed(0)}ms` : "--"}
              </div>
              <div className="text-sm text-muted-foreground">Average</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-lg font-bold text-gaming-accent">{attempts}</div>
              <div className="text-sm text-muted-foreground">Attempts</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-8">
            {/* Waiting State */}
            {gameState === "waiting" && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-2xl font-bold text-foreground">Ready to Test Your Reflexes?</h2>
                <p className="text-muted-foreground">
                  Click the button when it turns green. But don't click too early!
                </p>
                <Button
                  onClick={startTest}
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card text-lg px-8 py-4"
                >
                  Start Test
                </Button>
              </div>
            )}

            {/* Ready State */}
            {gameState === "ready" && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🔴</div>
                <h2 className="text-2xl font-bold text-red-400">Wait for it...</h2>
                <Button
                  onClick={handleClick}
                  className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-8 cursor-wait"
                  disabled={false}
                >
                  Wait for Green!
                </Button>
                <p className="text-muted-foreground">
                  Don't click yet! Wait for the button to turn green.
                </p>
              </div>
            )}

            {/* Go State */}
            {gameState === "go" && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4 gaming-pulse">🟢</div>
                <h2 className="text-2xl font-bold text-green-400">CLICK NOW!</h2>
                <Button
                  onClick={handleClick}
                  className="bg-green-600 hover:bg-green-700 text-white text-xl px-12 py-8 gaming-pulse"
                >
                  CLICK ME!
                </Button>
                <p className="text-green-400 font-semibold">
                  Click as fast as you can!
                </p>
              </div>
            )}

            {/* Too Early State */}
            {gameState === "tooearly" && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">😅</div>
                <h2 className="text-2xl font-bold text-orange-400">Too Early!</h2>
                <p className="text-muted-foreground">
                  You clicked before the button turned green. Try to wait next time!
                </p>
                <Button
                  onClick={resetTest}
                  className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Result State */}
            {gameState === "result" && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4 gaming-scale-in">⚡</div>
                <h2 className="text-2xl font-bold text-gaming-accent">
                  {reactionTime.toFixed(0)} milliseconds
                </h2>
                <div className={`text-lg font-semibold ${getPerformanceRating(reactionTime).color}`}>
                  {getPerformanceRating(reactionTime).rating}
                </div>
                {reactionTime === bestTime && bestTime > 0 && (
                  <div className="text-yellow-400 font-semibold gaming-glow">
                    🎉 New Personal Best!
                  </div>
                )}
                <div className="space-y-2">
                  <Button
                    onClick={resetTest}
                    className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card mr-4"
                  >
                    Test Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        {reactionTimes.length > 0 && (
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-gaming-accent">Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {reactionTimes.slice(-10).reverse().map((rt, index) => (
                  <div
                    key={index}
                    className="text-center p-2 border border-gaming-accent/30 rounded"
                  >
                    <div className="text-sm font-semibold text-gaming-accent">
                      {rt.time.toFixed(0)}ms
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
            <p>• Click "Start Test" to begin</p>
            <p>• Wait for the red button to turn green</p>
            <p>• Click as fast as possible when you see green</p>
            <p>• Don't click too early or you'll have to restart</p>
            <p>• Try to beat your personal best time!</p>
            <p>• Average human reaction time is around 250ms</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}