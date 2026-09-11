import type { Article, StudyPeriodGroup } from '../types';
import rawArticles from './articlesData.json';

export const ARTICLES_DATA: Article[] = rawArticles as Article[];

export function getGroupedArticlesByPeriod(): StudyPeriodGroup[] {
  const groupsMap = new Map<string, Article[]>();

  ARTICLES_DATA.forEach((article) => {
    const period = article.period;
    if (!groupsMap.has(period)) {
      groupsMap.set(period, []);
    }
    groupsMap.get(period)!.push(article);
  });

  return Array.from(groupsMap.entries()).map(([period, articles]) => ({
    period,
    count: articles.length,
    articles,
    elementId: `period-${period.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  }));
}
