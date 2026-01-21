
import React, { useState, useCallback, useEffect } from 'react';
import { Player, WinRateData, HeatmapCell, StatType } from './types';
import { DEFAULT_PLAYERS } from './constants';
import PlayerCard from './components/PlayerCard';
import SimulationResults from './components/SimulationResults';
import { analyzeResults } from './services/geminiService';

const FORMULAS = [
  { 
    id: 'user_requested', 
    label: 'Requested: d20 + A vs d20 + D + A', 
    formula: '(d20 + atk_stat) > (d20 + def_stat + atk_stat)',
    description: 'The formula from the chat snippet. Notice how Attack Stat cancels itself out.'
  },
  { 
    id: 'standard_rpg', 
    label: 'Standard: d20 + A vs d20 + D', 
    formula: '(d20 + atk_stat) > (d20 + def_stat)',
    description: 'A traditional RPG roll-off where offense competes directly with defense.'
  }
];

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [roundsPerMatch, setRoundsPerMatch] = useState(1000);
  const [selectedFormulaId, setSelectedFormulaId] = useState(FORMULAS[0].id);
  const [results, setResults] = useState<{ winRates: WinRateData[], heatmap: HeatmapCell[] } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setAiAnalysis(null);
    
    // Tiny delay to show the spinner
    setTimeout(() => {
      const statsMap: Record<string, { wins: number, total: number }> = {};
      const heatmap: HeatmapCell[] = [];
      const formula = FORMULAS.find(f => f.id === selectedFormulaId)!;

      players.forEach(p => {
        statsMap[p.id] = { wins: 0, total: 0 };
      });

      // Tournament: Everyone attacks everyone else
      players.forEach(attacker => {
        players.forEach(defender => {
          if (attacker.id === defender.id) return;

          let attackerWinsInMatchup = 0;
          
          for (let r = 0; r < roundsPerMatch; r++) {
            const d20Attacker = Math.floor(Math.random() * 20) + 1;
            const d20Defender = Math.floor(Math.random() * 20) + 1;
            
            // Choose attack stat based on build (highest offense stat)
            const attackStats = [attacker.stats.Combat, attacker.stats.Magic, attacker.stats.Ranged];
            const maxAtk = Math.max(...attackStats);
            const def = defender.stats.Defense;

            let success = false;
            if (selectedFormulaId === 'user_requested') {
              // Literal: d20 + A vs d20 + D + A
              success = (d20Attacker + maxAtk) > (d20Defender + def + maxAtk);
            } else {
              // Standard: d20 + A vs d20 + D
              success = (d20Attacker + maxAtk) > (d20Defender + def);
            }

            if (success) attackerWinsInMatchup++;
          }

          statsMap[attacker.id].wins += attackerWinsInMatchup;
          statsMap[attacker.id].total += roundsPerMatch;
          
          heatmap.push({
            attacker: attacker.name,
            defender: defender.name,
            winPercentage: (attackerWinsInMatchup / roundsPerMatch) * 100
          });
        });
      });

      const winRates: WinRateData[] = players.map(p => ({
        playerName: p.name,
        winRate: (statsMap[p.id].wins / statsMap[p.id].total) * 100,
        totalWins: statsMap[p.id].wins,
        totalMatches: statsMap[p.id].total
      })).sort((a, b) => b.winRate - a.winRate);

      setResults({ winRates, heatmap });
      setIsSimulating(false);
    }, 500);
  }, [players, roundsPerMatch, selectedFormulaId]);

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const requestAnalysis = async () => {
    if (!results) return;
    setIsAnalyzing(true);
    const analysis = await analyzeResults(players, results.winRates, FORMULAS.find(f => f.id === selectedFormulaId)!.label);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              RPG Stat Simulator
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Simulate thousands of combat encounters to find the optimal point distribution. 
              Prove your system's balance—or lack thereof—with hard data.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex">
              {FORMULAS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormulaId(f.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${selectedFormulaId === f.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  {f.id === 'user_requested' ? 'Requested' : 'Standard'}
                </button>
              ))}
            </div>
            <button 
              onClick={runSimulation}
              disabled={isSimulating}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-8 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isSimulating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>}
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-start gap-3">
          <i className="fas fa-info-circle text-blue-400 mt-1"></i>
          <div>
            <span className="text-sm font-bold text-slate-300">Selected Logic: </span>
            <code className="text-sm text-blue-300 mono">{FORMULAS.find(f => f.id === selectedFormulaId)?.formula}</code>
            <p className="text-xs text-slate-500 mt-1">{FORMULAS.find(f => f.id === selectedFormulaId)?.description}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Player Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <i className="fas fa-users text-blue-500"></i>
              Combatants (10 pts)
            </h2>
            <div className="flex items-center gap-2">
               <span className="text-xs text-slate-500 uppercase font-bold">Rounds/Match:</span>
               <select 
                 value={roundsPerMatch}
                 onChange={(e) => setRoundsPerMatch(parseInt(e.target.value))}
                 className="bg-slate-800 border-none text-xs rounded p-1 text-blue-400 font-bold focus:ring-0"
               >
                 <option value={100}>100</option>
                 <option value={1000}>1,000</option>
                 <option value={5000}>5,000</option>
                 <option value={10000}>10,000</option>
               </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
            {players.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                onUpdate={handleUpdatePlayer} 
              />
            ))}
          </div>
        </div>

        {/* Right: Results & Analysis */}
        <div className="lg:col-span-8">
          {!results ? (
            <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-3xl h-[600px] flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <i className="fas fa-chart-line text-6xl mb-4 opacity-20"></i>
              <h3 className="text-2xl font-bold">No Data Yet</h3>
              <p className="max-w-md mt-2">Adjust your players' stats and run the simulation to see the breakdown of the meta.</p>
              <button 
                onClick={runSimulation}
                className="mt-8 px-6 py-2 border border-slate-700 rounded-full hover:bg-slate-800 transition-all text-sm font-bold"
              >
                Launch Initial Run
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <SimulationResults winRates={results.winRates} heatmap={results.heatmap} />
              
              <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <i className="fas fa-brain text-purple-400"></i>
                     Gemini System Analysis
                   </h3>
                   <button 
                     onClick={requestAnalysis}
                     disabled={isAnalyzing}
                     className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                   >
                     {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                     {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
                   </button>
                </div>
                <div className="p-6 prose prose-invert max-w-none text-slate-300 min-h-[150px]">
                  {aiAnalysis ? (
                    <div className="animate-in slide-in-from-bottom-2 duration-500">
                      {aiAnalysis.split('\n').map((line, i) => (
                        <p key={i} className="mb-4 text-sm leading-relaxed">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500 italic">
                      <p>Ask Gemini to analyze the balance based on current results.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
        <p>&copy; 2024 Advanced Combat Simulator. For testing mathematical proof-of-concepts.</p>
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><i className="fas fa-code-branch"></i> v4.0.2</span>
          <span className="flex items-center gap-1"><i className="fas fa-bolt"></i> Real-time Logic</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
