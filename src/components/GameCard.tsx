import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  players?: string;
}

export default function GameCard({ 
  title, 
  description, 
  icon, 
  path, 
  difficulty = "Medium",
  players = "1 Player"
}: GameCardProps) {
  const difficultyColors = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400"
  };

  return (
    <Link to={path} className="group">
      <Card className="bg-gaming-card border-gaming-accent/20 hover:border-gaming-accent/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-gaming-hover gaming-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gaming-accent group-hover:text-gaming-accent-glow transition-colors duration-300">
              {icon}
            </div>
            <span className={`text-xs font-semibold ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gaming-accent transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{players}</span>
            <span className="text-gaming-accent font-semibold">Play Now →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}