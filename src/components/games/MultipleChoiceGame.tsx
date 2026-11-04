import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AllowedTableNumber, ALLOWED_TABLES, MultipleChoiceQuestion } from '../../types/math';
import { playSuccessSound, playGentleTryAgainSound, playPopSound, playVictoryFanfare } from '../../utils/audio';
import { SUCCESS_MESSAGES } from '../../data/multiplicationData';
import { Sparkles, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { IMAGES } from '../../assets/images';

interface MultipleChoiceGameProps {
  onEarnStars: (amount: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const MultipleChoiceGame: React.FC<MultipleChoiceGameProps> = ({
  onEarnStars,
  onUnlockBadge,
}) => {
  const [selectedTableFilter, setSelectedTableFilter] = useState<AllowedTableNumber | 'all'>('all');
  const [currentQuestion, setCurrentQuestion] = useState<MultipleChoiceQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const totalQuestionsInSession = 10;

  const generateQuestion = useCallback(() => {
    setSelectedOption(null);

    const table: AllowedTableNumber = selectedTableFilter === 'all'
      ? ALLOWED_TABLES[Math.floor(Math.random() * ALLOWED_TABLES.length)]
      : selectedTableFilter;

    const multiplier = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = table * multiplier;

    // Generate 3 plausible distractors
    const optionsSet = new Set<number>([correctAnswer]);
    let attempts = 0;
    while (optionsSet.size < 4 && attempts < 50) {
      attempts++;
      const delta = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = correctAnswer + delta * (Math.random() > 0.5 ? 1 : table);
      if (fake > 0 && fake !== correctAnswer) {
        optionsSet.add(fake);
      }
    }
    // Fallback if set not full
    while (optionsSet.size < 4) {
      optionsSet.add(correctAnswer + optionsSet.size * 2);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    // Friendly explanation
    const additionList = Array.from({ length: table }, () => multiplier).join(' + ');
    const explanation = `${table} × ${multiplier} = ${correctAnswer} (${additionList} = ${correctAnswer})`;

    setCurrentQuestion({
      id: `mc-${Date.now()}`,
      operationText: `${table} × ${multiplier}`,
      a: table,
      b: multiplier,
      correctAnswer,
      options,
      explanation,
    });
  }, [selectedTableFilter]);

  useEffect(() => {
    setQuestionIndex(1);
    setCorrectCount(0);
    setIsQuizFinished(false);
    generateQuestion();
  }, [selectedTableFilter, generateQuestion]);

  const handleSelectOption = (opt: number) => {
    if (selectedOption !== null || !currentQuestion) return;

    playPopSound();
    setSelectedOption(opt);
    const isCorrect = opt === currentQuestion.correctAnswer;

    if (isCorrect) {
      playSuccessSound();
      setCorrectCount((c) => c + 1);
      onEarnStars(2);
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      playGentleTryAgainSound();
    }
  };

  const handleNextQuestion = () => {
    playPopSound();
    if (questionIndex >= totalQuestionsInSession) {
      setIsQuizFinished(true);
      playVictoryFanfare();
      if (correctCount >= 7) {
        onUnlockBadge('quiz_star');
        onEarnStars(10);
      }
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    } else {
      setQuestionIndex((i) => i + 1);
      generateQuestion();
    }
  };

  const restartQuiz = () => {
    playPopSound();
    setQuestionIndex(1);
    setCorrectCount(0);
    setIsQuizFinished(false);
    generateQuestion();
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Title & Instructions */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Jogo 3: Escolha Múltipla</span>
          </div>
          <h2 className="font-display font-black text-2xl text-slate-900">
            Quiz das Estrelas
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Escolhe a opção correta entre as 4 respostas. Recebes logo o resultado!
          </p>
        </div>

        {/* Table Selector */}
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
                  ? 'bg-purple-600 text-white shadow-2xs'
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
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isQuizFinished ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Pergunta {questionIndex} de {totalQuestionsInSession}</span>
              <span className="text-emerald-700">Acertos: {correctCount} / {questionIndex - 1}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-purple-500 transition-all duration-300 rounded-full"
                style={{ width: `${(questionIndex / totalQuestionsInSession) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-md space-y-6 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
                Quanto é que dá esta multiplicação?
              </span>

              <div className="py-6 px-4 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-200/60 inline-block w-full">
                <span className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-wider">
                  {currentQuestion.operationText} = <span className="text-purple-600">?</span>
                </span>
              </div>

              {/* 4 Choices Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const hasAnswered = selectedOption !== null;

                  let buttonStyle = 'bg-slate-50 hover:bg-purple-50 border-2 border-slate-200/90 text-slate-800 hover:scale-102';
                  if (hasAnswered) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-rose-500 text-white border-2 border-rose-600 ring-4 ring-rose-200 opacity-90 animate-shake';
                    } else {
                      buttonStyle = 'bg-slate-100 text-slate-400 opacity-50 border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`p-5 rounded-2xl font-display font-black text-2xl sm:text-3xl transition-all cursor-pointer flex items-center justify-center gap-2 ${buttonStyle}`}
                    >
                      <span className="font-mono">{option}</span>
                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Box */}
              {selectedOption !== null && (
                <div
                  className={`p-5 rounded-2xl border text-left animate-pop space-y-2 ${
                    selectedOption === currentQuestion.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <p className="font-bold text-base">
                    {selectedOption === currentQuestion.correctAnswer
                      ? SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
                      : 'Boa tentativa! Vê a explicação do cálculo:'}
                  </p>
                  <p className="text-sm font-medium">
                    Explicação: <strong>{currentQuestion.explanation}</strong>
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>
                        {questionIndex >= totalQuestionsInSession
                          ? 'Ver Resultado Final'
                          : 'Próxima Pergunta'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Scorecard */
        <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-lg text-center space-y-6 animate-pop">
          <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-4 border-amber-300 shadow-md">
            <img
              src={IMAGES.trophy}
              alt="Troféu Campeão da Tabuada"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Quiz Concluído!
            </h3>
            <p className="text-slate-600 mt-1">
              Acertaste <strong className="text-purple-700 font-extrabold text-xl">{correctCount}</strong> em{' '}
              <strong>{totalQuestionsInSession}</strong> perguntas!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 inline-block text-amber-900 text-sm font-semibold max-w-md">
            {correctCount >= 8 ? (
              <span className="flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Excelente resultado! És um verdadeiro campeão da matemática!</span>
              </span>
            ) : correctCount >= 5 ? (
              <span>Muito bom esforço! Estás a evoluir dia após dia!</span>
            ) : (
              <span>Bom treino! Volta a rever a secção de Aprender e tenta de novo!</span>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base transition-transform active:scale-95 cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Jogar Novamente</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
