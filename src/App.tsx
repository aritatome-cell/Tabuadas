import React, { useState, useEffect } from 'react';
import { AllowedTableNumber, Badge } from './types/math';
import { INITIAL_BADGES } from './data/multiplicationData';
import { Header } from './components/Header';
import { ExploreTabuada } from './components/ExploreTabuada';
import { MatchingGame } from './components/games/MatchingGame';
import { TrueFalseGame } from './components/games/TrueFalseGame';
import { MultipleChoiceGame } from './components/games/MultipleChoiceGame';
import { SpeedChallenge } from './components/games/SpeedChallenge';
import { TrophiesModal } from './components/TrophiesModal';
import { playVictoryFanfare, playPopSound } from './utils/audio';
import confetti from 'canvas-confetti';
import { BookOpen, Puzzle, CheckSquare, HelpCircle, Zap, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'matching' | 'true-false' | 'quiz' | 'speed'>('explore');
  const [selectedTable, setSelectedTable] = useState<AllowedTableNumber>(2);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [isTrophiesOpen, setIsTrophiesOpen] = useState<boolean>(false);

  // Load persistence from localStorage
  useEffect(() => {
    try {
      const savedStars = localStorage.getItem('tabuada_stars');
      if (savedStars) setTotalStars(parseInt(savedStars, 10));

      const savedBadges = localStorage.getItem('tabuada_badges');
      if (savedBadges) {
        setBadges(JSON.parse(savedBadges));
      }
    } catch (e) {
      console.warn('Could not load localStorage', e);
    }
  }, []);

  const handleEarnStars = (amount: number) => {
    setTotalStars((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('tabuada_stars', next.toString());
      } catch {
        // ignore
      }
      return next;
    });

    // Check first win badge
    unlockBadge('first_win');
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const exists = prev.find((b) => b.id === badgeId);
      if (exists && exists.unlocked) return prev;

      const updated = prev.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
      );

      try {
        localStorage.setItem('tabuada_badges', JSON.stringify(updated));
      } catch {
        // ignore
      }

      playVictoryFanfare();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.4 },
      });

      return updated;
    });
  };

  const unlockedBadgeCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTrophies={() => setIsTrophiesOpen(true)}
        trophyCount={unlockedBadgeCount}
        totalStars={totalStars}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* Tab Switcher Hub */}
        <div className="mb-6 p-2 bg-white rounded-2xl border border-amber-200/70 shadow-xs flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('explore');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50/50 text-slate-700 hover:bg-amber-100/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Aprender Tabuadas</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('matching');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'matching'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50/50 text-slate-700 hover:bg-amber-100/60'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>1. Correspondência (Ligar Pares)</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('true-false');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'true-false'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-amber-50/50 text-slate-700 hover:bg-amber-100/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>2. Verdadeiro ou Falso</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('quiz');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-amber-50/50 text-slate-700 hover:bg-amber-100/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>3. Escolha Múltipla</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('speed');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'speed'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-amber-50/50 text-slate-700 hover:bg-amber-100/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Bónus: Corrida Rápida</span>
          </button>
        </div>

        {/* Dynamic Section rendering */}
        {activeTab === 'explore' && (
          <ExploreTabuada
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            onGoToGames={() => {
              playPopSound();
              setActiveTab('matching');
            }}
          />
        )}

        {activeTab === 'matching' && (
          <MatchingGame
            onEarnStars={handleEarnStars}
            onUnlockBadge={unlockBadge}
          />
        )}

        {activeTab === 'true-false' && (
          <TrueFalseGame
            onEarnStars={handleEarnStars}
            onUnlockBadge={unlockBadge}
          />
        )}

        {activeTab === 'quiz' && (
          <MultipleChoiceGame
            onEarnStars={handleEarnStars}
            onUnlockBadge={unlockBadge}
          />
        )}

        {activeTab === 'speed' && (
          <SpeedChallenge
            onEarnStars={handleEarnStars}
            onUnlockBadge={unlockBadge}
          />
        )}
      </main>

      {/* Achievement & Trophies Modal */}
      <TrophiesModal
        isOpen={isTrophiesOpen}
        onClose={() => setIsTrophiesOpen(false)}
        badges={badges}
        totalStars={totalStars}
      />

      {/* Footer conforming to domain rules and pt-PT context */}
      <footer className="border-t border-amber-200/80 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">A Aventura da Tabuada</span>
            <span>·</span>
            <span>Matemática 3.º Ano do Ensino Básico</span>
            <span>·</span>
            <span>Tabuadas: 1, 2, 3, 4, 5, 6 e 10</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Aprender brincando com feedback imediato!</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
