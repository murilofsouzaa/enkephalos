import { useState, useEffect, useMemo, type FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, ChevronUp, Lock, Mail, Copy, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ARTICLES_DATA } from '../data/articlesData';

/**
 * Checks whether a URL is a link to an AI conversation or notebook platform
 * (NotebookLM, ChatGPT, Claude, Gemini, Perplexity, DeepSeek, Poe, Copilot, Grok, etc.)
 */
export function getAiServiceInfo(url: string): { isAi: boolean; serviceName: string } {
  if (!url) return { isAi: false, serviceName: '' };
  const lower = url.toLowerCase().trim();

  if (lower.includes('notebooklm') || lower.includes('notebook.google')) {
    return { isAi: true, serviceName: 'NotebookLM' };
  }
  if (lower.includes('chatgpt.com') || lower.includes('chat.openai.com')) {
    return { isAi: true, serviceName: 'ChatGPT' };
  }
  if (lower.includes('claude.ai') || lower.includes('anthropic.com')) {
    return { isAi: true, serviceName: 'Claude' };
  }
  if (lower.includes('gemini.google') || lower.includes('bard.google')) {
    return { isAi: true, serviceName: 'Google Gemini' };
  }
  if (lower.includes('perplexity.ai')) {
    return { isAi: true, serviceName: 'Perplexity' };
  }
  if (lower.includes('poe.com')) {
    return { isAi: true, serviceName: 'Poe' };
  }
  if (lower.includes('deepseek.com')) {
    return { isAi: true, serviceName: 'DeepSeek' };
  }
  if (lower.includes('copilot.microsoft.com')) {
    return { isAi: true, serviceName: 'Microsoft Copilot' };
  }
  if (lower.includes('grok.com') || lower.includes('x.ai')) {
    return { isAi: true, serviceName: 'Grok' };
  }

  return { isAi: false, serviceName: '' };
}

/**
 * Censoring helper that hides the sensitive trailing UUID/hash of private URLs,
 * returning a visible base prefix and a fading masked tail to prevent manual typing.
 */
function getCensoredUrl(url: string): { visiblePart: string; fadingPart: string } {
  try {
    const urlObj = new URL(url);
    const origin = urlObj.origin;
    const pathname = urlObj.pathname;

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return { visiblePart: url.slice(0, 25), fadingPart: '••••••••••••' };
    }

    const lastSegment = segments[segments.length - 1];
    const prefixSegments = segments.slice(0, -1).join('/');
    const basePath = prefixSegments ? `${origin}/${prefixSegments}/` : `${origin}/`;

    // Keep only the first 4 characters of the ID/hash
    const visibleChars = lastSegment.slice(0, 4);
    const visiblePart = `${basePath}${visibleChars}`;
    const fadingPart = '••••••••••••••••••••';

    return { visiblePart, fadingPart };
  } catch {
    const visiblePart = url.slice(0, Math.min(30, Math.floor(url.length * 0.4)));
    const fadingPart = '••••••••••••••••';
    return { visiblePart, fadingPart };
  }
}

/**
 * Strips raw Obsidian metadata header and empty references from markdown
 */
