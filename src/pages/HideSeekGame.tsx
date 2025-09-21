import { useState } from "react";
import GameLayout from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Eye, EyeOff, Trophy } from "lucide-react";
import { saveGameScore } from "@/utils/gameStorage";

export default function HideSeekGame() {
  const [gameState, setGameState] = useState<"waiting" | "hiding" | "result">("waiting");
  const [isFound, setIsFound] = useState(false);
  const [hidingSpot, setHidingSpot] = useState<string>("");
  const [seekerProgress, setSeekerProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  const hidingSpots = [
    { id: "closet", name: "In the Closet", emoji: "🚪", safety: 70 },
    { id: "bed", name: "Under the Bed", emoji: "🛏️", safety: 60 },
    { id: "curtains", name: "Behind Curtains", emoji: "🪟", safety: 50 },
    { id: "kitchen", name: "Kitchen Cabinet", emoji: "🏠", safety: 80 },
    { id: "attic", name: "In the Attic", emoji: "🏚️", safety: 90 },
    { id: "basement", name: "In the Basement", emoji: "🔦", safety: 85 },
    { id: "tree", name: "Behind a Tree", emoji: "🌳", safety: 45 },
    { id: "car", name: "In the Car", emoji: "🚗", safety: 75 }
  ];

  const startHiding = (spot: string) => {
    const selectedSpot = hidingSpots.find(s => s.id === spot);
    if (!selectedSpot) return;

    setHidingSpot(spot);
    setGameState("hiding");
    setSeekerProgress(0);

    // Simulate seeker searching
    const searchInterval = setInterval(() => {
      setSeekerProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        if (newProgress >= 100) {
          clearInterval(searchInterval);
          
          // Determine if found based on hiding spot safety
          const foundChance = 100 - selectedSpot.safety;
          const found = Math.random() * 100 < foundChance;
          
          setIsFound(found);
          setGameState("result");
          setGamesPlayed(gamesPlayed + 1);
          
          if (!found) {
            setScore(score + 1);
            saveGameScore("Hide and Seek", score + 1);
          }
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  const resetGame = () => {
    setGameState("waiting");
    setIsFound(false);
    setHidingSpot("");
    setSeekerProgress(0);
  };

  const resetAll = () => {
    resetGame();
    setScore(0);
    setGamesPlayed(0);
  };

  const getHidingSpotById = (id: string) => {
    return hidingSpots.find(spot => spot.id === id);
  };

  return (
    <GameLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Hide and Seek</h1>
          <p className="text-muted-foreground">Choose your hiding spot carefully!</p>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <EyeOff className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{score}</div>
              <div className="text-sm text-muted-foreground">Successful Hides</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <div className="text-gaming-accent mb-2 flex justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-gaming-accent">{gamesPlayed}</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </CardContent>
          </Card>
        </div>

        {/* Game State: Waiting */}
        {gameState === "waiting" && (
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-gaming-accent text-center">Choose Your Hiding Spot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hidingSpots.map((spot) => (
                  <Button
                    key={spot.id}
                    onClick={() => startHiding(spot.id)}
                    variant="outline"
                    className="h-24 flex flex-col border-gaming-accent/50 hover:border-gaming-accent hover:bg-gaming-accent/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-3xl mb-2">{spot.emoji}</div>
                    <div className="text-sm text-center">{spot.name}</div>
                    <div className="text-xs text-gaming-accent mt-1">
                      Safety: {spot.safety}%
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game State: Hiding */}
        {gameState === "hiding" && (
          <Card className="bg-gaming-card border-gaming-accent/20">
            <CardHeader>
              <CardTitle className="text-gaming-accent text-center flex items-center justify-center gap-2">
                <EyeOff className="h-6 w-6" />
                You're hiding {getHidingSpotById(hidingSpot)?.name}...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4 gaming-float">
                  {getHidingSpotById(hidingSpot)?.emoji}
                </div>
                <div className="text-lg text-muted-foreground">
                  The seeker is looking for you...
                </div>
              </div>
              
              {/* Search Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seeker Progress</span>
                  <span className="text-gaming-accent">{Math.round(seekerProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gaming-accent h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${seekerProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                🤫 Stay quiet and hope they don't find you!
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game State: Result */}
        {gameState === "result" && (
          <Card className={`border-2 ${isFound ? 'border-red-500/50 bg-red-950/20' : 'border-green-500/50 bg-green-950/20'}`}>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                {isFound ? (
                  <>
                    <Eye className="h-6 w-6 text-red-400" />
                    <span className="text-red-400">You Were Found!</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-6 w-6 text-green-400" />
                    <span className="text-green-400">You Stayed Hidden!</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl gaming-scale-in">
                {isFound ? "😢" : "🎉"}
              </div>
              <div className="space-y-2">
                <div className="text-lg">
                  {isFound ? (
                    <span className="text-red-400">
                      Better luck next time! The seeker found you hiding {getHidingSpotById(hidingSpot)?.name}.
                    </span>
                  ) : (
                    <span className="text-green-400">
                      Great job! You successfully hid {getHidingSpotById(hidingSpot)?.name} and weren't found!
                    </span>
                  )}
                </div>
                {!isFound && (
                  <div className="text-gaming-accent font-semibold">
                    +1 Point! 🏆
                  </div>
                )}
              </div>
              <Button
                onClick={resetGame}
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card"
              >
                Hide Again
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
            <p>• Choose a hiding spot from the available options</p>
            <p>• Each hiding spot has a different safety percentage</p>
            <p>• Higher safety means less chance of being found</p>
            <p>• Watch the seeker's progress bar as they search</p>
            <p>• Score points for each successful hide!</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}