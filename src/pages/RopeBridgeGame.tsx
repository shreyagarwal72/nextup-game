import { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RotateCcw, Trophy, AlertTriangle } from "lucide-react";
import { saveGameScore } from "@/utils/gameStorage";

export default function RopeBridgeGame() {
  const [gameState, setGameState] = useState<"waiting" | "crossing" | "result">("waiting");
  const [stepInput, setStepInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [safePattern, setSafePattern] = useState<number[]>([]);
  const [patternIndex, setPatternIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [bridgeSteps, setBridgeSteps] = useState<("safe" | "broken" | "unknown")[]>([]);

  // Generate random safe pattern
  const generatePattern = () => {
    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(Math.floor(Math.random() * 5) + 1);
    }
    setSafePattern(pattern);
    setPatternIndex(0);
    setBridgeSteps(new Array(5).fill("unknown"));
  };

  useEffect(() => {
    generatePattern();
  }, []);

  const startGame = () => {
    setGameState("crossing");
    setCurrentStep(0);
    setStepInput("");
    generatePattern();
  };

  const crossStep = () => {
    const step = parseInt(stepInput);
    
    if (!step || step < 1 || step > 5) {
      return;
    }

    const safeStep = safePattern[patternIndex];
    setAttempts(attempts + 1);

    // Update bridge visualization
    const newBridgeSteps = [...bridgeSteps];
    
    if (step === safeStep) {
      // Safe step
      newBridgeSteps[currentStep] = "safe";
      setBridgeSteps(newBridgeSteps);
      
      if (currentStep === 4) {
        // Made it across!
        setIsSuccess(true);
        setGameState("result");
        setScore(score + 1);
        saveGameScore("Rope Bridge", score + 1);
      } else {
        setCurrentStep(currentStep + 1);
        setPatternIndex((patternIndex + 1) % safePattern.length);
      }
    } else {
      // Wrong step - bridge breaks
      newBridgeSteps[currentStep] = "broken";
      setBridgeSteps(newBridgeSteps);
      setIsSuccess(false);
      setGameState("result");
    }
    
    setStepInput("");
  };

  const resetGame = () => {
    setGameState("waiting");
    setCurrentStep(0);
    setStepInput("");
    setIsSuccess(false);
    generatePattern();
  };

  const resetAll = () => {
    resetGame();
    setScore(0);
    setAttempts(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      crossStep();
    }
  };

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Rope Bridge Challenge</h1>
          <p className="text-muted-foreground">Navigate the dangerous bridge by choosing safe steps!</p>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{score}</div>
              <div className="text-sm text-muted-foreground">Successful Crossings</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{attempts}</div>
              <div className="text-sm text-muted-foreground">Total Attempts</div>
            </CardContent>
          </Card>
        </div>

        {/* Game State: Waiting */}
        {gameState === "waiting" && (
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🌉</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Cross the Bridge?</h2>
              <p className="text-muted-foreground mb-6">
                The old rope bridge has 5 sections, but only certain steps are safe. 
                Choose wisely or the bridge will collapse!
              </p>
              <Button
                onClick={startGame}
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card text-lg px-8 py-3"
              >
                Start Crossing
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Game State: Crossing */}
        {gameState === "crossing" && (
          <>
            {/* Bridge Visualization */}
            <Card className="bg-gaming-card border-gaming-accent/20">
              <CardHeader>
                <CardTitle className="text-gaming-accent text-center">The Rope Bridge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center space-x-4 mb-6">
                  <div className="text-4xl">🏔️</div>
                  {bridgeSteps.map((stepState, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl transition-all duration-500 ${
                        index === currentStep 
                          ? "border-gaming-accent bg-gaming-accent/20 gaming-pulse" 
                          : stepState === "safe"
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : stepState === "broken"
                          ? "border-red-500 bg-red-500/20 text-red-400"
                          : "border-gray-600 bg-gray-800"
                      }`}>
                        {stepState === "safe" ? "✅" : 
                         stepState === "broken" ? "💥" :
                         index === currentStep ? "👤" : "❓"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Step {index + 1}
                      </div>
                    </div>
                  ))}
                  <div className="text-4xl">🏔️</div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-lg text-foreground mb-2">
                    Step {currentStep + 1} of 5
                  </div>
                  <div className="text-muted-foreground">
                    Choose a safe plank number (1-5)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step Input */}
            <Card className="bg-gaming-card border-gaming-accent/20">
              <CardContent className="p-6">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-center">
                    <label className="text-gaming-accent font-semibold">
                      Which plank will you step on? (1-5)
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={stepInput}
                      onChange={(e) => setStepInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter 1-5"
                      className="text-center text-lg border-gaming-accent/50 focus:border-gaming-accent"
                    />
                    <Button
                      onClick={crossStep}
                      disabled={!stepInput || parseInt(stepInput) < 1 || parseInt(stepInput) > 5}
                      className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card px-8"
                    >
                      Step!
                    </Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    💡 Tip: Some steps are safer than others. Trust your instincts!
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Game State: Result */}
        {gameState === "result" && (
          <Card className={`border-2 ${isSuccess ? 'border-green-500/50 bg-green-950/20' : 'border-red-500/50 bg-red-950/20'}`}>
            <CardHeader>
              <CardTitle className="text-center">
                {isSuccess ? (
                  <span className="text-green-400">🎉 You Made It Across!</span>
                ) : (
                  <span className="text-red-400">💥 Bridge Collapsed!</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl gaming-scale-in">
                {isSuccess ? "🎉" : "😵"}
              </div>
              <div className="space-y-2">
                <div className="text-lg">
                  {isSuccess ? (
                    <span className="text-green-400">
                      Congratulations! You successfully navigated all 5 steps of the treacherous bridge!
                    </span>
                  ) : (
                    <span className="text-red-400">
                      Oh no! You stepped on a weak plank and the bridge gave way. Better luck next time!
                    </span>
                  )}
                </div>
                {isSuccess && (
                  <div className="text-gaming-accent font-semibold">
                    +1 Point! 🏆
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Made it to step: {currentStep + 1}/5
                </div>
              </div>
              <Button
                onClick={resetGame}
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
              >
                Try Again
              </Button>
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
            <p>• Cross the dangerous rope bridge by choosing safe planks</p>
            <p>• Each step has 5 planks numbered 1-5</p>
            <p>• Only one plank per step is safe to step on</p>
            <p>• Choose the wrong plank and the bridge collapses!</p>
            <p>• Make it across all 5 steps to score a point</p>
            <p>• The safe pattern changes each game</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}