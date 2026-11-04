import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AllowedTableNumber, ALLOWED_TABLES, MatchingCard } from '../../types/math';
import { playSuccessSound, playGentleTryAgainSound, playPopSound, playVictoryFanfare } from '../../utils/audio';
import { SUCCESS_MESSAGES } from '../../data/multiplicationData';
import { Sparkles, RotateCcw, Trophy, CheckCircle, HelpCircle } from 'lucide-react';

interface MatchingGameProps {
  onEarnStars: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  onEarnStars,
  onUnlockBadge,
}) => {
  const [selectedTableFilter, setSelectedTableFilter] = useState<AllowedTableNumber | 'all'>('all');
  const [operations, setOperations] = useState<MatchingCard[]>([]);
  const [results, setResults] = useState<MatchingCard[]>([]);
  const [selectedOp, setSelectedOp] = useState<MatchingCard | null>(null);
  const [selectedRes, setSelectedRes] = useState<MatchingCard | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('Clica numa conta e depois no resultado certo!');
  const [feedbackType, setFeedbackType] = useState<'neutral' | 'success' | 'try_again'>('neutral');
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Generate 5 distinct matching pairs
  const generateNewRound = useCallback(() => {
    setSelectedOp(null);
    setSelectedRes(null);
    setWrongPair(null);
    setRoundCompleted(false);
    setFeedbackType('neutral');
    setFeedbackText('Clica numa conta e depois no resultado certo!');

    const usedResults = new Set<number>();
    const pairs: { opText: string; result: number; table: AllowedTableNumber; matchId: string }[] = [];

    let attempts = 0;
    while (pairs.length < 5 && attempts < 200) {
      attempts++;
      const table: AllowedTableNumber = selectedTableFilter === 'all'
        ? ALLOWED_TABLES[Math.floor(Math.random() * ALLOWED_TABLES.length)]
        : selectedTableFilter;
      
      const multiplier = Math.floor(Math.random() * 10) + 1;
      const res = table * multiplier;

      // Ensure distinct results so matching is 100% unambiguous
      if (!usedResults.has(res)) {
        usedResults.add(res);
        const matchId = `pair-${table}-${multiplier}-${Date.now()}-${pairs.length}`;
        pairs.push({
          opText: `${table} × ${multiplier}`,
          result: res,
          table,
          matchId,
        });
      }
    }

    const opCards: MatchingCard[] = pairs.map((p) => ({
      id: `op-${p.matchId}`,
      type: 'operation',
      matchId: p.matchId,
      content: p.opText,
      table: p.table,
      matched: false,
    }));

    const resCards: MatchingCard[] = pairs.map((p) => ({
      id: `res-${p.matchId}`,
      type: 'result',
      matchId: p.matchId,
      content: String(p.result),
      table: p.table,
      matched: false,
    }));

    // Shuffle both sets
    setOperations(opCards.sort(() => Math.random() - 0.5));
    setResults(resCards.sort(() => Math.random() - 0.5));
  }, [selectedTableFilter]);

  useEffect(() => {
    generateNewRound();
  }, [generateNewRound]);

  const handleCardClick = (card: MatchingCard) => {
    playPopSound();

    if (card.matched) return;

    if (card.type === 'operation') {
      setSelectedOp(card);
      if (selectedRes) {
        checkMatch(card, selectedRes);
      }
    } else {
      setSelectedRes(card);
      if (selectedOp) {
        checkMatch(selectedOp, card);
      }
    }
  };

  const checkMatch = (op: MatchingCard, res: MatchingCard) => {
    if (op.matchId === res.matchId) {
      // MATCH!
      playSuccessSound();
      setFeedbackType('success');
      const randomSuccess = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
      setFeedbackText(`${randomSuccess} ${op.content} = ${res.content}!`);

      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
      });

      setOperations((prev) =>
        prev.map((c) => (c.id === op.id ? { ...c, matched: true } : c))
      );
      setResults((prev) =>
        prev.map((c) => (c.id === res.id ? { ...c, matched: true } : c))
      );

      setSelectedOp(null);
      setSelectedRes(null);
      setScore((s) => s + 10);
      onEarnStars(2);

      // Check if all matched
      const remaining = operations.filter((c) => !c.matched && c.id !== op.id);
      if (remaining.length === 0) {
        setTimeout(() => {
          setRoundCompleted(true);
          playVictoryFanfare();
          onUnlockBadge('match_master');
          onEarnStars(10);
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
          });
        }, 400);
      }
    } else {
      // WRONG PAIR
      playGentleTryAgainSound();
      setFeedbackType('try_again');
      setWrongPair([op.id, res.id]);
      setFeedbackText(`Quase! ${op.content} não dá ${res.content}. Tenta outro par!`);

      setTimeout(() => {
        setSelectedOp(null);
        setSelectedRes(null);
        setWrongPair(null);
      }, 700);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Title & Instructions */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Jogo 1: Correspondência</span>
          </div>
          <h2 className="font-display font-black text-2xl text-slate-900">
            Ligar as Contas aos Resultados
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Clica numa conta da esquerda e no resultado certo da direita para fazer o par mágico!
          </p>
        </div>

        {/* Filter by Table */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <label className="text-xs font-bold text-slate-600">Escolhe a Tabuada:</label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                playPopSound();
                setSelectedTableFilter('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                selectedTableFilter === 'all'
                  ? 'bg-amber-500 text-white shadow-2xs'
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
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Instant Feedback Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
          feedbackType === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 animate-pop'
            : feedbackType === 'try_again'
            ? 'bg-rose-50 border-rose-300 text-rose-900 animate-shake'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              feedbackType === 'success'
                ? 'bg-emerald-500 text-white'
                : feedbackType === 'try_again'
                ? 'bg-rose-500 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {feedbackType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : feedbackType === 'try_again' ? (
              <HelpCircle className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-extrabold text-sm sm:text-base">{feedbackText}</p>
            <p className="text-xs opacity-80">Pontos da ronda: {score}</p>
          </div>
        </div>

        <button
          onClick={() => {
            playPopSound();
            generateNewRound();
          }}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shrink-0"
          title="Nova Ronda de Contas"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Two Column Matching Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Operations Column (Left) */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-display font-black text-slate-900 text-sm uppercase tracking-wider">
              1. Escolhe a Conta
            </h3>
            <span className="text-xs text-slate-400">5 operações</span>
          </div>

          <div className="space-y-2.5">
            {operations.map((card) => {
              const isSelected = selectedOp?.id === card.id;
              const isWrong = wrongPair && (wrongPair[0] === card.id || wrongPair[1] === card.id);

              return (
                <button
                  key={card.id}
                  disabled={card.matched}
                  onClick={() => handleCardClick(card)}
                  className={`w-full p-4 rounded-2xl font-display font-black text-xl sm:text-2xl transition-all cursor-pointer flex items-center justify-between ${
                    card.matched
                      ? 'bg-emerald-100/60 border-2 border-emerald-400 text-emerald-800 opacity-60 line-through cursor-not-allowed'
                      : isWrong
                      ? 'bg-rose-100 border-2 border-rose-400 text-rose-800 animate-shake'
                      : isSelected
                      ? 'bg-amber-500 text-white border-2 border-amber-600 shadow-md scale-102 ring-4 ring-amber-200'
                      : 'bg-amber-50/70 hover:bg-amber-100/80 border-2 border-amber-200/80 text-slate-800 hover:scale-101'
                  }`}
                >
                  <span>{card.content}</span>
                  {card.matched && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Column (Right) */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-display font-black text-slate-900 text-sm uppercase tracking-wider">
              2. Escolhe o Resultado
            </h3>
            <span className="text-xs text-slate-400">5 números</span>
          </div>

          <div className="space-y-2.5">
            {results.map((card) => {
              const isSelected = selectedRes?.id === card.id;
              const isWrong = wrongPair && (wrongPair[0] === card.id || wrongPair[1] === card.id);

              return (
                <button
                  key={card.id}
                  disabled={card.matched}
                  onClick={() => handleCardClick(card)}
                  className={`w-full p-4 rounded-2xl font-display font-black text-xl sm:text-2xl transition-all cursor-pointer flex items-center justify-between ${
                    card.matched
                      ? 'bg-emerald-100/60 border-2 border-emerald-400 text-emerald-800 opacity-60 line-through cursor-not-allowed'
                      : isWrong
                      ? 'bg-rose-100 border-2 border-rose-400 text-rose-800 animate-shake'
                      : isSelected
                      ? 'bg-amber-500 text-white border-2 border-amber-600 shadow-md scale-102 ring-4 ring-amber-200'
                      : 'bg-slate-50 hover:bg-amber-50/80 border-2 border-slate-200/90 text-slate-800 hover:scale-101'
                  }`}
                >
                  <span className="font-mono">{card.content}</span>
                  {card.matched && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Modal / Banner */}
      {roundCompleted && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-8 text-white text-center shadow-lg animate-pop space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Trophy className="w-9 h-9 text-amber-200" />
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl">
            Fantástico! Emparelhaste tudo com sucesso!
          </h3>
          <p className="text-white/95 max-w-md mx-auto text-sm sm:text-base">
            Ganhaste +10 estrelas e desbloqueaste a medalha de <strong>Detetive dos Pares</strong>!
          </p>
          <div>
            <button
              onClick={() => {
                playPopSound();
                generateNewRound();
              }}
              className="px-6 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-base hover:bg-emerald-50 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              Jogar Mais Uma Ronda!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
