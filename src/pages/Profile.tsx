import GameLayout from "@/components/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getPlayerData, updatePlayerData } from "@/utils/gameStorage";
import { 
  User, 
  Trophy, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Brain, 
  Puzzle, 
  Dices,
  Star,
  Award,
  TrendingUp,
  Edit,
  Check,
  X
} from "lucide-react";

export default function Profile() {
  const [playerData, setPlayerData] = useState(getPlayerData());
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(playerData.username);

  useEffect(() => {
    setPlayerData(getPlayerData());
  }, []);

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    setNewUsername(playerData.username);
  };

  const handleUsernameSave = () => {
    if (newUsername.trim()) {
      const updated = updatePlayerData({ username: newUsername.trim() });
      setPlayerData(updated);
      setIsEditingUsername(false);
    }
  };

  const handleUsernameCancel = () => {
    setNewUsername(playerData.username);
    setIsEditingUsername(false);
  };

  const winRate = playerData.gamesPlayed > 0 ? Math.round((playerData.totalScore / (playerData.gamesPlayed * 100)) * 100) : 0;
  const level = Math.floor(playerData.totalScore / 1000) + 1;
  const experience = playerData.totalScore % 1000;
  const nextLevelExp = 1000;

  const gameStats = [
    {
      game: "Snake",
      icon: <Zap className="h-5 w-5" />,
      highScore: playerData.scores.snake,
      gamesPlayed: Math.floor(playerData.gamesPlayed * 0.3),
      winRate: 73,
      averageScore: Math.floor(playerData.scores.snake * 0.7),
      rank: 1,
      badge: playerData.scores.snake > 2000 ? "Champion" : playerData.scores.snake > 1000 ? "Pro" : "Beginner"
    },
    {
      game: "Memory",
      icon: <Brain className="h-5 w-5" />,
      highScore: playerData.scores.memory || 0,
      gamesPlayed: Math.floor(playerData.gamesPlayed * 0.2),
      winRate: 68,
      averageScore: Math.floor((playerData.scores.memory || 0) * 1.2),
      rank: 3,
      badge: (playerData.scores.memory || 0) > 50 ? "Expert" : (playerData.scores.memory || 0) > 20 ? "Good" : "Beginner",
      unit: "sec"
    },
    {
      game: "Tic Tac Toe",
      icon: <Target className="h-5 w-5" />,
      highScore: playerData.scores.tictactoe,
      gamesPlayed: Math.floor(playerData.gamesPlayed * 0.25),
      winRate: 71,
      averageScore: Math.floor(playerData.scores.tictactoe * 0.8),
      rank: 2,
      badge: playerData.scores.tictactoe > 80 ? "Pro" : playerData.scores.tictactoe > 50 ? "Good" : "Beginner",
      unit: "% win"
    },
    {
      game: "Tetris",
      icon: <Puzzle className="h-5 w-5" />,
      highScore: playerData.scores.tetris,
      gamesPlayed: Math.floor(playerData.gamesPlayed * 0.15),
      winRate: 64,
      averageScore: Math.floor(playerData.scores.tetris * 0.6),
      rank: 5,
      badge: playerData.scores.tetris > 100000 ? "Skilled" : playerData.scores.tetris > 50000 ? "Good" : "Beginner"
    },
    {
      game: "Rock Paper Scissors",
      icon: <Dices className="h-5 w-5" />,
      highScore: playerData.scores.rps,
      gamesPlayed: Math.floor(playerData.gamesPlayed * 0.1),
      winRate: 69,
      averageScore: Math.floor(playerData.scores.rps * 0.8),
      rank: 4,
      badge: playerData.scores.rps > 70 ? "Advanced" : playerData.scores.rps > 50 ? "Good" : "Beginner",
      unit: "% win"
    }
  ];

