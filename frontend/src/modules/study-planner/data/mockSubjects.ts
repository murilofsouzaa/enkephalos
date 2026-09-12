import type { StudySubject } from '../types';

export const INITIAL_STUDY_SUBJECTS: StudySubject[] = [];

const STORAGE_KEY = 'enkephalos-study-subjects-v2';

export function loadSavedSubjects(): StudySubject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Erro ao ler subjects do localStorage:', err);
    return [];
  }
}

export function saveSubjects(subjects: StudySubject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.error('Erro ao salvar subjects no localStorage:', err);
  }
}

export function resetToDefaultSubjects(): StudySubject[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}
