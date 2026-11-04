import React from 'react';
import { Volume2, VolumeX, Trophy, Sparkles } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playPopSound } from '../utils/audio';

interface HeaderProps {
  activeTab: 'explore' | 'matching' | 'true-false' | 'quiz' | 'speed';
  setActiveTab: (tab: 'explore' | 'matching' | 'true-false' | 'quiz' | 'speed') => void;
  onOpenTrophies: () => void;
  trophyCount: number;
  totalStars: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenTrophies,
  trophyCount,
  totalStars,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const toggleSound = () => {
    playPopSound();
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const navItems: { id: 'explore' | 'matching' | 'true-false' | 'quiz' | 'speed'; label: string }[] = [
    { id: 'explore', label: 'Aprender Tabuadas' },
    { id: 'matching', label: 'Correspondência' },
    { id: 'true-false', label: 'Verdadeiro ou Falso' },
    { id: 'quiz', label: 'Escolha Múltipla' },
    { id: 'speed', label: 'Corrida Rápida' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => {
            playPopSound();
            setActiveTab('explore');
          }}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus-visible:outline-amber-500 rounded-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-xl leading-none">×</span>
          </div>
          <div>
            <div className="font-display font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              Tabuada Divertida
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                3.º Ano
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Tabuadas do 1, 2, 3, 4, 5, 6 e 10
            </p>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playPopSound();
                  setActiveTab(item.id);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Trophies */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{totalStars} estrelas</span>
          </div>

          <button
            onClick={() => {
              playPopSound();
              onOpenTrophies();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold transition-all shadow-xs"
            title="Ver Troféus e Conquistas"
          >
            <Trophy className="w-4 h-4 text-amber-700" />
            <span>Troféus</span>
            {trophyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] flex items-center justify-center font-bold">
                {trophyCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title={soundOn ? 'Som ativado' : 'Som desativado'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Mobile nav bar scrollable */}
      <div className="md:hidden flex items-center gap-1 px-3 py-2 overflow-x-auto border-t border-amber-100 bg-amber-50/50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              playPopSound();
              setActiveTab(item.id);
            }}
            className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
              activeTab === item.id
                ? 'bg-amber-500 text-white'
                : 'bg-white text-slate-700 border border-amber-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
