import type { StudySubject } from '../types';

/**
 * Retorna a taxa de decaimento k para a i-ésima revisão (i=0 é o primeiro aprendizado).
 * baseDaysToForget é o número de dias configurável até a retenção cair para 80% no 1º aprendizado.
 * Conforme o número de revisões aumenta, k diminui (estabilidade da memória aumenta).
 */
export function getDecayRate(reviewIndex: number, baseDaysToForget: number = 1): number {
  const safeBaseDays = Math.max(0.1, baseDaysToForget);
  const baseDecay = Math.log(100 / 80) / safeBaseDays; // ln(100/80) / baseDays
  const stabilityFactor = 1 + 0.85 * Math.max(0, reviewIndex);
  return baseDecay / stabilityFactor;
}

/**
 * Calcula a retenção R(t) percentual dado o tempo decorrido deltaT desde o reforço e o índice da revisão.
 * R(t) = 100 * exp(-k * deltaT)
 */
export function calculateRetention(deltaT: number, reviewIndex: number, baseDaysToForget: number = 1): number {
  if (deltaT <= 0) return 100;
  const k = getDecayRate(reviewIndex, baseDaysToForget);
  const ret = 100 * Math.exp(-k * deltaT);
  return Math.max(0, Math.min(100, ret));
}

export interface CurveSegment {
  subjectId: string;
  subjectTitle: string;
  color: string;
  reviewIndex: number;
  startDay: number;
  endDay: number;
  isGhost: boolean;
  points: { day: number; retention: number }[];
}

export interface JumpLine {
  day: number;
  fromRetention: number;
  toRetention: number;
  color: string;
  reviewIndex: number;
}

export interface ChartAnnotation {
  day: number;
  retention: number;
  type: 'first-learned' | 'reviewed';
  label: string;
}

/**
 * Gera os dados geométricos das curvas de uma matéria para um determinado horizonte de dias (dias, meses ou anos convertidos em dias).
 */
export function generateSubjectCurves(
  subject: StudySubject,
  maxDays: number = 30,
  includeGhosts: boolean = true,
  baseDaysToForget: number = 1
): {
  activeSegments: CurveSegment[];
  ghostSegments: CurveSegment[];
  jumpLines: JumpLine[];
  annotations: ChartAnnotation[];
} {
  const activeSegments: CurveSegment[] = [];
  const ghostSegments: CurveSegment[] = [];
  const jumpLines: JumpLine[] = [];
  const annotations: ChartAnnotation[] = [];

  // Ordena o histórico por dayIndex
  const sortedHistory = [...subject.history].sort((a, b) => a.dayIndex - b.dayIndex);
  if (sortedHistory.length === 0) {
    sortedHistory.push({ date: subject.createdAt || '2026-09-01', dayIndex: 0 });
  }

  // Primeiro aprendizado
  annotations.push({
    day: sortedHistory[0].dayIndex,
    retention: 100,
    type: 'first-learned',
    label: 'First learned',
  });

  // Granularidade adaptativa: garante cerca de 200 a 300 pontos para qualquer escala (dias, meses ou anos)
  const step = Math.max(0.05, maxDays / 250);

  for (let i = 0; i < sortedHistory.length; i++) {
    const currentPoint = sortedHistory[i];
    const nextPoint = sortedHistory[i + 1];
    const startDay = currentPoint.dayIndex;
    const endDay = nextPoint ? nextPoint.dayIndex : maxDays;

    if (i > 0) {
      annotations.push({
        day: startDay,
        retention: 100,
        type: 'reviewed',
        label: 'Reviewed',
      });
    }

    // Segmento Ativo (real)
    const points: { day: number; retention: number }[] = [];
    for (let day = startDay; day <= Math.min(endDay, maxDays); day += step) {
      const deltaT = day - startDay;
      const ret = calculateRetention(deltaT, i, baseDaysToForget);
      points.push({ day, retention: ret });
    }
    // Assegura inclusão do ponto final
    const finalDay = Math.min(endDay, maxDays);
    if (points.length === 0 || points[points.length - 1].day < finalDay) {
      points.push({ day: finalDay, retention: calculateRetention(finalDay - startDay, i, baseDaysToForget) });
    }

    activeSegments.push({
      subjectId: subject.id,
      subjectTitle: subject.title,
      color: subject.color,
      reviewIndex: i,
      startDay,
      endDay: finalDay,
      isGhost: false,
      points,
    });

    // Se há uma próxima revisão no histórico, adicionar a linha vertical de reforço (jump)
    if (nextPoint && nextPoint.dayIndex <= maxDays) {
      const deltaT = nextPoint.dayIndex - startDay;
      const retentionBeforeJump = calculateRetention(deltaT, i, baseDaysToForget);
      jumpLines.push({
        day: nextPoint.dayIndex,
        fromRetention: retentionBeforeJump,
        toRetention: 100,
        color: subject.color,
        reviewIndex: i + 1,
      });

      // Se fantasmas habilitados, continuar a curva anterior além do salto
      if (includeGhosts) {
        const ghostPoints: { day: number; retention: number }[] = [];
        for (let day = nextPoint.dayIndex; day <= maxDays; day += step) {
          const deltaT = day - startDay;
          const ret = calculateRetention(deltaT, i, baseDaysToForget);
          if (ret < 58) {
            ghostPoints.push({ day, retention: ret });
            break;
          }
          ghostPoints.push({ day, retention: ret });
        }

        if (ghostPoints.length > 1) {
          ghostSegments.push({
            subjectId: subject.id,
            subjectTitle: subject.title,
            color: '#9ca3af',
            reviewIndex: i,
            startDay: nextPoint.dayIndex,
            endDay: ghostPoints[ghostPoints.length - 1].day,
            isGhost: true,
            points: ghostPoints,
          });
        }
      }
    }
  }

  return { activeSegments, ghostSegments, jumpLines, annotations };
}

