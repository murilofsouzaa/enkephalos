import { useState, useEffect, useMemo, useRef, type FC } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowRight, 
  X, 
  Loader2, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { ARTICLES_DATA } from '../data/articlesData';
import type { Article } from '../types';

export interface TreeNode {
  id: string;
  name: string;
  fullPath: string;
  depth: number;
  children: TreeNode[];
  articles: Article[];
  totalCount: number;
}

function buildObsidianTree(articles: Article[]): TreeNode[] {
  const root: TreeNode = {
    id: 'root',
    name: 'root',
    fullPath: '',
    depth: -1,
    children: [],
    articles: [],
    totalCount: 0
  };
  const nodeMap = new Map<string, TreeNode>();
  nodeMap.set('', root);

  articles.forEach((article) => {
    const rawCat = article.category || 'Geral';
    const parts = rawCat.split(' · ').map((p) => p.trim()).filter(Boolean);

    let currentPath = '';
    let parent = root;

    parts.forEach((part, idx) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      let node = nodeMap.get(currentPath);
      if (!node) {
        const slug = currentPath.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        node = {
          id: `folder-${slug}`,
          name: part,
          fullPath: currentPath,
          depth: idx,
          children: [],
          articles: [],
          totalCount: 0
        };
        nodeMap.set(currentPath, node);
        parent.children.push(node);
      }
      parent = node;
    });

    parent.articles.push(article);
  });

  function calcTotal(node: TreeNode): number {
    node.children.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    let sum = node.articles.length;
    for (const child of node.children) {
      sum += calcTotal(child);
    }
    node.totalCount = sum;
    return sum;
  }

  calcTotal(root);
  return root.children;
}

function collectAllNodeIds(nodes: TreeNode[]): string[] {
  let ids: string[] = [];
  for (const node of nodes) {
    ids.push(node.id);
    if (node.children.length > 0) {
      ids = ids.concat(collectAllNodeIds(node.children));
    }
  }
  return ids;
}

// Recursive component representing an Obsidian folder and all its subfolders/notes
interface FolderTreeNodeProps {
  node: TreeNode;
  collapsedFolders: Record<string, boolean>;
  onToggle: (id: string) => void;
  searchTerm: string;
}

