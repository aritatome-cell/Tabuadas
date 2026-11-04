import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AllowedTableNumber, ALLOWED_TABLES, TrueFalseQuestion } from '../../types/math';
import { playSuccessSound, playGentleTryAgainSound, playPopSound } from '../../utils/audio';
import { Check, X, Sparkles, ChevronRight, HelpCircle, Trophy } from 'lucide-react';
import { IMAGES } from '../../assets/images';

interface TrueFalseGameProps {
  onEarnStars: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({
  onEarnStars,
  onUnlockBadge,
}) => {
  const [selectedTableFilter, setSelectedTableFilter] = useState<AllowedTableNumber | 'all'>('all');
  const [currentQuestion, setCurrentQuestion] = useState<TrueFalseQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);

  const generateQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    const table: AllowedTableNumber = selectedTableFilter === 'all'
      ? ALLOWED_TABLES[Math.floor(Math.random() * ALLOWED_TABLES.length)]
      : selectedTableFilter;

    const multiplier = Math.floor(Math.random() * 10) + 1;
    const actualResult = table * multiplier;
    const isTrue = Math.random() > 0.45; // ~50% chance of being true

    let displayedResult = actualResult;
    if (!isTrue) {
      // Create plausible mistake (e.g., +/- 1, 2, or neighboring multiple)
      const offset = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      displayedResult = actualResult + offset;
      if (displayedResult <= 0 || displayedResult === actualResult) {
        displayedResult = actualResult + table;
      }
    }

    // Build friendly Portuguese explanation
    const additionParts = Array.from({ length: Math.min(table, 5) }, () => multiplier).join(' + ');
    const extraEllipsis = table > 5 ? '... ' : '';
    const explanation = isTrue
      ? `Exato! ${table} × ${multiplier} = ${actualResult}. É ${multiplier} somado ${table} vezes (${additionParts} ${extraEllipsis}= ${actualResult})!`
      : `Cuidado! ${table} × ${multiplier} = ${actualResult} (e não ${displayedResult}). Lembra-te: ${additionParts} ${extraEllipsis}= ${actualResult}!`;

    setCurrentQuestion({
      id: `tf-${Date.now()}`,
      operationText: `${table} × ${multiplier}`,
      displayedResult,
      actualResult,
      isTrue,
      explanation,
      table,
    });
  }, [selectedTableFilter]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (choice: boolean) => {
    if (!currentQuestion || selectedAnswer !== null) return;

    playPopSound();
    setSelectedAnswer(choice);
    const correct = choice === currentQuestion.isTrue;
    setIsCorrect(correct);
    setTotalAnswered((t) => t + 1);

    if (correct) {
      playSuccessSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      onEarnStars(2);

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      });

      if (newStreak >= 5) {
        onUnlockBadge('true_detective');
      }
    } else {
      playGentleTryAgainSound();
      setStreak(0);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Jogo 2: Verdadeiro ou Falso</span>
          </div>
          <h2 className="font-display font-black text-2xl text-slate-900">
            Detetive da Tabuada
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Olha para a conta do Pipas: será que o resultado é Verdadeiro ou Falso?
          </p>
        </div>

        {/* Table selector filter */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-bold text-slate-500">Filtrar Tabuada:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                playPopSound();
                setSelectedTableFilter('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                selectedTableFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            {ALLOWED_TABLES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  playPopSound();
                  setSelectedTableFilter(t);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-black cursor-pointer transition-all ${
                  selectedTableFilter === t
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak / Stats */}
      <div className="flex items-center justify-between px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span>Perguntas respondidas: <strong className="text-amber-800">{totalAnswered}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-700">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Sequência de acertos: <strong className="text-emerald-700 font-extrabold text-sm">{streak}</strong> seguidos</span>
        </div>
      </div>

      {/* The Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md space-y-6 text-center">
          {/* Mascot speech */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xs shrink-0">
              <img
                src={IMAGES.mascotPipas}
                alt="Pipas"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left bg-amber-50 p-3 rounded-2xl border border-amber-200/60 max-w-sm">
              <p className="text-xs font-bold text-amber-800">O Robô Pipas pergunta:</p>
              <p className="text-sm font-semibold text-slate-800">
                &ldquo;Será que esta igualdade matemática está certa?&rdquo;
              </p>
            </div>
          </div>

          {/* Big Equation Banner */}
          <div className="py-6 px-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200 inline-block w-full">
            <span className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-wide">
              {currentQuestion.operationText} = <span className="text-amber-600">{currentQuestion.displayedResult}</span>
            </span>
          </div>

          {/* Big Interactive Action Buttons: Verdadeiro & Falso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswer(true)}
              className={`p-5 rounded-2xl font-display font-black text-xl sm:text-2xl transition-all flex items-center justify-center gap-3 cursor-pointer ${
                selectedAnswer === null
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:scale-102 active:scale-95'
                  : selectedAnswer === true && isCorrect
                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-lg'
                  : selectedAnswer === true && !isCorrect
                  ? 'bg-rose-500 text-white ring-4 ring-rose-300 opacity-90'
                  : currentQuestion.isTrue
                  ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800'
                  : 'bg-slate-100 text-slate-400 opacity-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span>VERDADEIRO</span>
            </button>

            <button
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswer(false)}
              className={`p-5 rounded-2xl font-display font-black text-xl sm:text-2xl transition-all flex items-center justify-center gap-3 cursor-pointer ${
                selectedAnswer === null
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:scale-102 active:scale-95'
                  : selectedAnswer === false && isCorrect
                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 shadow-lg'
                  : selectedAnswer === false && !isCorrect
                  ? 'bg-rose-500 text-white ring-4 ring-rose-300 opacity-90'
                  : !currentQuestion.isTrue
                  ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800'
                  : 'bg-slate-100 text-slate-400 opacity-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-5 h-5" />
              </div>
              <span>FALSO</span>
            </button>
          </div>

          {/* Instant Detailed Feedback Box */}
          {selectedAnswer !== null && (
            <div
              className={`p-5 rounded-2xl border text-left animate-pop space-y-2 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Muito bem! Acertaste em cheio!</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Não faz mal, vamos ver como é:</span>
                  </>
                )}
              </div>

              <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => {
                    playPopSound();
                    generateQuestion();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Próxima Pergunta</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
