export interface ReviewPoint {
  date: string;       // Formato ISO 'YYYY-MM-DD'
  dayIndex: number;   // Dia relativo ao início do estudo (ex: 0, 1, 3, 6)
  notes?: string;
}

export interface StudySubject {
  id: string;
  title: string;
  category?: string;
  color: string;      // Cor da linha no gráfico (hexadecimal ou cor de tema)
  history: ReviewPoint[];
  nextReviewDate: string; // Formato ISO 'YYYY-MM-DD'
  notes?: string;
  createdAt: string;  // Formato ISO 'YYYY-MM-DD'
}

export type ViewMode = 'single' | 'multi';

export interface CalendarDayInfo {
  date: string;       // 'YYYY-MM-DD'
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  reviewsCompleted: StudySubject[];
  reviewsScheduled: StudySubject[];
}
