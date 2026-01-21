
import React from 'react';
import { Player, StatType } from '../types';

interface PlayerCardProps {
  player: Player;
  onUpdate: (updatedPlayer: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdate }) => {
  const handleStatChange = (stat: keyof typeof StatType, value: number) => {
    // Cast Object.values to number[] to ensure 'a + b' is valid during reduction
    const currentTotal = (Object.values(player.stats) as number[]).reduce((a, b) => a + b, 0);
    const oldValue = player.stats[stat];
    const diff = value - oldValue;
    
    if (currentTotal + diff <= 10 && value >= 0) {
      onUpdate({
        ...player,
        stats: {
          ...player.stats,
          [stat]: value
        }
      });
    }
  };

  // Cast Object.values to number[] to ensure 'a + b' is valid during reduction
  const total = (Object.values(player.stats) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: player.color }}
        />
        <input 
          type="text" 
          value={player.name}
          onChange={(e) => onUpdate({ ...player, name: e.target.value })}
          className="bg-transparent font-bold text-lg text-white border-none focus:ring-0 w-full"
        />
      </div>
      
      <div className="space-y-3">
        {(Object.keys(StatType) as Array<keyof typeof StatType>).map((stat) => (
          <div key={stat} className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
              <span>{stat}</span>
              <span>{player.stats[stat]}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={player.stats[stat]}
              onChange={(e) => handleStatChange(stat, parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-500">Remaining Points</span>
        <span className={`text-sm font-bold ${total === 10 ? 'text-green-500' : 'text-blue-400'}`}>
          {10 - total}
        </span>
      </div>
    </div>
  );
};

export default PlayerCard;