/**
 * Calcula a retenção estimada de uma matéria em um dia específico t (em dayIndex).
 */
export function getRetentionAtDay(subject: StudySubject, day: number, baseDaysToForget: number = 1): number {
  const sorted = [...subject.history].sort((a, b) => a.dayIndex - b.dayIndex);
  if (sorted.length === 0) return 100;

  if (day < sorted[0].dayIndex) return 100;

  let activeReviewIdx = 0;
  let activeStartDay = sorted[0].dayIndex;

  for (let i = 0; i < sorted.length; i++) {
    if (day >= sorted[i].dayIndex) {
      activeReviewIdx = i;
      activeStartDay = sorted[i].dayIndex;
    } else {
      break;
    }
  }

  return calculateRetention(day - activeStartDay, activeReviewIdx, baseDaysToForget);
}

/**
 * Calcula a data estimada da próxima revisão baseada no histórico atual e no intervalo base configurável
 */
export function calculateNextReviewDate(subject: StudySubject, baseDaysToForget: number = 1): string {
  const sorted = [...subject.history].sort((a, b) => a.dayIndex - b.dayIndex);
  const lastReview = sorted[sorted.length - 1] || { date: new Date().toISOString().slice(0, 10), dayIndex: 0 };
  const lastDate = new Date(lastReview.date + 'T00:00:00');

  const reviewCount = sorted.length;
  const decayRate = getDecayRate(reviewCount - 1, baseDaysToForget);
  const intervalDays = Math.round(1 / decayRate * Math.log(100 / 80));
  const safeInterval = Math.max(1, intervalDays);

  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + safeInterval);

  return nextDate.toISOString().slice(0, 10);
}

/**
 * Calcula os dias de diferença entre duas datas ISO YYYY-MM-DD
 */
export function getDaysBetween(startDateStr: string, endDateStr: string): number {
  const d1 = new Date(startDateStr + 'T00:00:00').getTime();
  const d2 = new Date(endDateStr + 'T00:00:00').getTime();
  const diffTime = d2 - d1;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