export function cleanArticleMarkdown(raw: string): string {
  if (!raw) return '';
  let text = raw
    .replace(/^\s*\d{4}[-/.]\d{2}[-/.]\d{2}(\s+\d{1,2}:\d{2})?\s*\n+/, '')
    .replace(/^(Status:\s*[^\n]*\n+)?(Tags:\s*[^\n]*\n+)?(----*\n+)?/, '')
    .trimStart();

  // Strip empty # Referências / # References if there is no reference content
  const refRegex = /(?:^|\n)(?:----\s*\n+)?(#+\s*(?:Referências|Referencias|References)\s*\n*)([\s\S]*)$/i;
  const match = text.match(refRegex);
  if (match) {
    const refContent = match[2].trim();
    if (!refContent || refContent.replace(/^---+$/gm, '').trim().length === 0) {
      text = text.replace(refRegex, '').trimEnd();
    }
  }

  return text;
}

export const ArticleDetail: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeHeaderId, setActiveHeaderId] = useState<string>('');
  const [aiModalInfo, setAiModalInfo] = useState<{ url: string; service: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const article = ARTICLES_DATA.find((a) => a.slug === slug) || ARTICLES_DATA[0];

  const cleanedContent = useMemo(() => cleanArticleMarkdown(article?.contentRaw || ''), [article]);

  const hasBodyContent = useMemo(() => {
    if (!cleanedContent) return false;
    const stripped = cleanedContent
      .replace(/^#+.*$/gm, '')
      .replace(/^---+$/gm, '')
      .trim();
    return stripped.length > 0;
  }, [cleanedContent]);

  const displayedHeaders = useMemo(() => {
    if (!article || !article.headers) return [];
    const hasRefs = /(?:Referências|Referencias|References)[\s\S]*?(https?:\/\/|[a-zA-Z0-9]{3,})/i.test(cleanedContent);
    return article.headers.filter(h => {
      const isRef = ['referencias', 'referencia', 'references', 'reference'].includes(h.id.toLowerCase());
      if (isRef && !hasRefs) return false;
      return true;
    });
  }, [article, cleanedContent]);

  // Scroll to top on load or slug change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // ScrollSpy for the right sidebar headers
  useEffect(() => {
    if (!article || !displayedHeaders.length) return;

    const handleScroll = () => {
      const headerElements = displayedHeaders.map((h) => document.getElementById(h.id));
      const scrollPosition = window.scrollY + 140;

      for (let i = headerElements.length - 1; i >= 0; i--) {
        const el = headerElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveHeaderId(displayedHeaders[i].id);
          return;
        }
      }

      if (headerElements.length > 0 && headerElements[0]) {
        setActiveHeaderId(displayedHeaders[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [article, displayedHeaders]);

  const scrollToHeader = (headerId: string) => {
    const el = document.getElementById(headerId);
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
      setActiveHeaderId(headerId);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('onemurilo@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAiModalInfo(null);
      }
    };
    if (aiModalInfo) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aiModalInfo]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] py-20 text-center">
        <p className="text-xl font-serif text-[var(--text-muted,#9e9589)]">Estudo não encontrado.</p>
        <Link to="/estudos" className="mt-4 inline-block text-[var(--accent-color,#f59e0b)] hover:underline text-sm font-['Raleway',sans-serif]">
          &larr; Voltar para a lista de estudos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color,#121110)] text-[var(--text-main,#f3f0ea)] py-10 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            to="/estudos"
            className="inline-flex items-center gap-2 text-xs font-['Raleway',sans-serif] font-medium text-[var(--text-muted,#9e9589)] hover:text-[var(--accent-color,#f59e0b)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para estudos</span>
          </Link>
        </div>

        {/* 2-Column Grid: Article text on Left + Dynamic Headers Table of Contents on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            
            {/* Header / Title area */}
            <header className="space-y-4 pb-8 border-b border-[var(--border-subtle,#26211e)]">
              {article.category && (
                <div className="text-xs font-['Lexend',sans-serif] text-[var(--text-dimmed,#78716c)]">
                  {article.category}
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-main,#f3f0ea)] leading-tight">
                {article.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-['Lexend',sans-serif] text-[var(--accent-color,#f59e0b)] bg-[var(--accent-muted,rgba(245,158,11,0.1))] px-2 py-0.5 rounded border border-[var(--accent-color,#f59e0b)]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Publication metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-['Raleway',sans-serif] text-[var(--text-dimmed,#78716c)] pt-2">
                <span className="text-[var(--text-muted,#a89f91)]">{article.displayDate}</span>
              </div>
            </header>

            {/* Editorial Markdown Body */}
            <div
              onClickCapture={(e) => {
                const target = (e.target as HTMLElement).closest('a, button');
                if (target) {
                  const href = target.getAttribute('href') || target.getAttribute('data-href') || (target as HTMLAnchorElement).href || '';
                  const aiInfo = getAiServiceInfo(href);
                  if (aiInfo.isAi) {
                    e.preventDefault();
                    e.stopPropagation();
                    setAiModalInfo({ url: href, service: aiInfo.serviceName });
                  }
                }
              }}
              className="pt-8 article-markdown font-sans text-base sm:text-lg leading-relaxed text-[var(--text-main,#f3f0ea)] space-y-6"
            >
              {!hasBodyContent ? (
                <div className="py-16 text-center space-y-3">
                  <p className="text-base font-['Lexend',sans-serif] text-[var(--text-muted,#9e9589)]">
                    Este estudo ainda não possui anotações de conteúdo.
                  </p>
                  <Link to="/estudos" className="inline-block text-xs font-['Lexend',sans-serif] text-[var(--accent-color,#f59e0b)] hover:underline">
                    &larr; Voltar para a lista de estudos
                  </Link>
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => {
                      const text = String(children);
                      const header = displayedHeaders.find(h => h.title === text || text.includes(h.title));
                      const id = header ? header.id : text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <h1 id={id} className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-main,#f3f0ea)] pt-8 pb-3 border-b border-[var(--border-subtle,#292421)] scroll-mt-24">
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children }) => {
                      const text = String(children);
                      const header = displayedHeaders.find(h => h.title === text || text.includes(h.title));
                      const id = header ? header.id : text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <h2 id={id} className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main,#f3f0ea)] pt-8 pb-2 border-b border-[var(--border-subtle,#292421)] scroll-mt-24">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      const header = displayedHeaders.find(h => h.title === text || text.includes(h.title));
                      const id = header ? header.id : text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <h3 id={id} className="font-serif text-xl sm:text-2xl font-bold text-[var(--accent-color,#2563eb)] pt-6 pb-1 scroll-mt-24">
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-[var(--text-muted,#9e9589)] leading-relaxed my-4 text-base sm:text-lg">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-[var(--text-main,#f3f0ea)] font-semibold">
                        {children}
                      </strong>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 pl-5 border-l-4 border-[var(--accent-color)] py-3 bg-[var(--bg-surface-hover,#221e1b)] italic font-serif text-[var(--text-main,#f3f0ea)] text-lg sm:text-xl rounded-r shadow-sm">
                        {children}
                      </blockquote>
                    ),
                    code: ({ className, children }) => {
                      const isInline = !className && typeof children === 'string' && !children.includes('\n');
                      if (isInline) {
                        return (
                          <code className="bg-[var(--bg-surface-hover,#221e1b)] text-[var(--accent-color)] px-1.5 py-0.5 rounded font-mono text-sm border border-[var(--border-subtle,#292421)]">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre className="my-5 p-4 bg-[var(--bg-surface,#191614)] border border-[var(--border-subtle,#292421)] rounded-lg overflow-x-auto font-mono text-xs sm:text-sm text-[var(--text-main,#f3f0ea)]">
                          <code className={className}>{children}</code>
                        </pre>
                      );
                    },
                    img: ({ src, alt }) => {
                      return (
                        <figure className="my-8 text-center">
                          <img
                            src={src}
                            alt={alt || 'Imagem do artigo'}
                            className="max-h-[500px] w-auto mx-auto rounded-lg border border-[var(--border-subtle,#292421)] shadow-xl object-contain bg-[var(--bg-surface,#191614)]"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                            }}
                          />
                          {alt && (
                            <figcaption className="mt-2 text-xs font-mono text-[var(--text-dimmed,#686158)]">
                              {alt}
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside my-4 space-y-2 text-[var(--text-muted,#9e9589)] pl-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside my-4 space-y-2 text-[var(--text-muted,#9e9589)] pl-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">
                        {children}
                      </li>
                    ),
                    hr: () => <hr className="my-8 border-[var(--border-subtle,#292421)]" />,
                    a: ({ href, children }) => {
                      const rawHref = href || '';
                      const aiInfo = getAiServiceInfo(rawHref);

                      if (aiInfo.isAi) {
                        const { visiblePart, fadingPart } = getCensoredUrl(rawHref);

                        return (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAiModalInfo({ url: rawHref, service: aiInfo.serviceName });
                            }}
                            title={`Fonte privada (${aiInfo.serviceName}) - Clique para solicitar acesso por e-mail`}
                            className="inline-flex items-center gap-1.5 text-[var(--accent-color,#2563eb)] hover:text-[var(--accent-hover,#3b82f6)] transition-all cursor-pointer font-mono text-xs sm:text-sm text-left p-0 m-0 bg-transparent border-0 align-baseline group"
                          >
                            <span className="inline-flex items-center select-none overflow-hidden relative max-w-full">
                              <span className="underline group-hover:underline break-all">{visiblePart}</span>
                              <span 
                                className="tracking-widest inline-block select-none opacity-60 blur-[0.6px] pointer-events-none [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.5)_35%,transparent_90%)] [-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.5)_35%,transparent_90%)]"
                                aria-hidden="true"
                              >
                                {fadingPart}
                              </span>
                            </span>
                            <Lock className="w-3.5 h-3.5 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity ml-0.5" />
                          </button>
                        );
                      }

                      return (
                        <a
                          href={rawHref}
                          target={rawHref.startsWith('http') ? '_blank' : undefined}
                          rel={rawHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-[var(--accent-color,#2563eb)] underline hover:text-[var(--accent-hover,#3b82f6)] transition-colors break-words"
                        >
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {cleanedContent}
                </ReactMarkdown>
              )}
            </div>

            {/* Bottom Back & Navigation Action */}
            <div className="mt-16 pt-8 border-t border-[var(--border-subtle,#292421)] flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/estudos"
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--accent-color,#f59e0b)] hover:text-[var(--accent-hover,#fbbf24)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para todos os estudos</span>
              </Link>

              <Link
                to="/pomodoro"
                className="inline-flex items-center gap-2 text-sm font-mono text-[var(--text-muted,#9e9589)] hover:text-[var(--accent-color,#f59e0b)] transition-colors"
              >
                <span>Focar no estudo com Pomodoro &rarr;</span>
              </Link>
            </div>

          </article>

          {/* Right Sidebar ("Nesta página" with HEADERS / TOPICS - matching photo 2) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 pl-6 border-l border-[var(--border-subtle,#221d19)] space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h4 className="text-xs font-['Raleway',sans-serif] font-bold uppercase tracking-wider text-[var(--text-dimmed,#78716c)]">
                Nesta página
              </h4>

              {displayedHeaders.length === 0 ? (
                <p className="text-xs text-[var(--text-dimmed,#686158)] italic">Sem tópicos</p>
              ) : (
                <nav className="space-y-1 text-sm font-['Lexend',sans-serif]">
                  {displayedHeaders.map((header) => {
                    const isCurrent = activeHeaderId === header.id;

                    return (
                      <button
                        key={header.id}
                        onClick={() => scrollToHeader(header.id)}
                        className={`w-full text-left py-1.5 px-2 rounded text-xs transition-colors flex items-start justify-between group cursor-pointer ${
                          isCurrent
                            ? 'text-[var(--accent-color,#f59e0b)] font-medium bg-[var(--accent-muted,rgba(245,158,11,0.1))]'
                            : 'text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#181412)]'
                        }`}
                        style={{
                          paddingLeft: header.level === 3 ? '1.25rem' : '0.5rem'
                        }}
                      >
                        <span className="leading-snug pr-2">{header.title}</span>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color,#f59e0b)] mt-1.5 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              )}

              <div className="pt-6 border-t border-[var(--border-subtle,#221d19)] space-y-2">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1 text-xs font-['Raleway',sans-serif] text-[var(--text-dimmed,#78716c)] hover:text-[var(--accent-color,#f59e0b)] transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Voltar ao topo</span>
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Restricted AI Source Modal */}
      {aiModalInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setAiModalInfo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-[var(--bg-surface,#191614)] border border-[var(--border-subtle,#292421)] rounded-md shadow-2xl p-5 sm:p-6 text-[var(--text-main,#f3f0ea)] font-['Lexend',sans-serif]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Title and Close */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle,#292421)]">
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                Fonte privada · {aiModalInfo.service}
              </h3>
              <button
                onClick={() => setAiModalInfo(null)}
                className="p-1 rounded text-[var(--text-dimmed,#78716c)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#221e1b)] transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct & Simple First-Person Text */}
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-4">
              Esse link leva para anotações e conversas privadas minhas no <strong className="text-[var(--text-main)]">{aiModalInfo.service}</strong>. Se quiser consultar o material de apoio deste estudo, me envie um e-mail:
            </p>

            {/* Email Box */}
            <div className="flex items-center justify-between gap-2 p-2.5 mb-5 rounded-md bg-[var(--bg-color,#121110)] border border-[var(--border-subtle,#292421)]">
              <span className="font-mono text-xs sm:text-sm text-[var(--text-main)] select-all pl-1">
                onemurilo@gmail.com
              </span>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[var(--bg-surface-hover,#221e1b)] hover:bg-[var(--accent-muted)] text-[var(--text-main)] hover:text-[var(--accent-color)] transition-colors cursor-pointer border border-[var(--border-subtle,#292421)]"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setAiModalInfo(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <a
                href={`mailto:onemurilo@gmail.com?subject=${encodeURIComponent(
                  `Acesso à fonte (${aiModalInfo.service}) - ${article.title}`
                )}&body=${encodeURIComponent(
                  `Olá Murilo,\n\nGostaria de ter acesso à sua fonte no ${aiModalInfo.service} referente ao estudo "${article.title}".\n\nLink:\n${aiModalInfo.url}\n\nObrigado!`
                )}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md bg-[var(--accent-color)] hover:opacity-90 text-white shadow-sm transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Me envie um e-mail</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
