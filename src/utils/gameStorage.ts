interface PlayerData {
  username: string;
  scores: {
    snake: number;
    tetris: number;
    memory: number;
    tictactoe: number;
    rps: number;
  };
  gamesPlayed: number;
  totalScore: number;
  joinDate: string;
}

const DEFAULT_PLAYER: PlayerData = {
  username: "Player" + Math.floor(Math.random() * 10000),
  scores: {
    snake: 0,
    tetris: 0,
    memory: 0,
    tictactoe: 0,
    rps: 0
  },
  gamesPlayed: 0,
  totalScore: 0,
  joinDate: new Date().toLocaleDateString()
};

export const getPlayerData = (): PlayerData => {
  const stored = localStorage.getItem('gamePlayerData');
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_PLAYER;
};

export const updatePlayerData = (updates: Partial<PlayerData>) => {
  const current = getPlayerData();
  const updated = { ...current, ...updates };
  localStorage.setItem('gamePlayerData', JSON.stringify(updated));
  return updated;
};

export const updateScore = (game: keyof PlayerData['scores'], score: number) => {
  const current = getPlayerData();
  const currentBest = current.scores[game];
  
  if (score > currentBest) {
    current.scores[game] = score;
    current.totalScore = Object.values(current.scores).reduce((a, b) => a + b, 0);
  }
  
  current.gamesPlayed++;
  localStorage.setItem('gamePlayerData', JSON.stringify(current));
  
  // Update leaderboard
  updateLeaderboard(current);
  return current;
};

interface LeaderboardEntry {
  username: string;
  totalScore: number;
  gamesPlayed: number;
  bestScores: PlayerData['scores'];
}

export const updateLeaderboard = (playerData: PlayerData) => {
  const leaderboard = getLeaderboard();
  const existingIndex = leaderboard.findIndex(entry => entry.username === playerData.username);
  
  const entry: LeaderboardEntry = {
    username: playerData.username,
    totalScore: playerData.totalScore,
    gamesPlayed: playerData.gamesPlayed,
    bestScores: playerData.scores
  };
  
  if (existingIndex >= 0) {
    leaderboard[existingIndex] = entry;
  } else {
    leaderboard.push(entry);
  }
  
  // Sort by total score
  leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  
  // Keep only top 100
  const top100 = leaderboard.slice(0, 100);
  localStorage.setItem('gameLeaderboard', JSON.stringify(top100));
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const stored = localStorage.getItem('gameLeaderboard');
  return stored ? JSON.parse(stored) : [];
};