const achievements = [
  { name: "First Victory", description: "Win your first game", earned: true },
  { name: "Hat Trick", description: "Win 3 games in a row", earned: true },
  { name: "Century Club", description: "Play 100 games", earned: true },
  { name: "Snake Master", description: "Score 2000+ in Snake", earned: true },
  { name: "Memory Wizard", description: "Complete Memory game in under 1 minute", earned: true },
  { name: "Speed Demon", description: "Win 10 games in one session", earned: true },
  { name: "Consistent Player", description: "Play games for 7 consecutive days", earned: true },
  { name: "Jack of All Trades", description: "Play all available games", earned: true },
  { name: "Perfectionist", description: "Achieve 100% accuracy in any game", earned: false },
  { name: "Legendary", description: "Reach level 20", earned: false },
  { name: "Marathon Runner", description: "Play for 5+ hours", earned: false },
  { name: "Social Butterfly", description: "Challenge 10 different players", earned: false }
];

  const progressPercent = (experience / nextLevelExp) * 100;

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "Champion": "bg-yellow-500",
      "Pro": "bg-gaming-accent",
      "Expert": "bg-purple-500",
      "Skilled": "bg-green-500",
      "Advanced": "bg-blue-500",
    };
    return colors[badge] || "bg-gaming-accent";
  };

  return (
    <GameLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 gaming-glow">Player Profile</h1>
          <p className="text-muted-foreground">Your gaming journey and achievements</p>
        </div>

        {/* Profile Overview */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src="/api/placeholder/128/128" />
                  <AvatarFallback className="text-4xl bg-gaming-accent text-gaming-card">
                    GM
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {isEditingUsername ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="text-2xl font-bold bg-gaming-darker border-gaming-accent"
                          onKeyDown={(e) => e.key === 'Enter' && handleUsernameSave()}
                        />
                        <Button size="sm" onClick={handleUsernameSave} className="bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleUsernameCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-3xl font-bold text-foreground">{playerData.username}</h2>
                        <Button size="sm" variant="outline" onClick={handleUsernameEdit} className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {playerData.joinDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {Math.floor(playerData.gamesPlayed * 2.5)}h played
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {winRate}% efficiency
                    </div>
                  </div>
                </div>

                {/* Level Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-accent font-semibold">Level {level}</span>
                    <span className="text-muted-foreground text-sm">
                      {experience} / {nextLevelExp} XP
                    </span>
                  </div>
                  <div className="w-full bg-gaming-darker rounded-full h-3">
                    <div 
                      className="bg-gradient-gaming h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-accent">{playerData.gamesPlayed}</div>
                    <div className="text-sm text-muted-foreground">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-accent">{Math.max(0, Math.floor(playerData.gamesPlayed / 5))}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-accent">{Math.floor(level / 2) + 3}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-accent">#{Math.max(1, 101 - playerData.totalScore / 100)}</div>
                    <div className="text-sm text-muted-foreground">Global Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Game Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {gameStats.map((game) => (
                <Card key={game.game} className="bg-gaming-darker border-gaming-accent/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-gaming-accent">
                          {game.icon}
                        </div>
                        <h3 className="font-semibold text-foreground">{game.game}</h3>
                      </div>
                      <Badge className={`${getBadgeColor(game.badge)} text-white`}>
                        {game.badge}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">High Score:</span>
                        <span className="font-semibold text-gaming-accent">
                          {game.highScore.toLocaleString()}
                          {game.unit && <span className="text-xs ml-1">{game.unit}</span>}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Games Played:</span>
                        <span className="font-semibold text-foreground">{game.gamesPlayed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Win Rate:</span>
                        <span className="font-semibold text-foreground">{game.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Global Rank:</span>
                        <span className="font-semibold text-gaming-accent">#{game.rank}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Award className="h-6 w-6" />
              Achievements ({achievements.filter(a => a.earned).length}/{achievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.name}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    achievement.earned
                      ? "bg-gaming-accent/10 border-gaming-accent/50 hover:bg-gaming-accent/20"
                      : "bg-gaming-darker border-gaming-accent/20 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${achievement.earned ? "bg-gaming-accent" : "bg-muted"}`}>
                      {achievement.earned ? (
                        <Star className="h-5 w-5 text-gaming-card" />
                      ) : (
                        <Award className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gaming-card border-gaming-accent/20">
          <CardHeader>
            <CardTitle className="text-gaming-accent flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { game: "Snake", action: "New high score", score: 2840, time: "2 hours ago" },
                { game: "Memory", action: "Completed game", score: 45, time: "5 hours ago", unit: "sec" },
                { game: "Tic Tac Toe", action: "Won against AI", score: null, time: "1 day ago" },
                { game: "Tetris", action: "Level up", score: 156780, time: "2 days ago" },
                { game: "Rock Paper Scissors", action: "Win streak", score: 5, time: "3 days ago", unit: " wins" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gaming-darker rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gaming-accent rounded-full" />
                    <div>
                      <span className="font-semibold text-foreground">{activity.game}</span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span className="text-muted-foreground">{activity.action}</span>
                      {activity.score && (
                        <>
                          <span className="text-muted-foreground mx-2">•</span>
                          <span className="text-gaming-accent font-semibold">
                            {activity.score.toLocaleString()}{activity.unit}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}