import { ReactNode } from "react";
import GameSidebar from "./GameSidebar";
import MusicButton from "./MusicButton";

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background gaming-fade-in">
      <GameSidebar />
      
      <main className="flex-1 lg:ml-0 gaming-fade-in">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
      
      <MusicButton />
    </div>
  );
}