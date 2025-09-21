import GameLayout from "@/components/GameLayout";
import GameCard from "@/components/GameCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Puzzle, 
  Target, 
  Brain, 
  Dices, 
  Trophy,
  Users,
  Clock,
  Star
} from "lucide-react";

const Index = () => {
  const featuredGames = [
    {
      title: "Snake",
      description: "Classic snake game with modern graphics. Eat food, grow longer, and avoid hitting yourself!",
      icon: <Zap className="h-8 w-8" />,
      path: "/snake",
      difficulty: "Easy" as const,
      players: "1 Player"
    },
    {
      title: "Tetris", 
      description: "The legendary puzzle game. Arrange falling blocks to clear lines and achieve high scores!",
      icon: <Puzzle className="h-8 w-8" />,
      path: "/tetris",
      difficulty: "Medium" as const,
      players: "1 Player"
    },
    {
      title: "Tic Tac Toe",
      description: "Strategic 3x3 grid game. Be the first to get three in a row to win!",
      icon: <Target className="h-8 w-8" />,
      path: "/tictactoe", 
      difficulty: "Easy" as const,
      players: "2 Players"
    },
    {
      title: "Memory Game",
      description: "Test your memory by matching pairs of cards. How fast can you clear the board?",
      icon: <Brain className="h-8 w-8" />,
      path: "/memory",
      difficulty: "Medium" as const,
      players: "1 Player"
    },
    {
      title: "Rock Paper Scissors",
      description: "The classic hand game against AI. Best of 5 rounds wins the match!",
      icon: <Dices className="h-8 w-8" />,
      path: "/rps",
      difficulty: "Easy" as const,
      players: "1 vs AI"
    }
  ];

  const stats = [
    { label: "Total Games", value: "5", icon: <Puzzle className="h-5 w-5" /> },
    { label: "Active Players", value: "1,247", icon: <Users className="h-5 w-5" /> },
    { label: "Games Played", value: "15,832", icon: <Trophy className="h-5 w-5" /> },
    { label: "Avg Session", value: "12m", icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <GameLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center py-12 gaming-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 gaming-glow font-orbitron">
            Game<span className="text-gaming-accent">Zone</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the ultimate collection of classic games with modern design. 
            Challenge yourself and compete with players worldwide!
          </p>
          <Button 
            size="lg" 
            className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-card font-semibold px-8 py-3 text-lg shadow-gaming hover:shadow-gaming-hover transition-all duration-300"
          >
            <Star className="h-5 w-5 mr-2" />
            Start Playing Now
          </Button>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gaming-card border-gaming-accent/20 text-center gaming-fade-in hover:shadow-gaming-card transition-all duration-300">
              <CardContent className="p-4">
                <div className="text-gaming-accent mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Featured Games */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-gaming-accent" />
            <h2 className="text-3xl font-bold text-foreground">Featured Games</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((game, index) => (
              <GameCard
                key={index}
                title={game.title}
                description={game.description}
                icon={game.icon}
                path={game.path}
                difficulty={game.difficulty}
                players={game.players}
              />
            ))}
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="bg-gaming-card rounded-xl p-8 border border-gaming-accent/20">
          <h3 className="text-2xl font-bold text-foreground mb-4">How to Get Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-gaming-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gaming-card font-bold">1</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Choose a Game</h4>
              <p className="text-muted-foreground text-sm">Select from our collection of classic games</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gaming-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gaming-card font-bold">2</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Start Playing</h4>
              <p className="text-muted-foreground text-sm">Jump right in - no registration required</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gaming-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gaming-card font-bold">3</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Beat Your Score</h4>
              <p className="text-muted-foreground text-sm">Challenge yourself to reach new high scores</p>
            </div>
          </div>
        </section>

        {/* Copyright Footer */}
        <footer className="text-center py-8 border-t border-gaming-accent/20">
          <p className="text-muted-foreground">
            © 2025 Copyright Nextup Studio. All rights reserved.
          </p>
        </footer>
      </div>
    </GameLayout>
  );
};

export default Index;
