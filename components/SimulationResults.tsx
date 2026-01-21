
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WinRateData, HeatmapCell } from '../types';

interface SimulationResultsProps {
  winRates: WinRateData[];
  heatmap: HeatmapCell[];
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ winRates, heatmap }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <i className="fas fa-chart-simple text-blue-500"></i>
          Overall Win Rates
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={winRates} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="playerName" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                stroke="#94a3b8" 
                fontSize={12}
              />
              <YAxis stroke="#94a3b8" unit="%" />
              <Tooltip 
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
              />
              <Bar dataKey="winRate">
                {winRates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl overflow-hidden">
        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <i className="fas fa-table-cells text-blue-500"></i>
          Matchup Matrix (Win %)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-slate-400 font-normal border border-slate-700 italic">Def \ Atk</th>
                {winRates.map(w => (
                  <th key={w.playerName} className="p-2 border border-slate-700 whitespace-nowrap min-w-[100px] text-xs uppercase font-bold text-slate-300">
                    {w.playerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {winRates.map(defenderRow => (
                <tr key={defenderRow.playerName}>
                  <td className="p-2 border border-slate-700 font-bold text-slate-300 whitespace-nowrap text-xs uppercase">
                    {defenderRow.playerName}
                  </td>
                  {winRates.map(attackerCol => {
                    const match = heatmap.find(h => h.attacker === attackerCol.playerName && h.defender === defenderRow.playerName);
                    const val = match ? match.winPercentage : 0;
                    let bgColor = 'transparent';
                    if (attackerCol.playerName !== defenderRow.playerName) {
                       if (val > 70) bgColor = 'rgba(34, 197, 94, 0.4)';
                       else if (val > 50) bgColor = 'rgba(34, 197, 94, 0.2)';
                       else if (val < 30) bgColor = 'rgba(239, 68, 68, 0.4)';
                       else if (val < 50) bgColor = 'rgba(239, 68, 68, 0.2)';
                    }
                    
                    return (
                      <td 
                        key={attackerCol.playerName} 
                        className="p-2 border border-slate-700 text-center mono"
                        style={{ backgroundColor: bgColor }}
                      >
                        {attackerCol.playerName === defenderRow.playerName ? '-' : `${val.toFixed(0)}%`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
