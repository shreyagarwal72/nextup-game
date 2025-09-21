import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Gamepad2, 
  Trophy, 
  User, 
  Settings, 
  Home,
  Puzzle,
  Zap,
  Target,
  Brain,
  Dices,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const games = [
  { name: "Snake", path: "/snake", icon: Zap },
  { name: "Tetris", path: "/tetris", icon: Puzzle },
  { name: "Tic Tac Toe", path: "/tictactoe", icon: Target },
  { name: "Memory", path: "/memory", icon: Brain },
  { name: "Rock Paper Scissors", path: "/rps", icon: Dices },
];

const navigation = [
  { name: "Home", path: "/", icon: Home },
  { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function GameSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-gaming-card text-gaming-accent hover:bg-gaming-accent hover:text-gaming-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full w-64 bg-gaming-dark border-r border-gaming-accent/20
        transform transition-transform duration-300 z-50 gaming-slide-in
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Gamepad2 className="h-8 w-8 text-gaming-accent gaming-glow" />
            <h1 className="text-2xl font-bold text-gaming-accent gaming-glow font-orbitron">
              GameZone
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Navigation
            </h2>
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gaming-accent text-gaming-card shadow-gaming font-semibold'
                      : 'text-foreground hover:bg-gaming-accent/10 hover:text-gaming-accent hover:translate-x-1'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Games */}
          <nav className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Games
            </h2>
            {games.map((game) => (
              <NavLink
                key={game.path}
                to={game.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gaming-accent text-gaming-card shadow-gaming font-semibold'
                      : 'text-foreground hover:bg-gaming-accent/10 hover:text-gaming-accent hover:translate-x-1'
                  }`
                }
              >
                <game.icon className="h-5 w-5" />
                <span>{game.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}