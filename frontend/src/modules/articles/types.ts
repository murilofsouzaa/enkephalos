export interface ArticleHeader {
  id: string;
  title: string;
  level: number; // 1, 2, or 3
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category?: string;
  date: string; // e.g. "2026-04-01"
  displayDate: string; // e.g. "1 de abril de 2026"
  period: string; // e.g. "2026 - Abril"
  tags: string[];
  status?: string;
  excerpt: string;
  readTime: string;
  discussionCount?: number;
  highlightQuote?: string;
  headers: ArticleHeader[];
  contentRaw: string;
}

export interface StudyPeriodGroup {
  period: string;
  count: number;
  articles: Article[];
  elementId: string;
}
