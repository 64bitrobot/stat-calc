
import { Player } from './types';

export const COLORS = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'The Tank',
    stats: { Combat: 0, Magic: 0, Ranged: 0, Defense: 10 },
    color: COLORS[0],
    description: 'Puts everything into absolute defense.'
  },
  {
    id: 'p2',
    name: 'Pure Brawler',
    stats: { Combat: 10, Magic: 0, Ranged: 0, Defense: 0 },
    color: COLORS[1],
    description: 'Focused entirely on melee combat.'
  },
  {
    id: 'p3',
    name: 'Wizard Supreme',
    stats: { Combat: 0, Magic: 10, Ranged: 0, Defense: 0 },
    color: COLORS[2],
    description: 'Masters of the arcane arts.'
  },
  {
    id: 'p4',
    name: 'Deadeye Sniper',
    stats: { Combat: 0, Magic: 0, Ranged: 10, Defense: 0 },
    color: COLORS[3],
    description: 'Precision from a distance.'
  },
  {
    id: 'p5',
    name: 'Balanced Jack',
    stats: { Combat: 2, Magic: 3, Ranged: 3, Defense: 2 },
    color: COLORS[4],
    description: 'A jack of all trades, master of none.'
  },
  {
    id: 'p6',
    name: 'Shield-Mage',
    stats: { Combat: 0, Magic: 5, Ranged: 0, Defense: 5 },
    color: COLORS[5],
    description: 'Mixes magic with heavy protection.'
  },
  {
    id: 'p7',
    name: 'Combat Scout',
    stats: { Combat: 4, Magic: 0, Ranged: 3, Defense: 3 },
    color: COLORS[6],
    description: 'Mobile and versatile fighter.'
  },
  {
    id: 'p8',
    name: 'Glass Cannon',
    stats: { Combat: 3, Magic: 4, Ranged: 3, Defense: 0 },
    color: COLORS[7],
    description: 'High offense, zero survivability.'
  },
  {
    id: 'p9',
    name: 'The Wall',
    stats: { Combat: 1, Magic: 1, Ranged: 1, Defense: 7 },
    color: COLORS[8],
    description: 'Mostly defense with minor utility.'
  },
  {
    id: 'p10',
    name: 'Chaos Specialist',
    stats: { Combat: 5, Magic: 5, Ranged: 0, Defense: 0 },
    color: COLORS[9],
    description: 'Hyper-focused on two damage types.'
  }
];
