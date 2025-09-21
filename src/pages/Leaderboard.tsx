import GameLayout from "@/components/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Zap, Brain, Target, Puzzle, Dices } from "lucide-react";
import { useEffect, useState } from "react";
import { getLeaderboard, getPlayerData } from "@/utils/gameStorage";

const leaderboardData = [
  {
    game: "Snake",
    icon: <Zap className="h-5 w-5" />,
    scores: [
      { rank: 1, name: "GameMaster2024", score: 2840, badge: "Champion" },
      { rank: 2, name: "SnakeCharmer", score: 2650, badge: "Pro" },
      { rank: 3, name: "RetroGamer", score: 2480, badge: "Expert" },
      { rank: 4, name: "PixelHunter", score: 2290, badge: "Advanced" },
      { rank: 5, name: "ArcadeKing", score: 2150, badge: "Skilled" },
    ]
  },
  {
    game: "Memory",
    icon: <Brain className="h-5 w-5" />,
    scores: [
      { rank: 1, name: "MindReader", score: 45, badge: "Genius", unit: "sec" },
      { rank: 2, name: "BrainPower", score: 52, badge: "Smart", unit: "sec" },
      { rank: 3, name: "QuickThink", score: 58, badge: "Fast", unit: "sec" },
      { rank: 4, name: "MemoryKing", score: 64, badge: "Good", unit: "sec" },
      { rank: 5, name: "PuzzleSolver", score: 71, badge: "Decent", unit: "sec" },
    ]
  },
  {
    game: "Tic Tac Toe",
    icon: <Target className="h-5 w-5" />,
    scores: [
      { rank: 1, name: "StrategyMaster", score: 87, badge: "Tactician", unit: "% win" },
      { rank: 2, name: "LogicLord", score: 84, badge: "Strategic", unit: "% win" },
      { rank: 3, name: "GridGuru", score: 79, badge: "Tactical", unit: "% win" },
      { rank: 4, name: "ThinkFast", score: 76, badge: "Smart", unit: "% win" },
      { rank: 5, name: "PatternPro", score: 72, badge: "Clever", unit: "% win" },
    ]
  },
  {
    game: "Tetris",
    icon: <Puzzle className="h-5 w-5" />,
    scores: [
      { rank: 1, name: "BlockMaster", score: 156780, badge: "Legend" },
      { rank: 2, name: "LineClearer", score: 142350, badge: "Master" },
      { rank: 3, name: "PuzzleWizard", score: 128900, badge: "Expert" },
      { rank: 4, name: "StackAttack", score: 115600, badge: "Pro" },
      { rank: 5, name: "FallingStar", score: 98450, badge: "Skilled" },
    ]
  },
  {
    game: "Rock Paper Scissors",
    icon: <Dices className="h-5 w-5" />,
    scores: [
      { rank: 1, name: "LuckMaster", score: 78, badge: "Psychic", unit: "% win" },
      { rank: 2, name: "RandomKing", score: 74, badge: "Lucky", unit: "% win" },
      { rank: 3, name: "PatternHawk", score: 69, badge: "Intuitive", unit: "% win" },
      { rank: 4, name: "ChoiceChamp", score: 65, badge: "Sharp", unit: "% win" },
      { rank: 5, name: "GuessMaster", score: 61, badge: "Good", unit: "% win" },
    ]
  }
];

const globalLeaders = [
  { rank: 1, name: "GameMaster2024", totalScore: 8950, gamesWon: 342, badge: "Ultimate Champion" },
  { rank: 2, name: "MindReader", totalScore: 8720, gamesWon: 328, badge: "Grand Master" },
  { rank: 3, name: "BlockMaster", totalScore: 8580, gamesWon: 315, badge: "Elite Player" },
  { rank: 4, name: "StrategyMaster", totalScore: 8340, gamesWon: 298, badge: "Master Gamer" },
  { rank: 5, name: "SnakeCharmer", totalScore: 8190, gamesWon: 287, badge: "Pro Gamer" },
];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [playerData] = useState(getPlayerData());

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-gaming-accent" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "Champion": "bg-yellow-500",
      "Ultimate Champion": "bg-gradient-to-r from-yellow-400 to-yellow-600",
      "Grand Master": "bg-gradient-to-r from-purple-400 to-purple-600",
      "Elite Player": "bg-gradient-to-r from-blue-400 to-blue-600",
      "Master Gamer": "bg-gradient-to-r from-green-400 to-green-600",
      "Legend": "bg-gradient-to-r from-red-400 to-red-600",
      "Genius": "bg-purple-500",
      "Tactician": "bg-blue-500",
      "Master": "bg-green-500",
      "Psychic": "bg-pink-500",
      "Pro": "bg-gaming-accent",
    };
    return colors[badge] || "bg-gaming-accent";
  };

  return (
    <GameLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Leaderboards</h1>
          <p className="text-muted-foreground">See how you rank against other players worldwide</p>
        </div>

        {/* Global Leaderboard */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Crown className="h-6 w-6" />
              Global Champions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.slice(0, 10).map((player, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 bg-gaming-darker rounded-lg hover:bg-gaming-accent/10 transition-colors duration-300 ${player.username === playerData.username ? 'ring-2 ring-gaming-accent' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="text-2xl font-bold text-gaming-accent">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{player.username}</div>
                        <div className="text-sm text-muted-foreground">{player.gamesPlayed} games played</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gaming-accent">{player.totalScore.toLocaleString()}</div>
                      <Badge className="bg-gaming-accent text-white">
                        {player.totalScore > 10000 ? "Champion" : player.totalScore > 5000 ? "Pro" : "Player"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No scores yet. Be the first to play and set a record!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game-specific Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {leaderboardData.map((gameData) => (
            <Card key={gameData.game} className="bg-gaming-card border-gaming-accent/20">
              <CardHeader>
                <CardTitle className="text-gaming-accent flex items-center gap-2">
                  {gameData.icon}
                  {gameData.game}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gameData.scores.map((score) => (
                    <div
                      key={score.rank}
                      className="flex items-center justify-between p-3 bg-gaming-darker rounded-lg hover:bg-gaming-accent/10 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getRankIcon(score.rank)}
                          <span className="font-bold text-gaming-accent">#{score.rank}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{score.name}</div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getBadgeColor(score.badge)} text-white border-none`}
                          >
                            {score.badge}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gaming-accent">
                          {score.score.toLocaleString()}
                          {score.unit && <span className="text-xs ml-1">{score.unit}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <Trophy className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gaming-accent">1,247</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <Award className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gaming-accent">15,832</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <Medal className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gaming-accent">342</div>
              <div className="text-sm text-muted-foreground">Champions</div>
            </CardContent>
          </Card>
          <Card className="bg-gaming-card border-gaming-accent/20 text-center">
            <CardContent className="p-4">
              <Crown className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gaming-accent">12m</div>
              <div className="text-sm text-muted-foreground">Avg Session</div>
            </CardContent>
          </Card>
        </div>

        {/* Information */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent">How Rankings Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>• Rankings are updated in real-time based on your best scores</p>
            <p>• Global rankings combine performance across all games</p>
            <p>• Badges are earned based on skill level and consistency</p>
            <p>• Play regularly to maintain your position on the leaderboards</p>
            <p>• New players start with a default ranking and climb through gameplay</p>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}