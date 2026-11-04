import React, { useState } from 'react';
import { AllowedTableNumber, ALLOWED_TABLES } from '../types/math';
import { TABLES_INFO, MATRIX_OBJECTS } from '../data/multiplicationData';
import { Volume2, Lightbulb, Sparkles, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';
import { playPopSound, speakMathPhrase } from '../utils/audio';

interface ExploreTabuadaProps {
  selectedTable: AllowedTableNumber;
  setSelectedTable: (table: AllowedTableNumber) => void;
  onGoToGames: () => void;
}

export const ExploreTabuada: React.FC<ExploreTabuadaProps> = ({
  selectedTable,
  setSelectedTable,
  onGoToGames,
}) => {
  const [multiplier, setMultiplier] = useState<number>(4);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🍎');
  const [showProblemSolution, setShowProblemSolution] = useState<boolean>(false);

  const currentInfo = TABLES_INFO[selectedTable];
  const result = selectedTable * multiplier;

  // Generate addition formula (e.g., 4 + 4 + 4 = 12 for 3 x 4)
  const additionArray = Array.from({ length: selectedTable }, () => multiplier);
  const additionFormula = additionArray.join(' + ') + ` = ${result}`;

  const speakEquation = (a: number, b: number, res: number) => {
    playPopSound();
    const phrase = `${a} vezes ${b} é igual a ${res}`;
    speakMathPhrase(phrase);
  };

  const handleSelectTable = (tbl: AllowedTableNumber) => {
    playPopSound();
    setSelectedTable(tbl);
    setShowProblemSolution(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner with Pipas Robot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden border-4 border-white/60 shadow-md bg-white">
            <img
              src="/src/assets/images/mascote_pipas_robo_1793818382087.jpg"
              alt="Mascote Robô Pipas da Tabuada"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Matemática Divertida · 3.º Ano</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white">
              Olá, pequeno génio! Vamos dominar a tabuada?
            </h1>
            <p className="mt-2 text-white/95 text-sm sm:text-base max-w-2xl leading-relaxed">
              Aqui aprendes a tabuada do <strong className="text-amber-100 font-bold">1, 2, 3, 4, 5, 6 e 10</strong> com desenhos, truques mágicos e jogos super divertidos.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={onGoToGames}
                className="px-5 py-2.5 rounded-xl bg-white text-amber-900 font-extrabold text-sm hover:bg-amber-50 transition-transform active:scale-95 shadow-xs flex items-center gap-2"
              >
                <span>Ir para os Jogos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => speakMathPhrase(currentInfo.audioPhrase)}
                className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir dica do Pipas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Selector Pills (STRICTLY 1, 2, 3, 4, 5, 6, 10) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="font-display font-extrabold text-lg text-slate-900">
              Escolhe uma Tabuada para Explorar:
            </h2>
            <p className="text-xs text-slate-500">
              Tabuadas essenciais do 3.º ano de escolaridade
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {ALLOWED_TABLES.map((num) => {
            const isSelected = selectedTable === num;
            return (
              <button
                key={num}
                onClick={() => handleSelectTable(num)}
                className={`py-3 px-2 rounded-xl font-display font-black text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm ring-4 ring-amber-300 scale-105'
                    : 'bg-amber-50/60 hover:bg-amber-100/80 text-slate-800 border border-amber-200/60 hover:scale-102'
                }`}
              >
                <span className="block text-xs uppercase font-bold text-amber-900/60">Tabuada</span>
                <span className="text-2xl sm:text-3xl font-black">{num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Zone Sandbox: Stage (Left) & Concepts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stage: Interactive Visual Matrix (Cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Laboratório Visual
              </span>
              <h3 className="font-display font-black text-xl text-slate-900">
                Como funciona {selectedTable} × {multiplier}?
              </h3>
            </div>

            {/* Object Emoji Picker for Kids */}
            <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200/60">
              {MATRIX_OBJECTS.slice(0, 5).map((obj) => (
                <button
                  key={obj.emoji}
                  onClick={() => {
                    playPopSound();
                    setSelectedEmoji(obj.emoji);
                  }}
                  title={obj.name}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-transform ${
                    selectedEmoji === obj.emoji
                      ? 'bg-white shadow-xs scale-110'
                      : 'hover:scale-105'
                  }`}
                >
                  {obj.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Big Equation Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-5 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-display text-amber-600">
                {selectedTable}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-400">×</span>
              <span className="text-4xl sm:text-5xl font-black font-display text-slate-800">
                {multiplier}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-400">=</span>
              <span className="text-4xl sm:text-5xl font-black font-display text-emerald-600 animate-pop">
                {result}
              </span>
            </div>

            <button
              onClick={() => speakEquation(selectedTable, multiplier, result)}
              className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Ouvir Conta</span>
            </button>
          </div>

          {/* Addition explanation */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700">
            <span className="font-bold text-slate-900">Significado da multiplicação: </span>
            <span>
              São <strong className="text-amber-700">{selectedTable} grupos</strong> de <strong className="text-amber-700">{multiplier}</strong> elementos:
            </span>
            <div className="mt-1 font-mono font-bold text-amber-800 text-sm sm:text-base">
              {additionFormula}
            </div>
          </div>

          {/* Multiplier Quick Buttons */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
              <span>Muda o multiplicador (1 a 10):</span>
              <span className="text-amber-700 font-mono">multiplicador = {multiplier}</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    playPopSound();
                    setMultiplier(num);
                  }}
                  className={`py-2 rounded-lg font-bold text-sm transition-all ${
                    multiplier === num
                      ? 'bg-amber-500 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* The Visual Grid / Groups */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Grelha visual de elementos ({selectedTable} filas de {multiplier}):</span>
              <span>Total: {result} {selectedEmoji}</span>
            </div>

            <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/50 min-h-[140px] max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                {Array.from({ length: selectedTable }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-white border border-amber-200/40 shadow-2xs"
                  >
                    <span className="text-[11px] font-bold text-amber-800/60 w-16 shrink-0">
                      Grupo {rowIndex + 1}:
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {Array.from({ length: multiplier }).map((_, colIndex) => (
                        <span
                          key={colIndex}
                          className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-base hover:scale-125 transition-transform"
                        >
                          {selectedEmoji}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Number line jumps */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Reta Numérica: Saltos de {selectedTable} em {selectedTable}</span>
              <span className="text-amber-600">{multiplier} saltos até ao {result}</span>
            </div>

            <div className="overflow-x-auto pb-2 pt-1">
              <div className="flex items-center gap-1.5 min-w-[500px]">
                {Array.from({ length: 11 }).map((_, step) => {
                  const stepValue = selectedTable * step;
                  const isCurrent = step === multiplier;
                  const isPassed = step <= multiplier;

                  return (
                    <div key={step} className="flex-1 flex flex-col items-center">
                      <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                        +{step === 0 ? '0' : selectedTable}
                      </div>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-amber-500 text-white shadow-xs scale-110 ring-2 ring-amber-300'
                            : isPassed
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                      >
                        {stepValue}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 font-mono">
                        {selectedTable}×{step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Concept Deck, Mnemonic Trick & Full Table (Cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mnemonic Trick Box: "O Super Truque do Pipas" */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <Lightbulb className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-100">
                  Dica de Mestre do Pipas
                </span>
                <h3 className="font-display font-black text-xl text-white">
                  {currentInfo.trickTitle}
                </h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/95">
              {currentInfo.trickDescription}
            </p>

            <div className="p-3 bg-white/15 backdrop-blur-xs rounded-xl text-xs font-mono font-bold text-amber-100">
              Exemplo: {currentInfo.example}
            </div>
          </div>

          {/* Real Life Word Problem for 3rd Graders */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Problema do Quotidiano (3.º Ano)
              </span>
            </div>

            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              {currentInfo.realLifeExample}
            </p>

            <button
              onClick={() => {
                playPopSound();
                setShowProblemSolution(!showProblemSolution);
              }}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              {showProblemSolution ? 'Ocultar explicação' : 'Como calcular este problema?'}
            </button>

            {showProblemSolution && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-pop">
                <strong>Explicação matemática:</strong> Juntámos as quantidades repetidas. A operação de multiplicação simplifica a soma e dá logo o resultado final!
              </div>
            )}
          </div>

          {/* Full Table Cards List (1 to 10) with Audio Speak */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h4 className="font-display font-extrabold text-base text-slate-900">
                  Tabuada Completa do {selectedTable}
                </h4>
              </div>
              <span className="text-xs text-slate-400">1 a 10</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const itemRes = selectedTable * num;
                const isSelected = multiplier === num;
                return (
                  <div
                    key={num}
                    onClick={() => {
                      playPopSound();
                      setMultiplier(num);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-100/70 border-amber-400 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50/50 border-slate-200/80'
                    }`}
                  >
                    <span className="font-mono font-bold text-xs text-slate-800">
                      {selectedTable} × {num} = <strong className="text-amber-700 font-black">{itemRes}</strong>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakEquation(selectedTable, num, itemRes);
                      }}
                      title="Ouvir"
                      className="p-1 rounded-md text-slate-400 hover:text-amber-600 hover:bg-white"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
