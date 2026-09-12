import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { X, Pipette } from 'lucide-react';
import type { StudySubject } from '../types';

interface NewSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubject: (newSubject: StudySubject) => void;
}

const PRESET_COLORS = [
  '#06b6d4', // Cyan
  '#2563eb', // Blue
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#a855f7', // Violet
  '#f43f5e', // Rose
  '#14b8a6', // Teal
  '#ec4899', // Pink
];

export const NewSubjectModal: FC<NewSubjectModalProps> = ({
  isOpen,
  onClose,
  onAddSubject,
}) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [startDate, setStartDate] = useState('2026-09-12');
  const [notes, setNotes] = useState('');

  // Fechar ao pressionar ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Próxima revisão recomendada após o primeiro aprendizado é em +1 dia
    const nextDate = new Date(startDate + 'T00:00:00');
    nextDate.setDate(nextDate.getDate() + 1);

    const newSubject: StudySubject = {
      id: `subject-${Date.now()}`,
      title: title.trim(),
      color,
      createdAt: startDate,
      history: [
        {
          date: startDate,
          dayIndex: 0,
          notes: notes.trim() || 'Primeiro aprendizado',
        },
      ],
      nextReviewDate: nextDate.toISOString().slice(0, 10),
      notes: notes.trim(),
    };

    onAddSubject(newSubject);
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--bg-surface,#191614)] border border-[var(--border-subtle,#292421)] rounded-md p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-[var(--text-main)] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">Novo Tópico</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[var(--text-dimmed)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Título da Disciplina */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-muted)]">
              Título da Matéria *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Teoria dos Grafos, Algoritmos..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[var(--bg-color)] border border-[var(--border-subtle)] focus:border-[var(--accent-color)] text-sm rounded px-3 py-2 outline-none transition-all placeholder-[var(--text-dimmed)] text-[var(--text-main)]"
            />
          </div>

          {/* Data do Primeiro Estudo (Dia 0) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-muted)]">
              Data do Primeiro Estudo (Dia 0)
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[var(--bg-color)] border border-[var(--border-subtle)] focus:border-[var(--accent-color)] text-sm rounded px-3 py-2 outline-none transition-all text-[var(--text-main)]"
            />
          </div>

          {/* Seletor de Cor no Gráfico */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-muted)]">
                Cor no Gráfico
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dimmed)] uppercase">
                {color}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded transition-all cursor-pointer flex items-center justify-center ${
                    color.toLowerCase() === c.toLowerCase()
                      ? 'ring-2 ring-[var(--accent-color,#06b6d4)] scale-110 shadow-sm'
                      : 'opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Selecionar cor ${c}`}
                />
              ))}

              {/* Seletor de cor livre no espectro RGB */}
              <label 
                className="relative flex items-center justify-center w-7 h-7 rounded border border-[var(--border-subtle)] bg-[var(--bg-color)] hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-all ml-1 group"
                title="Escolher cor personalizada no espectro RGB"
              >
                <Pipette className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Notas / Observações */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--text-muted)]">
              Anotações Adicionais
            </label>
            <textarea
              rows={2}
              placeholder="Tópicos abordados, conceitos ou referências..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-[var(--bg-color)] border border-[var(--border-subtle)] focus:border-[var(--accent-color)] text-sm rounded px-3 py-2 outline-none transition-all placeholder-[var(--text-dimmed)] text-[var(--text-main)] resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-semibold bg-[var(--accent-color)] text-white hover:opacity-95 shadow-sm transition-all cursor-pointer"
            >
              Adicionar Matéria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSubjectModal;
