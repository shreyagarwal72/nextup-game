interface PlayerData {
  username: string;
  scores: {
    snake: number;
    tetris: number;
    memory: number;
    tictactoe: number;
    rps: number;
    quiz: number;
    hideseek: number;
    ropebridge: number;
    reaction: number;
    crossroad: number;
  };
  gamesPlayed: number;
  totalScore: number;
  joinDate: string;
}

interface LeaderboardEntry {
  playerName: string;
  score: number;
  gameName: string;
  date: string;
}

const DEFAULT_PLAYER: PlayerData = {
  username: "Player" + Math.floor(Math.random() * 10000),
  scores: {
    snake: 0,
    tetris: 0,
    memory: 0,
    tictactoe: 0,
    rps: 0,
    quiz: 0,
    hideseek: 0,
    ropebridge: 0,
    reaction: 0,
    crossroad: 0
  },
  gamesPlayed: 0,
  totalScore: 0,
  joinDate: new Date().toLocaleDateString()
};

const PLAYER_DATA_KEY = 'gamePlayerData';
const LEADERBOARD_KEY = 'gameLeaderboard';

export const getUserData = (): PlayerData => {
  const stored = localStorage.getItem(PLAYER_DATA_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure all new score fields exist
      return {
        ...DEFAULT_PLAYER,
        ...parsed,
        scores: {
          ...DEFAULT_PLAYER.scores,
          ...parsed.scores
        }
      };
    } catch {
      return DEFAULT_PLAYER;
    }
  }
  return DEFAULT_PLAYER;
};

export const updateUserData = (updates: Partial<PlayerData>) => {
  const current = getUserData();
  const updated = { ...current, ...updates };
  localStorage.setItem(PLAYER_DATA_KEY, JSON.stringify(updated));
  return updated;
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const updateLeaderboard = (gameName: string, score: number, username?: string) => {
  const leaderboard = getLeaderboard();
  const playerName = username || getUserData().username || "Anonymous";
  
  const entry: LeaderboardEntry = {
    playerName,
    score,
    gameName,
    date: new Date().toISOString(),
  };

  leaderboard.push(entry);
  
  // Sort by score (highest first) and keep top 100
  leaderboard.sort((a, b) => b.score - a.score);
  const topEntries = leaderboard.slice(0, 100);
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
  return topEntries;
};

export const saveGameScore = (gameName: string, score: number, username?: string) => {
  updateLeaderboard(gameName, score, username);
  
  // Also update player's personal best
  const gameKey = gameName.toLowerCase().replace(/\s+/g, '') as keyof PlayerData['scores'];
  const userData = getUserData();
  
  if (userData.scores.hasOwnProperty(gameKey)) {
    const currentBest = userData.scores[gameKey];
    if (score > currentBest) {
      userData.scores[gameKey] = score;
      userData.totalScore = Object.values(userData.scores).reduce((a, b) => a + b, 0);
      updateUserData(userData);
    }
  }
  
  userData.gamesPlayed++;
  updateUserData(userData);
};

// Legacy function names for compatibility
export const getPlayerData = getUserData;
export const updatePlayerData = updateUserData;

export const updateScore = (game: keyof PlayerData['scores'], score: number) => {
  const current = getUserData();
  const currentBest = current.scores[game];
  
  if (score > currentBest) {
    current.scores[game] = score;
    current.totalScore = Object.values(current.scores).reduce((a, b) => a + b, 0);
  }
  
  current.gamesPlayed++;
  updateUserData(current);
  return current;
};
