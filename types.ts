
export enum StatType {
  Combat = 'Combat',
  Magic = 'Magic',
  Ranged = 'Ranged',
  Defense = 'Defense'
}

export interface Stats {
  Combat: number;
  Magic: number;
  Ranged: number;
  Defense: number;
}

export interface Player {
  id: string;
  name: string;
  stats: Stats;
  color: string;
  description: string;
}

export interface MatchResult {
  winnerId: string;
  loserId: string;
  attackerRoll: number;
  defenderRoll: number;
  formula: string;
}

export interface WinRateData {
  playerName: string;
  winRate: number;
  totalWins: number;
  totalMatches: number;
}

export interface HeatmapCell {
  attacker: string;
  defender: string;
  winPercentage: number;
}
