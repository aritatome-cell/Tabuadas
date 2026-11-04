import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AllowedTableNumber, ALLOWED_TABLES } from '../../types/math';
import { playSuccessSound, playGentleTryAgainSound, playPopSound, playVictoryFanfare } from '../../utils/audio';
import { Play, RotateCcw, Zap, Trophy, Timer } from 'lucide-react';

interface SpeedChallengeProps {
  onEarnStars: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const SpeedChallenge: React.FC<SpeedChallengeProps> = ({
  onEarnStars,
  onUnlockBadge,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [currentProblem, setCurrentProblem] = useState<{
    text: string;
    answer: number;
    options: number[];
  } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<'hit' | 'miss' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateProblem = () => {
    const table: AllowedTableNumber = ALLOWED_TABLES[Math.floor(Math.random() * ALLOWED_TABLES.length)];
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const answer = table * multiplier;

    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 3) {
      const delta = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = answer + delta * table;
      if (fake > 0 && fake !== answer) {
        optionsSet.add(fake);
      } else {
        optionsSet.add(answer + (optionsSet.size + 1) * 2);
      }
    }

    setCurrentProblem({
      text: `${table} × ${multiplier}`,
      answer,
      options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
    });
  };

  const startGame = () => {
    playPopSound();
    setIsPlaying(true);
    setTimeLeft(45);
    setScore(0);
    setGameOver(false);
    setLastFeedback(null);
    generateProblem();
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      playVictoryFanfare();
      onEarnStars(score * 2);

      if (score >= 8) {
        onUnlockBadge('speed_runner');
      }

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft, score, onEarnStars, onUnlockBadge]);

  const handleChoose = (opt: number) => {
    if (!currentProblem || !isPlaying) return;

    if (opt === currentProblem.answer) {
      playSuccessSound();
      setScore((s) => s + 1);
      setLastFeedback('hit');
      onEarnStars(1);
    } else {
      playGentleTryAgainSound();
      setLastFeedback('miss');
    }

    generateProblem();
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 shadow-xs bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/src/assets/images/foguetao_espacial_matematica_1793818382852.jpg"
            alt="Foguetão espacial da tabuada"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/30 text-amber-200 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Desafio Bónus: Contrarrelógio</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl">
              A Corrida dos Foguetões!
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-md">
              Tens 45 segundos para responder ao máximo de contas das tabuadas do 1, 2, 3, 4, 5, 6 e 10!
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <span className="block text-[11px] font-bold text-amber-300 uppercase">Tempo</span>
              <span className="font-mono font-black text-3xl">{timeLeft}s</span>
            </div>

            <div className="text-center px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <span className="block text-[11px] font-bold text-emerald-300 uppercase">Pontos</span>
              <span className="font-mono font-black text-3xl text-emerald-300">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      {!isPlaying && !gameOver && (
        <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md text-center space-y-5">
          <h3 className="font-display font-extrabold text-xl text-slate-900">
            Preparado para a descolagem?
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Carrega no botão verde para iniciar o cronómetro e testar a tua velocidade na tabuada!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg transition-transform active:scale-95 shadow-md flex items-center gap-2.5 mx-auto cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Começar a Corrida!</span>
          </button>
        </div>
      )}

      {isPlaying && currentProblem && (
        <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md text-center space-y-6">
          <div className="py-6 px-4 bg-amber-50 rounded-2xl border border-amber-200 inline-block w-full">
            <span className="font-display font-black text-4xl sm:text-6xl text-slate-900">
              {currentProblem.text} = <span className="text-amber-600">?</span>
            </span>
          </div>

          {/* Quick 3 Options */}
          <div className="grid grid-cols-3 gap-3">
            {currentProblem.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoose(opt)}
                className="py-5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-mono font-black text-3xl shadow-sm transition-all cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>

          {lastFeedback && (
            <p
              className={`text-xs font-bold ${
                lastFeedback === 'hit' ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {lastFeedback === 'hit' ? '● Certo! +1 ponto' : '▲ Errado, tenta a próxima!'}
            </p>
          )}
        </div>
      )}

      {gameOver && (
        <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-lg text-center space-y-5 animate-pop">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Trophy className="w-9 h-9" />
          </div>

          <h3 className="font-display font-black text-2xl text-slate-900">
            Fim do Tempo!
          </h3>
          <p className="text-slate-600">
            Conseguiste resolver <strong className="text-amber-600 text-xl font-black">{score}</strong> contas certas em 45 segundos!
          </p>

          <button
            onClick={startGame}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base transition-transform active:scale-95 shadow-xs flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tentar Superar o Recorde</span>
          </button>
        </div>
      )}
    </div>
  );
};
