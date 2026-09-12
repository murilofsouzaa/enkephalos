import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { StudySubject } from '../types';

interface StudyCalendarProps {
  subjects: StudySubject[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onSelectSubject: (subjectId: string) => void;
  onOpenNewSubjectModal?: () => void;
  onRegisterReviewToday?: (subjectId: string) => void;
}

export const StudyCalendar: FC<StudyCalendarProps> = ({
  subjects,
  selectedDate,
  onSelectDate,
  onSelectSubject,
  onOpenNewSubjectModal,
  onRegisterReviewToday,
}) => {
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const isEventsExpanded = expandedDate === selectedDate;
  
  // Data de referência para exibição do calendário (inicia na data atual de estudo)
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    return new Date('2026-09-12T00:00:00');
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Mapeamento de eventos por data ISO 'YYYY-MM-DD'
  const dateEventsMap = useMemo(() => {
    const map = new Map<
      string,
      {
        completed: { subject: StudySubject; notes?: string }[];
        scheduled: StudySubject[];
      }
    >();

    subjects.forEach((sub) => {
      // Revisões concluídas no histórico
      sub.history.forEach((h) => {
        if (!map.has(h.date)) {
          map.set(h.date, { completed: [], scheduled: [] });
        }
        map.get(h.date)!.completed.push({ subject: sub, notes: h.notes });
      });

      // Próxima revisão agendada
      if (sub.nextReviewDate) {
        if (!map.has(sub.nextReviewDate)) {
          map.set(sub.nextReviewDate, { completed: [], scheduled: [] });
        }
        map.get(sub.nextReviewDate)!.scheduled.push(sub);
      }
    });

    return map;
  }, [subjects]);

  // Navegação
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (calendarView === 'month') {
        next.setMonth(next.getMonth() - 1);
      } else {
        next.setDate(next.getDate() - 7);
      }
      return next;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (calendarView === 'month') {
        next.setMonth(next.getMonth() + 1);
      } else {
        next.setDate(next.getDate() + 7);
      }
      return next;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-09-12T00:00:00'));
    onSelectDate('2026-09-12');
  };