const FolderTreeNodeView: FC<FolderTreeNodeProps> = ({
  node,
  collapsedFolders,
  onToggle,
  searchTerm
}) => {
  const isCollapsed = !searchTerm && !!collapsedFolders[node.id];
  const hasChildren = node.children.length > 0;
  const hasArticles = node.articles.length > 0;

  const isRoot = node.depth === 0;
  const isSub1 = node.depth === 1;

  return (
    <section id={node.id} className="scroll-mt-24 space-y-4">
      {/* Folder Header */}
      <div
        onClick={() => onToggle(node.id)}
        className={`flex items-center justify-between py-2.5 px-3 rounded-md border border-[var(--border-subtle,#292420)] bg-[var(--bg-surface,#181614)]/60 hover:bg-[var(--bg-surface-hover,#221d19)] cursor-pointer select-none group transition-colors`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="text-[var(--accent-color,#f59e0b)] shrink-0">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 transition-transform" />
            )}
          </div>
          <div className="text-[var(--accent-color,#f59e0b)] shrink-0">
            {isCollapsed ? (
              <Folder className="w-4 h-4" />
            ) : (
              <FolderOpen className="w-4 h-4" />
            )}
          </div>
          <span
            className={`truncate font-serif ${
              isRoot
                ? 'text-xl font-bold text-[var(--text-main,#f3f0ea)]'
                : isSub1
                ? 'text-base font-semibold text-[var(--text-main,#f3f0ea)]'
                : 'text-sm font-medium text-[var(--text-main,#f3f0ea)]'
            } group-hover:text-[var(--accent-color,#f59e0b)] transition-colors`}
          >
            {node.name}
          </span>
        </div>

        <span className="text-xs font-['Lexend',sans-serif] text-[var(--text-dimmed,#78716c)] shrink-0 ml-2">
          {node.totalCount} {node.totalCount === 1 ? 'estudo' : 'estudos'}
        </span>
      </div>

      {/* Expanded Folder Content (Subfolders & Notes) */}
      {!isCollapsed && (
        <div className="space-y-6 pl-3 sm:pl-5 border-l-2 border-[var(--border-subtle,#26211e)] ml-3 sm:ml-4 animate-in fade-in duration-150">
          {/* Direct Articles in this folder */}
          {hasArticles && (
            <div className="space-y-4 pt-1">
              {node.articles.map((article) => (
                <article
                  key={article.id}
                  className="border-b border-[var(--border-subtle,#1f1b18)] pb-5 last:border-b-0 last:pb-0"
                >
                  <Link
                    to={`/estudos/${article.slug}`}
                    className="group block py-2 cursor-pointer transition-colors duration-200"
                  >
                    <h3 className="text-[16px] font-semibold text-[var(--text-main,#f3f0ea)] group-hover:text-[var(--accent-color,#f59e0b)] transition-colors duration-200 leading-snug">
                      {article.title}
                    </h3>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-['Lexend',sans-serif] text-[var(--text-dimmed,#8a8174)] group-hover:text-[var(--text-muted,#a89f91)] transition-colors"
                          >
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-1.5 text-sm font-['Raleway',sans-serif] text-[var(--text-muted,#d6cec2)] group-hover:text-[var(--accent-color,#f59e0b)] font-medium transition-colors duration-200">
                      <span>Ler estudo completo</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Subfolders in this folder */}
          {hasChildren && (
            <div className="space-y-4 pt-1">
              {node.children.map((childNode) => (
                <FolderTreeNodeView
                  key={childNode.id}
                  node={childNode}
                  collapsedFolders={collapsedFolders}
                  onToggle={onToggle}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export const ArticlesList: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  // View mode: 'timeline' (chronological) vs 'folders' (hierarchy / content structure)
  const [viewMode, setViewMode] = useState<'timeline' | 'folders'>(() => {
    return (localStorage.getItem('enkephalos_view_mode') as 'timeline' | 'folders') || 'timeline';
  });

  // Collapsed state for folders
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  // Month-by-month lazy loading in timeline mode
  const [visibleMonthCount, setVisibleMonthCount] = useState<number>(1);
  const [isLoadingNextMonth, setIsLoadingNextMonth] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleViewModeChange = (mode: 'timeline' | 'folders') => {
    setViewMode(mode);
    localStorage.setItem('enkephalos_view_mode', mode);
    setActiveSectionId('');
  };

  // Sync state if url query param changes
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  // Filter out articles with no real content or excluded categories (Português, Biologia)
  const validArticles = useMemo(() => {
    return ARTICLES_DATA.filter((article) => {
      const cat = (article.category || '').toLowerCase();
      if (
        cat === 'português' ||
        cat === 'portugues' ||
        cat.startsWith('português ·') ||
        cat.startsWith('portugues ·') ||
        cat === 'biologia' ||
        cat.startsWith('biologia ·')
      ) {
        return false;
      }

      const content = article.contentRaw || '';
      const bodyWithoutHeaders = content
        .replace(/#+\s*(?:Referências|Referencias|References)[\s\S]*$/i, '')
        .replace(/^#+.*$/gm, '')
        .replace(/^---+$/gm, '')
        .trim();
      return bodyWithoutHeaders.length > 0;
    });
  }, []);

  // Extract all unique periods for the timeline sidebar
  const allPeriods = useMemo(() => {
    const periods = Array.from(new Set(validArticles.map((a) => a.period)));
    return periods;
  }, [validArticles]);

  // Filter articles by search term
  const filteredArticles = useMemo(() => {
    return validArticles.filter((article) => {
      const matchesSearch =
        !searchTerm.trim() ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [validArticles, searchTerm]);

  // Group filtered articles by period (Timeline mode)
  const groupedByPeriod = useMemo(() => {
    const map = new Map<string, Article[]>();
    filteredArticles.forEach((article) => {
      if (!map.has(article.period)) {
        map.set(article.period, []);
      }
      map.get(article.period)!.push(article);
    });

    return Array.from(map.entries()).map(([period, articles]) => ({
      period,
      count: articles.length,
      articles,
      elementId: `period-${period.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    }));
  }, [filteredArticles]);

  // Build true Obsidian nested tree from filtered articles
  const folderTree = useMemo(() => {
    return buildObsidianTree(filteredArticles);
  }, [filteredArticles]);

  // Sliced periods: When not searching, only render visible months (month-by-month loading)
  const displayedGroups = useMemo(() => {
    if (searchTerm.trim()) return groupedByPeriod;
    return groupedByPeriod.slice(0, visibleMonthCount);
  }, [groupedByPeriod, visibleMonthCount, searchTerm]);

  // Flattened folders for the right sidebar (top-level + level 1 subfolders)
  const sidebarFolderItems = useMemo(() => {
    const items: { id: string; label: string; count: number; depth: number }[] = [];

    function traverse(nodes: TreeNode[], depth: number) {
      for (const node of nodes) {
        items.push({
          id: node.id,
          label: node.name,
          count: node.totalCount,
          depth
        });
        if (depth < 1 && node.children.length > 0) {
          traverse(node.children, depth + 1);
        }
      }
    }

    traverse(folderTree, 0);
    return items;
  }, [folderTree]);

  // Instagram-style Infinite Scroll Observer for Timeline mode
  useEffect(() => {
    if (viewMode !== 'timeline' || searchTerm.trim()) return;
    if (visibleMonthCount >= groupedByPeriod.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !isLoadingNextMonth) {
          setIsLoadingNextMonth(true);
          setTimeout(() => {
            setVisibleMonthCount((prev) => Math.min(groupedByPeriod.length, prev + 1));
            setIsLoadingNextMonth(false);
          }, 450);
        }
      },
      { rootMargin: '250px' }
    );

    const currentEl = sentinelRef.current;
    if (currentEl) observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [viewMode, visibleMonthCount, groupedByPeriod.length, isLoadingNextMonth, searchTerm]);

  // ScrollSpy for active section in right sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const targetIds =
      viewMode === 'timeline'
        ? displayedGroups.map((g) => g.elementId)
        : sidebarFolderItems.map((item) => item.id);

    targetIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [viewMode, displayedGroups, sidebarFolderItems]);

  const scrollToSection = (elementId: string) => {
    if (viewMode === 'timeline') {
      const targetIdx = groupedByPeriod.findIndex((g) => g.elementId === elementId);
      if (targetIdx >= 0 && targetIdx >= visibleMonthCount) {
        setVisibleMonthCount(targetIdx + 1);
      }
    }

    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setActiveSectionId(elementId);
      }
    }, 60);
  };

  const scrollToFolder = (elementId: string) => {
    // Expand this folder
    setCollapsedFolders((prev) => {
      const next = { ...prev };
      delete next[elementId];
      return next;
    });

    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setActiveSectionId(elementId);
      }
    }, 60);
  };

  const toggleFolder = (elementId: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [elementId]: !prev[elementId]
    }));
  };

  const expandAllFolders = () => {
    setCollapsedFolders({});
  };

  const collapseAllFolders = () => {
    const allIds = collectAllNodeIds(folderTree);
    const map: Record<string, boolean> = {};
    allIds.forEach((id) => {
      map[id] = true;
    });
    setCollapsedFolders(map);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] py-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Active search filter badge (only shown when user searches via the Navbar) */}
        {searchTerm && (
          <div className="flex items-center justify-between gap-3 pb-4 mb-8 border-b border-[var(--border-subtle,#26211e)] animate-in fade-in duration-200">
            <p className="text-xs font-['Lexend',sans-serif] text-[var(--text-muted,#9e9589)]">
              Filtrando estudos por: <strong className="text-[var(--accent-color)] font-medium">"{searchTerm}"</strong>
            </p>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs font-['Raleway',sans-serif] text-[var(--accent-color,#f59e0b)] hover:text-[var(--accent-hover,#fbbf24)] px-2.5 py-1 rounded bg-[var(--accent-muted,rgba(245,158,11,0.1))] border border-[var(--accent-color,#f59e0b)]/30 cursor-pointer transition-colors"
              title="Limpar filtro"
            >
              <X className="w-3 h-3" />
              Limpar filtro
            </button>
          </div>
        )}

        {/* Main Grid: Main column (Articles) + Right Sidebar ("NESTA PÁGINA" / "PASTAS") */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Left Column */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* Mobile Switcher (visible only on mobile when sidebar is hidden) */}
            <div className="lg:hidden mb-6">
              <div className="inline-flex w-full p-1 bg-[var(--bg-surface,#181614)] border border-[var(--border-subtle,#26211e)] rounded-md gap-1">
                <button
                  onClick={() => handleViewModeChange('timeline')}
                  className={`flex-1 py-1.5 px-2 text-center text-xs font-['Lexend',sans-serif] rounded-md transition-all cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                      : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#221d19)]'
                  }`}
                >
                  Linha do Tempo
                </button>
                <button
                  onClick={() => handleViewModeChange('folders')}
                  className={`flex-1 py-1.5 px-2 text-center text-xs font-['Lexend',sans-serif] rounded-md transition-all cursor-pointer ${
                    viewMode === 'folders'
                      ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                      : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#221d19)]'
                  }`}
                >
                  Estrutura de Pastas
                </button>
              </div>
            </div>

            {/* Folder Mode Controls: Expand/Collapse All */}
            {viewMode === 'folders' && (
              <div className="flex items-center justify-end gap-2 pb-2 mb-6">
                <button
                  onClick={expandAllFolders}
                  className="text-xs font-['Lexend',sans-serif] text-[var(--text-dimmed,#78716c)] hover:text-[var(--accent-color,#f59e0b)] transition-colors cursor-pointer"
                >
                  Expandir todas
                </button>
                <span className="text-[var(--border-subtle,#26211e)]">|</span>
                <button
                  onClick={collapseAllFolders}
                  className="text-xs font-['Lexend',sans-serif] text-[var(--text-dimmed,#78716c)] hover:text-[var(--accent-color,#f59e0b)] transition-colors cursor-pointer"
                >
                  Recolher todas
                </button>
              </div>
            )}

            {/* Empty Search State */}
            {((viewMode === 'timeline' && displayedGroups.length === 0) || 
              (viewMode === 'folders' && folderTree.length === 0)) ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-lg font-serif text-[var(--text-muted,#9e9589)]">Nenhum estudo encontrado com o filtro atual.</p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold text-xs rounded-md hover:bg-[var(--accent-hover,#fbbf24)] transition-colors cursor-pointer"
                >
                  Restaurar todos os estudos
                </button>
              </div>
            ) : viewMode === 'timeline' ? (
              /* ================== TIMELINE MODE ================== */
              <>
                {displayedGroups.map((group) => (
                  <section
                    key={group.period}
                    id={group.elementId}
                    className="scroll-mt-24 space-y-6"
                  >
                    {/* Period Header (e.g. 2026 - Setembro | 3 estudos) */}
                    <div className="flex items-baseline justify-between border-b border-[var(--border-subtle,#292420)] pb-3">
                      <h2 className="font-serif text-2xl font-bold tracking-tight text-[var(--text-main,#f3f0ea)]">
                        {group.period}
                      </h2>
                      <span className="text-xs font-['Lexend',sans-serif] text-[var(--text-dimmed,#78716c)]">
                        {group.count} {group.count === 1 ? 'estudo' : 'estudos'}
                      </span>
                    </div>

                    {/* List of Studies */}
                    <div className="space-y-4">
                      {group.articles.map((article) => (
                        <article 
                          key={article.id} 
                          className="border-b border-[var(--border-subtle,#1f1b18)] pb-5 last:border-b-0 last:pb-0"
                        >
                          <Link 
                            to={`/estudos/${article.slug}`} 
                            className="group block py-2 cursor-pointer transition-colors duration-200"
                          >
                            <h3 className="text-[16px] font-semibold text-[var(--text-main,#f3f0ea)] group-hover:text-[var(--accent-color,#f59e0b)] transition-colors duration-200 leading-snug">
                              {article.title}
                            </h3>

                            {article.tags && article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {article.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs font-['Lexend',sans-serif] text-[var(--text-dimmed,#8a8174)] group-hover:text-[var(--text-muted,#a89f91)] transition-colors"
                                  >
                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="mt-3 flex items-center gap-1.5 text-sm font-['Raleway',sans-serif] text-[var(--text-muted,#d6cec2)] group-hover:text-[var(--accent-color,#f59e0b)] font-medium transition-colors duration-200">
                              <span>Ler estudo completo</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                            </div>
                          </Link>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}

                {/* Instagram-style Infinite Scroll Loading Sentinel (Month-by-Month) */}
                {!searchTerm && visibleMonthCount < groupedByPeriod.length && (
                  <div ref={sentinelRef} className="py-10 flex flex-col items-center justify-center gap-4">
                    {isLoadingNextMonth ? (
                      <div className="flex flex-col items-center gap-3 w-full animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 text-xs font-['Lexend',sans-serif] text-[var(--accent-color,#f59e0b)]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Carregando estudos de {groupedByPeriod[visibleMonthCount]?.period}...</span>
                        </div>

                        <div className="w-full space-y-3 opacity-60">
                          <div className="h-16 rounded-lg bg-[var(--bg-surface-hover,#1a1715)]/70 animate-pulse border border-[var(--border-subtle,#26211e)]" />
                          <div className="h-16 rounded-lg bg-[var(--bg-surface-hover,#1a1715)]/40 animate-pulse border border-[var(--border-subtle,#26211e)]" />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setIsLoadingNextMonth(true);
                          setTimeout(() => {
                            setVisibleMonthCount((prev) => Math.min(groupedByPeriod.length, prev + 1));
                            setIsLoadingNextMonth(false);
                          }, 350);
                        }}
                        className="text-xs font-['Lexend',sans-serif] text-[var(--text-muted,#9e9589)] hover:text-[var(--accent-color,#f59e0b)] flex items-center gap-2 py-2 px-4 rounded-md border border-[var(--border-subtle,#26211e)] hover:border-[var(--accent-color,#f59e0b)]/40 transition-colors cursor-pointer"
                      >
                        <span>Carregar {groupedByPeriod[visibleMonthCount]?.period}</span>
                        <span className="text-[10px] text-[var(--text-dimmed,#78716c)] font-mono">
                          ({groupedByPeriod[visibleMonthCount]?.count} estudos)
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {/* End of Stream indicator */}
                {!searchTerm && visibleMonthCount >= groupedByPeriod.length && groupedByPeriod.length > 0 && (
                  <div className="py-14 text-center text-xs font-['Raleway',sans-serif] text-[var(--text-dimmed,#78716c)] flex items-center justify-center gap-3 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color,#f59e0b)]/50" />
                    <span>Todos os {validArticles.length} estudos foram carregados</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color,#f59e0b)]/50" />
                  </div>
                )}
              </>
            ) : (
              /* ================== FOLDERS STRUCTURE MODE (NESTED TREE AS IN OBSIDIAN) ================== */
              <div className="space-y-10">
                {folderTree.map((rootNode) => (
                  <FolderTreeNodeView
                    key={rootNode.id}
                    node={rootNode}
                    collapsedFolders={collapsedFolders}
                    onToggle={toggleFolder}
                    searchTerm={searchTerm}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar ("NESTA PÁGINA" / "PASTAS") */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 pl-6 border-l border-[var(--border-subtle,#221d19)] space-y-5 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              {/* Mode Switcher: Placed directly above the right column structures, no emojis */}
              <div className="inline-flex w-full p-1 bg-[var(--bg-surface,#181614)] border border-[var(--border-subtle,#26211e)] rounded-md gap-1">
                <button
                  onClick={() => handleViewModeChange('timeline')}
                  className={`flex-1 py-1.5 px-2 text-center text-xs font-['Lexend',sans-serif] rounded-md transition-all cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                      : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#221d19)]'
                  }`}
                >
                  Linha do Tempo
                </button>

                <button
                  onClick={() => handleViewModeChange('folders')}
                  className={`flex-1 py-1.5 px-2 text-center text-xs font-['Lexend',sans-serif] rounded-md transition-all cursor-pointer ${
                    viewMode === 'folders'
                      ? 'bg-[var(--accent-color,#f59e0b)] text-[var(--bg-color,#121110)] font-semibold shadow-sm'
                      : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#221d19)]'
                  }`}
                >
                  Estrutura de Pastas
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <h4 className="text-xs font-['Raleway',sans-serif] font-bold uppercase tracking-wider text-[var(--text-dimmed,#78716c)]">
                  {viewMode === 'timeline' ? 'Nesta página' : 'Pastas'}
                </h4>
                <span className="text-[10px] font-mono text-[var(--text-dimmed,#78716c)]">
                  {viewMode === 'timeline' ? `${allPeriods.length} períodos` : `${sidebarFolderItems.length} pastas`}
                </span>
              </div>

              <nav className="space-y-1 text-sm font-['Lexend',sans-serif]">
                {viewMode === 'timeline' ? (
                  allPeriods.map((period) => {
                    const elementId = `period-${period.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    const isCurrentActive = activeSectionId === elementId;
                    const hasArticlesInFilter = groupedByPeriod.some((g) => g.period === period);

                    return (
                      <button
                        key={period}
                        onClick={() => scrollToSection(elementId)}
                        disabled={!hasArticlesInFilter}
                        className={`w-full text-left py-1.5 px-2 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isCurrentActive
                            ? 'text-[var(--accent-color,#f59e0b)] font-medium bg-[var(--accent-muted,rgba(245,158,11,0.1))]'
                            : hasArticlesInFilter
                            ? 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#181513)]'
                            : 'text-[var(--text-dimmed,#443c36)] opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <span className="truncate">{period}</span>
                      </button>
                    );
                  })
                ) : (
                  sidebarFolderItems.map((item) => {
                    const isCurrentActive = activeSectionId === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToFolder(item.id)}
                        style={{ paddingLeft: `${item.depth * 12 + 8}px` }}
                        className={`w-full text-left py-1.5 pr-2 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isCurrentActive
                            ? 'text-[var(--accent-color,#f59e0b)] font-medium bg-[var(--accent-muted,rgba(245,158,11,0.1))]'
                            : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#181513)]'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="text-[10px] font-mono opacity-70 ml-2">
                          {item.count}
                        </span>
                      </button>
                    );
                  })
                )}
              </nav>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default ArticlesList;

