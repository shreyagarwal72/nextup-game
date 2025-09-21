import GameLayout from "@/components/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Edit
} from "lucide-react";

const userStats = {
  name: "GameMaster2024",
  joinDate: "January 2024",
  totalGamesPlayed: 1247,
  totalWins: 834,
  winRate: 67,
  totalTimePlayed: "48h 32m",
  level: 15,
  experience: 2840,
  nextLevelExp: 3000,
  currentStreak: 12,
  longestStreak: 28,
  achievements: 23,
  favoriteGame: "Snake"
};

const gameStats = [
  {
    game: "Snake",
    icon: <Zap className="h-5 w-5" />,
    highScore: 2840,
    gamesPlayed: 342,
    winRate: 73,
    averageScore: 1650,
    rank: 1,
    badge: "Champion"
  },
  {
    game: "Memory",
    icon: <Brain className="h-5 w-5" />,
    highScore: 45,
    gamesPlayed: 198,
    winRate: 68,
    averageScore: 62,
    rank: 3,
    badge: "Expert",
    unit: "sec"
  },
  {
    game: "Tic Tac Toe",
    icon: <Target className="h-5 w-5" />,
    highScore: 87,
    gamesPlayed: 289,
    winRate: 71,
    averageScore: 65,
    rank: 2,
    badge: "Pro",
    unit: "% win"
  },
  {
    game: "Tetris",
    icon: <Puzzle className="h-5 w-5" />,
    highScore: 156780,
    gamesPlayed: 267,
    winRate: 64,
    averageScore: 89650,
    rank: 5,
    badge: "Skilled"
  },
  {
    game: "Rock Paper Scissors",
    icon: <Dices className="h-5 w-5" />,
    highScore: 78,
    gamesPlayed: 151,
    winRate: 69,
    averageScore: 58,
    rank: 4,
    badge: "Advanced",
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

export default function Profile() {
  const progressPercent = (userStats.experience / userStats.nextLevelExp) * 100;

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
                  <h2 className="text-3xl font-bold text-foreground mb-2">{userStats.name}</h2>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {userStats.joinDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {userStats.totalTimePlayed} played
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {userStats.winRate}% win rate
                    </div>
                  </div>
                </div>

                {/* Level Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gaming-accent font-semibold">Level {userStats.level}</span>
                    <span className="text-muted-foreground text-sm">
                      {userStats.experience} / {userStats.nextLevelExp} XP
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
                    <div className="text-2xl font-bold text-gaming-accent">{userStats.totalGamesPlayed}</div>
                    <div className="text-sm text-muted-foreground">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-accent">{userStats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-accent">{userStats.achievements}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-accent">#{Math.floor(Math.random() * 50) + 1}</div>
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