  // Geração dos dias para a visualização Mês
  const monthDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: {
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    // Dias do mês anterior
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toISOString().slice(0, 10);
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-12',
      });
    }

    // Dias do mês atual
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-12',
      });
    }

    // Dias do próximo mês para completar grade de 35 ou 42 dias
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const next = new Date(year, month + 1, dayNum);
      const dateStr = next.toISOString().slice(0, 10);
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-12',
      });
    }

    return days;
  }, [year, month]);

  // Geração dos dias para a visualização Semana
  const weekDaysList = useMemo(() => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay();
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d.getDate(),
        isCurrentMonth: d.getMonth() === month,
        isToday: dateStr === '2026-09-12',
      });
    }
    return days;
  }, [currentDate, month]);

  const displayedDays = calendarView === 'month' ? monthDays : weekDaysList;

  return (
    <div className="w-full h-full flex flex-col justify-between gap-3 font-sans">
      {/* Top Bar: Mês/Ano, Botão + Nova Matéria e Navegação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--border-subtle,#292421)] pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[var(--text-main)]">
              {monthNames[month]} {year}
            </h3>
            <span className="text-[11px] text-[var(--text-dimmed)]">
              Planejador de Revisões Espaçadas
            </span>
          </div>

          {/* No mobile, botão + Nova Matéria no topo */}
          {onOpenNewSubjectModal && (
            <button
              type="button"
              onClick={onOpenNewSubjectModal}
              className="sm:hidden flex items-center gap-1 px-2.5 py-1 rounded text-[11px] bg-[var(--accent-color,#06b6d4)] text-white font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm"
              title="Cadastrar nova matéria de estudo"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Nova Matéria</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1 flex-wrap">
          {/* No desktop, botão + Nova Matéria */}
          {onOpenNewSubjectModal && (
            <button
              type="button"
              onClick={onOpenNewSubjectModal}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-[var(--accent-color,#06b6d4)] text-white font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm mr-1"
              title="Cadastrar nova matéria de estudo"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Nova Matéria</span>
            </button>
          )}

          {/* Alternar Mês / Semana */}
          <div className="flex items-center bg-[var(--bg-color)] border border-[var(--border-subtle)] rounded-lg p-0.5 text-xs mr-0.5">
            <button
              type="button"
              onClick={() => setCalendarView('month')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-all font-medium ${
                calendarView === 'month'
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'text-[var(--text-dimmed)] hover:text-[var(--text-main)]'
              }`}
            >
              Mês
            </button>
            <button
              type="button"
              onClick={() => setCalendarView('week')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-all font-medium ${
                calendarView === 'week'
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'text-[var(--text-dimmed)] hover:text-[var(--text-main)]'
              }`}
            >
              Semana
            </button>
          </div>

          <button
            type="button"
            onClick={handleToday}
            className="text-[11px] px-2 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-color)] text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer font-medium"
            title="Ir para hoje"
          >
            Hoje
          </button>

          <div className="flex items-center">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-md hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-md hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title="Próximo"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Dias da Semana Cabeçalho */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[var(--text-dimmed)] font-medium py-1">
        {weekDays.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Grade de Dias flex-1 para preencher altura */}
      <div className="grid grid-cols-7 gap-1 flex-1 items-stretch">
        {displayedDays.map(({ dateStr, dayNum, isCurrentMonth, isToday }) => {
          const events = dateEventsMap.get(dateStr);
          const isSelected = selectedDate === dateStr;
          const hasCompleted = events && events.completed.length > 0;
          const hasScheduled = events && events.scheduled.length > 0;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={`h-full min-h-[44px] sm:min-h-[54px] p-0.5 sm:p-1 rounded-md flex flex-col items-center justify-between transition-all relative border cursor-pointer ${
                isSelected
                  ? 'bg-[var(--accent-muted)] border-[var(--accent-color)] shadow-md ring-1 ring-[var(--accent-color)]'
                  : isToday
                  ? 'border-[var(--accent-color)]/70 bg-[var(--bg-color)]'
                  : isCurrentMonth
                  ? 'border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)]'
                  : 'opacity-30 border-transparent hover:opacity-70'
              }`}
            >
              {/* Número do Dia */}
              <span
                className={`text-[12px] leading-none rounded-full w-5 h-5 flex items-center justify-center ${
                  isToday
                    ? 'bg-[var(--accent-color)] text-white font-bold'
                    : isSelected
                    ? 'text-[var(--accent-color)] font-semibold'
                    : 'text-[var(--text-main)] font-normal'
                }`}
              >
                {dayNum}
              </span>

              {/* Indicadores de Eventos */}
              <div className="flex items-center justify-center gap-1 w-full mt-1 flex-wrap px-0.5">
                {/* Pontos de revisões concluídas */}
                {hasCompleted &&
                  events.completed.slice(0, 3).map((item, idx) => (
                    <span
                      key={`comp-${item.subject.id}-${idx}`}
                      className="w-1.5 h-1.5 rounded-full ring-1 ring-[var(--bg-surface)]"
                      style={{ backgroundColor: item.subject.color }}
                      title={`Concluída: ${item.subject.title}`}
                    />
                  ))}

                {/* Marcador de revisão agendada */}
                {hasScheduled && (
                  <span
                    className="w-1.5 h-1.5 rounded-full border border-amber-500 bg-amber-500/40"
                    title={`Agendada: ${events.scheduled.map((s) => s.title).join(', ')}`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalhes do Dia Selecionado sem bordas */}
      {selectedDate && (
        <div className="mt-2 p-3 bg-[var(--bg-color)] rounded-md text-xs flex flex-col gap-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1">
            <span className="font-medium text-[var(--text-main)]">
              Eventos de {selectedDate.split('-').reverse().join('/')}:
            </span>
            <button
              type="button"
              onClick={() => onSelectDate(null)}
              className="text-[10px] text-[var(--text-dimmed)] hover:text-[var(--text-main)] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" /> Limpar filtro
            </button>
          </div>

          {(() => {
            const ev = dateEventsMap.get(selectedDate);
            if (!ev || (ev.completed.length === 0 && ev.scheduled.length === 0)) {
              return (
                <p className="text-[var(--text-dimmed)] text-center py-1 text-[11px]">
                  Nenhuma revisão registrada ou agendada para este dia.
                </p>
              );
            }

            const allEvents: {
              id: string;
              subject: StudySubject;
              type: 'completed' | 'scheduled';
              notes?: string;
            }[] = [
              ...ev.completed.map((item, idx) => ({
                id: `comp-${item.subject.id}-${idx}`,
                subject: item.subject,
                type: 'completed' as const,
                notes: item.notes,
              })),
              ...ev.scheduled.map((sub, idx) => ({
                id: `sched-${sub.id}-${idx}`,
                subject: sub,
                type: 'scheduled' as const,
              })),
            ];

            const displayList = isEventsExpanded ? allEvents : allEvents.slice(0, 3);
            const hasMore = allEvents.length > 3;

            return (
              <div className="space-y-1.5">
                {displayList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectSubject(item.subject.id)}
                    className="flex items-center justify-between p-2 rounded-md bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.subject.color }}
                      />
                      <span className="font-medium text-[var(--text-main)] truncate">
                        {item.subject.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.type === 'completed' ? (
                        <span className="text-[11px] text-emerald-500 font-medium">
                          Revisão Realizada
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-amber-500 font-medium">
                            Revisão Prevista
                          </span>
                          {onRegisterReviewToday && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRegisterReviewToday(item.subject.id);
                              }}
                              className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                              title="Registrar revisão realizada hoje"
                            >
                              Revisar Hoje
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Botão Dropdown se houver mais de 3 eventos */}
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setExpandedDate(isEventsExpanded ? null : selectedDate)}
                    className="w-full mt-1.5 py-1.5 px-3 rounded text-xs font-semibold text-[var(--accent-color,#06b6d4)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    <span>
                      {isEventsExpanded
                        ? 'Ver menos'
                        : `Ver mais (${allEvents.length - 3} matérias)`}
                    </span>
                    {isEventsExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default StudyCalendar;
