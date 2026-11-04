import React from 'react';
import { Badge } from '../types/math';
import { X, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface TrophiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  totalStars: number;
}

export const TrophiesModal: React.FC<TrophiesModalProps> = ({
  isOpen,
  onClose,
  badges,
  totalStars,
}) => {
  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-pop">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            playPopSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-2xs">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-slate-900">
              Galeria de Troféus
            </h3>
            <p className="text-xs text-slate-500">
              Desbloqueaste {unlockedCount} de {badges.length} medalhas
            </p>
          </div>
        </div>

        {/* Stars summary */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-sm text-slate-800">Total de Estrelas Ganhas:</span>
          </div>
          <span className="font-display font-black text-2xl text-amber-600">
            {totalStars} ⭐
          </span>
        </div>

        {/* Badges List */}
        <div className="space-y-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                b.unlocked
                  ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  b.unlocked ? 'bg-amber-200 shadow-2xs' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {b.unlocked ? b.icon : '🔒'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {b.title}
                  </h4>
                  {b.unlocked && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3 h-3" />
                      <span>Conquistado</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-snug mt-0.5">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm transition-transform active:scale-95 shadow-xs cursor-pointer"
          >
            Continuar a Jogar!
          </button>
        </div>
      </div>
    </div>
  );
};
