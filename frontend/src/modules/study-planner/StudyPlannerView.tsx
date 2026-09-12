import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { CheckCircle } from 'lucide-react';
import type { StudySubject, ViewMode } from './types';
import { 
  loadSavedSubjects, 
  saveSubjects 
} from './data/mockSubjects';
import { 
  calculateNextReviewDate, 
  getDaysBetween, 
  getRetentionAtDay 
} from './utils/ebbinghausMath';
import { EbbinghausChart } from './components/EbbinghausChart';
import { StudyCalendar } from './components/StudyCalendar';
import { NewSubjectModal } from './components/NewSubjectModal';
import { EbbinghausTheorySection } from './components/EbbinghausTheorySection';

export const StudyPlannerView: FC = () => {
  const todayStr = '2026-09-12';

  const [subjects, setSubjects] = useState<StudySubject[]>(() => loadSavedSubjects());
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(() => {
    return subjects[0]?.id || null;
  });
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Intervalo configurável: quantos dias até atingir 80% no 1º aprendizado
  const [baseDaysToForget, setBaseDaysToForgetState] = useState<number>(() => {
    const saved = localStorage.getItem('enkephalos-ebbinghaus-base-days');
    return saved ? Number(saved) : 1;
  });

  const handleBaseDaysChange = (days: number) => {
    setBaseDaysToForgetState(days);
    localStorage.setItem('enkephalos-ebbinghaus-base-days', String(days));
  };

  // Sincroniza salvamento no localStorage sempre que subjects mudar
  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  // Matéria efetivamente selecionada derivada do estado
  const activeSelectedSubjectId = useMemo(() => {
    if (selectedSubjectId && subjects.some((s) => s.id === selectedSubjectId)) {
      return selectedSubjectId;
    }
    return subjects[0]?.id || null;
  }, [subjects, selectedSubjectId]);

  // Exibe notificação temporária
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Registrar revisão concluída hoje
  const handleRegisterReviewToday = (subjectId: string) => {
    setSubjects((prevSubjects) => {
      return prevSubjects.map((sub) => {
        if (sub.id !== subjectId) return sub;

        // Se já revisou hoje, não duplica
        if (sub.history.some((h) => h.date === todayStr)) {
          return sub;
        }

        const firstDateStr = sub.history[0]?.date || sub.createdAt || todayStr;
        const dayIndex = Math.max(0, getDaysBetween(firstDateStr, todayStr));

        const updatedHistory = [
          ...sub.history,
          {
            date: todayStr,
            dayIndex,
            notes: `Revisão R${sub.history.length} realizada`,
          },
        ];

        const tempSubject: StudySubject = {
          ...sub,
          history: updatedHistory,
        };

        const newNextReviewDate = calculateNextReviewDate(tempSubject, baseDaysToForget);

        showToast(`Revisão de "${sub.title}" registrada.`);

        return {
          ...sub,
          history: updatedHistory,
          nextReviewDate: newNextReviewDate,
        };
      });
    });
  };

  // Adicionar novo tópico
  const handleAddSubject = (newSubject: StudySubject) => {
    setSubjects((prev) => [newSubject, ...prev]);
    setSelectedSubjectId(newSubject.id);
    showToast(`Matéria "${newSubject.title}" adicionada com sucesso.`);
  };

  // Métricas rápidas agregadas
  const stats = useMemo(() => {
    if (subjects.length === 0) {
      return {
        avgRetention: '--',
        reviewsDueCount: 0,
        totalSubjects: 0,
      };
    }

    let totalRetention = 0;
    let reviewsDueCount = 0;

    subjects.forEach((sub) => {
      const firstDateStr = sub.history[0]?.date || sub.createdAt || todayStr;
      const currentDayIndex = Math.max(0, getDaysBetween(firstDateStr, todayStr));
      totalRetention += getRetentionAtDay(sub, currentDayIndex, baseDaysToForget);

      const daysUntilNext = getDaysBetween(todayStr, sub.nextReviewDate);
      if (daysUntilNext <= 0) {
        reviewsDueCount++;
      }
    });

    const avgRetention = (totalRetention / subjects.length).toFixed(0);

    return {
      avgRetention: `${avgRetention}%`,
      reviewsDueCount,
      totalSubjects: subjects.length,
    };
  }, [subjects, todayStr, baseDaysToForget]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] transition-colors duration-300 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Banner Superior / Header da Página sem ícones decorativos */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle,#292421)] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--accent-color,#06b6d4)]">
              Planejador de Revisões & Curva do Esquecimento
            </h1>
          </div>

          {/* Métricas Rápidas sem formato de card */}
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Média de Retenção */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-[var(--text-dimmed)] font-medium">Retenção Média</span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-500 leading-tight">{stats.avgRetention}</span>
            </div>

            <div className="h-9 w-px bg-[var(--border-subtle)] hidden sm:block" />

            {/* Revisões Pendentes */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-[var(--text-dimmed)] font-medium">Revisões Pendentes</span>
              <span className={`text-xl sm:text-2xl font-extrabold leading-tight ${stats.reviewsDueCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {stats.reviewsDueCount} hoje
              </span>
            </div>
          </div>
        </div>

        {/* Notificação Toast */}
        {notification && (
          <div className="bg-[var(--accent-color)] text-white px-3.5 py-1.5 rounded-md shadow-md flex items-center gap-2 text-xs font-medium animate-in slide-in-from-top duration-200">
            <CheckCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{notification}</span>
          </div>
        )}

        {/* Painel Integrado Unificado: Gráfico e Calendário juntos em um único container */}
        <div className="w-full bg-[var(--bg-surface)]/25 border border-[var(--border-subtle)]/70 rounded-lg p-3 sm:p-6 shadow-xs backdrop-blur-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle,#292421)]">
            {/* 1º: Gráfico da Curva do Esquecimento */}
            <div className="pb-6 lg:pb-0 lg:pr-4 flex flex-col">
              <EbbinghausChart
                subjects={subjects}
                selectedSubjectId={activeSelectedSubjectId}
                viewMode={viewMode}
                onSelectSubject={setSelectedSubjectId}
                onToggleViewMode={setViewMode}
                baseDaysToForget={baseDaysToForget}
                onBaseDaysChange={handleBaseDaysChange}
              />
            </div>

            {/* 2º: Calendário de Revisões Espaçadas */}
            <div className="pt-6 lg:pt-0 lg:pl-4 flex flex-col">
              <StudyCalendar
                subjects={subjects}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onSelectSubject={(id) => {
                  setSelectedSubjectId(id);
                  setViewMode('single');
                }}
                onOpenNewSubjectModal={() => setIsModalOpen(true)}
                onRegisterReviewToday={handleRegisterReviewToday}
              />
            </div>
          </div>
        </div>

        {/* Seção Aprofundada Teórica e Biográfica de Hermann Ebbinghaus */}
        <EbbinghausTheorySection />

      </div>

      {/* Modal de Nova Matéria */}
      <NewSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSubject={handleAddSubject}
      />
    </div>
  );
};

export default StudyPlannerView;
