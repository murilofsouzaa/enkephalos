import { useState, useRef, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { Eye, EyeOff, Clock } from 'lucide-react';
import type { StudySubject, ViewMode } from '../types';
import { generateSubjectCurves, getRetentionAtDay, type CurveSegment, type JumpLine } from '../utils/ebbinghausMath';

interface EbbinghausChartProps {
  subjects: StudySubject[];
  selectedSubjectId: string | null;
  viewMode: ViewMode;
  onSelectSubject: (id: string) => void;
  onToggleViewMode?: (mode: ViewMode) => void;
  baseDaysToForget?: number;
  onBaseDaysChange?: (days: number) => void;
}

export type TimeUnit = 'dias' | 'meses' | 'anos';

export const EbbinghausChart: FC<EbbinghausChartProps> = ({
  subjects,
  selectedSubjectId,
  viewMode,
  onSelectSubject,
  onToggleViewMode,
  baseDaysToForget = 1,
}) => {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('dias');
  const [unitValue, setUnitValue] = useState<number>(30); // 30 dias, 6 meses, 2 anos
  const [hiddenSubjectIds, setHiddenSubjectIds] = useState<Set<string>>(new Set());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [showGhostCurves, setShowGhostCurves] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcula horizonte total em dias baseado na unidade selecionada
  const maxDays = useMemo(() => {
    if (timeUnit === 'dias') return unitValue;
    if (timeUnit === 'meses') return unitValue * 30;
    return unitValue * 365;
  }, [timeUnit, unitValue]);

  // Opções para cada unidade
  const unitOptions = useMemo(() => {
    if (timeUnit === 'dias') return [7, 15, 30, 60];
    if (timeUnit === 'meses') return [3, 6, 12, 24];
    return [1, 2, 5, 10];
  }, [timeUnit]);

  // Ao trocar unidade de tempo, ajusta valor padrão correspondente
  const handleUnitChange = (newUnit: TimeUnit) => {
    setTimeUnit(newUnit);
    if (newUnit === 'dias') setUnitValue(30);
    else if (newUnit === 'meses') setUnitValue(6);
    else setUnitValue(2);
  };

  // Seleciona a matéria ativa para o modo individual
  const activeSubject = useMemo(() => {
    if (selectedSubjectId) {
      return subjects.find((s) => s.id === selectedSubjectId) || subjects[0] || null;
    }
    return subjects[0] || null;
  }, [subjects, selectedSubjectId]);

  // Filtra matérias visíveis no modo agregado
  const visibleSubjects = useMemo(() => {
    return subjects.filter((s) => !hiddenSubjectIds.has(s.id));
  }, [subjects, hiddenSubjectIds]);

  // Alterna visibilidade da matéria na legenda
  const toggleSubjectVisibility = (id: string) => {
    setHiddenSubjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (prev.size < subjects.length - 1) {
          next.add(id);
        }
      }
      return next;
    });
  };

  // Dimensões do SVG do Gráfico calibradas para Desktop e Mobile
  const width = isMobile ? 460 : 880;
  const height = isMobile ? 380 : 540;
  const marginLeft = isMobile ? 58 : 86;
  const marginRight = isMobile ? 18 : 35;
  const marginTop = isMobile ? 50 : 52;
  const marginBottom = isMobile ? 54 : 64;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;

  // Funções de escala
  const getX = (day: number) => marginLeft + (Math.max(0, Math.min(maxDays, day)) / maxDays) * plotWidth;
  const getY = (retention: number) => {
    const clamped = Math.max(60, Math.min(100, retention));
    return marginTop + ((100 - clamped) / (100 - 60)) * plotHeight;
  };

  const getDayFromX = (svgX: number) => {
    const clampedX = Math.max(marginLeft, Math.min(width - marginRight, svgX));
    return ((clampedX - marginLeft) / plotWidth) * maxDays;
  };

  // Manipulação de hover do mouse
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;
    if (svgX >= marginLeft - 10 && svgX <= width - marginRight + 10) {
      const day = Math.round(getDayFromX(svgX) * 10) / 10;
      setHoveredDay(Math.max(0, Math.min(maxDays, day)));
    } else {
      setHoveredDay(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // Geração das curvas
  const chartData = useMemo(() => {
    if (subjects.length === 0) return null;
    if (viewMode === 'single') {
      if (!activeSubject) return null;
      return generateSubjectCurves(activeSubject, maxDays, showGhostCurves, baseDaysToForget);
    } else {
      const allActiveSegments: CurveSegment[] = [];
      const allJumpLines: JumpLine[] = [];
      visibleSubjects.forEach((sub) => {
        const res = generateSubjectCurves(sub, maxDays, false, baseDaysToForget);
        allActiveSegments.push(...res.activeSegments);
        allJumpLines.push(...res.jumpLines);
      });
      return {
        activeSegments: allActiveSegments,
        ghostSegments: [],
        jumpLines: allJumpLines,
        annotations: [],
      };
    }
  }, [subjects, viewMode, activeSubject, visibleSubjects, maxDays, showGhostCurves, baseDaysToForget]);

  // Marcas dos eixos Y
  const yTicks = [60, 70, 80, 90, 100];

  // Marcas dinâmicas do eixo X para dias, meses e anos adaptadas para mobile e desktop
  const xTicks = useMemo(() => {
    if (isMobile) {
      if (timeUnit === 'dias') {
        if (unitValue <= 7) return [0, 2, 4, 7].map((d) => ({ day: d, label: `${d}d` }));
        if (unitValue <= 15) return [0, 5, 10, 15].map((d) => ({ day: d, label: `${d}d` }));
        if (unitValue <= 30) return [0, 10, 20, 30].map((d) => ({ day: d, label: `${d}d` }));
        return [0, 20, 40, 60].map((d) => ({ day: d, label: `${d}d` }));
      }
      if (timeUnit === 'meses') {
        const totalMonths = unitValue;
        const step = totalMonths <= 6 ? 2 : 4;
        const ticks = [];
        for (let m = 0; m <= totalMonths; m += step) {
          ticks.push({ day: m * 30, label: `${m}m` });
        }
        return ticks;
      }
      // Anos
      const totalYears = unitValue;
      const step = totalYears <= 2 ? 1 : 2;
      const ticks = [];
      for (let y = 0; y <= totalYears; y += step) {
        ticks.push({ day: y * 365, label: `${y}a` });
      }
      return ticks;
    }

    if (timeUnit === 'dias') {
      if (unitValue <= 7) return [0, 1, 2, 3, 4, 5, 6, 7].map((d) => ({ day: d, label: `${d}` }));
      if (unitValue <= 15) return [0, 3, 6, 9, 12, 15].map((d) => ({ day: d, label: `${d}` }));
      if (unitValue <= 30) return [0, 5, 10, 15, 20, 25, 30].map((d) => ({ day: d, label: `${d}` }));
      return [0, 10, 20, 30, 40, 50, 60].map((d) => ({ day: d, label: `${d}` }));
    }

    if (timeUnit === 'meses') {
      const totalMonths = unitValue;
      const step = totalMonths <= 6 ? 1 : totalMonths <= 12 ? 2 : 4;
      const ticks = [];
      for (let m = 0; m <= totalMonths; m += step) {
        ticks.push({ day: m * 30, label: `${m}m` });
      }
      return ticks;
    }

    // Anos
    const totalYears = unitValue;
    const step = totalYears <= 2 ? 0.5 : 1;
    const ticks = [];
    for (let y = 0; y <= totalYears; y += step) {
      ticks.push({ day: y * 365, label: `${y}a` });
    }
    return ticks;
  }, [timeUnit, unitValue, isMobile]);

  // Cria comando de path SVG a partir de pontos
  const createPathD = (points: { day: number; retention: number }[]) => {
    if (!points || points.length === 0) return '';
    return points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.day).toFixed(1)} ${getY(p.retention).toFixed(1)}`)
      .join(' ');
  };

  // Formata dia para exibição no tooltip com a escala correspondente
  const formatHoverTime = (day: number) => {
    if (timeUnit === 'dias') return `Dia ${day.toFixed(1)}`;
    if (timeUnit === 'meses') {
      const m = (day / 30).toFixed(1);
      return `${m} meses (Dia ${Math.round(day)})`;
    }
    const a = (day / 365).toFixed(1);
    return `${a} anos (Dia ${Math.round(day)})`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-start gap-3 relative font-sans">
      {/* Header do Gráfico: Título com 100% da largura da linha */}
      <div className="w-full border-b border-[var(--border-subtle,#292421)] pb-3 text-center sm:text-left">
        <h2 className="text-xl sm:text-lg font-bold sm:font-semibold text-[var(--text-main,#f3f0ea)] tracking-tight">
          Curva do Esquecimento
        </h2>
        <p className="text-xs text-[var(--text-dimmed,#80776d)] mt-0.5">
          {subjects.length === 0
            ? 'Nenhuma matéria cadastrada.'
            : viewMode === 'single'
            ? `Retenção de ${activeSubject ? activeSubject.title : 'matéria selecionada'}.`
            : `Visualização de ${visibleSubjects.length} matérias sobrepostas.`}
        </p>
      </div>

      {/* Filtros de Intervalo (Dias, Meses e Anos) e Controles no Topo */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        {/* Lado Esquerdo: Modo de Exibição, Seletor de Matéria e Curvas Fantasma */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 flex-wrap">
          {subjects.length > 0 && onToggleViewMode && (
            <div className="flex items-center bg-[var(--bg-color)] border border-[var(--border-subtle)] rounded-md p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onToggleViewMode('single')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium text-[11px] ${
                  viewMode === 'single'
                    ? 'bg-[var(--accent-color)] text-white shadow-sm'
                    : 'text-[var(--text-dimmed)] hover:text-[var(--text-main)]'
                }`}
              >
                Foco
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('multi')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium text-[11px] ${
                  viewMode === 'multi'
                    ? 'bg-[var(--accent-color)] text-white shadow-sm'
                    : 'text-[var(--text-dimmed)] hover:text-[var(--text-main)]'
                }`}
              >
                Ver Todas
              </button>
            </div>
          )}

          {viewMode === 'single' && subjects.length > 1 && (
            <select
              value={activeSubject?.id || ''}
              onChange={(e) => onSelectSubject(e.target.value)}
              className="bg-[var(--bg-color)] border border-[var(--border-subtle)] rounded-md px-2 py-0.5 text-[11px] text-[var(--text-main)] outline-none cursor-pointer max-w-[125px] sm:max-w-[170px] truncate"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.title}
                </option>
              ))}
            </select>
          )}

          {viewMode === 'single' && subjects.length > 0 && (
            <button
              type="button"
              onClick={() => setShowGhostCurves((prev) => !prev)}
              className={`text-[11px] px-2 py-0.5 rounded-md border transition-all flex items-center gap-1 cursor-pointer font-medium ${
                showGhostCurves
                  ? 'bg-[var(--bg-color)] border-[var(--accent-color)] text-[var(--accent-color)]'
                  : 'bg-transparent border-[var(--border-subtle)] text-[var(--text-dimmed)] hover:text-[var(--text-main)]'
              }`}
              title="Alternar exibição das projeções de esquecimento contínuo sem revisão"
            >
              {showGhostCurves ? <Eye className="w-3.5 h-3.5" aria-hidden="true" /> : <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />}
              <span className="hidden sm:inline">Curvas Fantasma</span>
              <span className="sm:hidden">Fantasma</span>
            </button>
          )}
        </div>

        {/* Lado Direito: Filtro de Intervalo (Dias | Meses | Anos) e Quantidade */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-wrap">
          {/* Seletor de Unidade: Dias | Meses | Anos */}
          <div className="flex items-center bg-[var(--bg-color)] border border-[var(--border-subtle)] rounded-md p-0.5 text-xs">
            {(['dias', 'meses', 'anos'] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => handleUnitChange(unit)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium capitalize text-[11px] ${
                  timeUnit === unit
                    ? 'bg-[var(--accent-color)] text-white shadow-sm'
                    : 'text-[var(--text-dimmed)] hover:text-[var(--text-main)]'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>

          {/* Seletor do Valor no Horizonte da Unidade */}
          <div className="flex items-center bg-[var(--bg-color)] border border-[var(--border-subtle)] rounded-md p-0.5 text-xs">
            {unitOptions.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setUnitValue(val)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-medium text-[11px] ${
                  unitValue === val
                    ? 'bg-[var(--accent-color)] text-white shadow-sm'
                    : 'text-[var(--text-dimmed)] hover:text-[var(--text-main)]'
                }`}
              >
                {val}{timeUnit === 'dias' ? 'd' : timeUnit === 'meses' ? 'm' : 'a'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tópicos para Modo Agregado (Desktop: acima do gráfico) */}
      {viewMode === 'multi' && subjects.length > 0 && (
        <div className="hidden sm:flex items-center gap-2 flex-wrap text-xs pt-0.5">
          <span className="text-[var(--text-dimmed)] text-xs font-semibold mr-1">
            Tópicos:
          </span>
          {subjects.map((sub) => {
            const isHidden = hiddenSubjectIds.has(sub.id);
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => toggleSubjectVisibility(sub.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-all cursor-pointer ${
                  isHidden
                    ? 'opacity-40 border-[var(--border-subtle)] bg-[var(--bg-color)] text-[var(--text-dimmed)] line-through'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-color)] text-[var(--text-main)] shadow-xs'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                <span className="truncate max-w-[140px] font-medium">{sub.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Área do Gráfico SVG integrada sem borda */}
      <div className="w-full flex-1 min-h-[300px] sm:min-h-[440px] relative overflow-hidden select-none flex items-center justify-center p-0.5 sm:p-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[520px] block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <marker
              id="arrow-reviewed"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ea580c" />
            </marker>
            <marker
              id="arrow-first"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#ea580c" />
            </marker>

            <filter id="glow-subtle" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Gridlines Horizontais (Retenção 60% a 100%) */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={`y-${tick}`}>
                <line
                  x1={marginLeft}
                  y1={y}
                  x2={width - marginRight}
                  y2={y}
                  stroke="var(--border-subtle, #292421)"
                  strokeWidth={tick === 60 ? 1.5 : 1}
                  strokeOpacity={tick === 60 ? 0.9 : 0.5}
                />
                <text
                  x={marginLeft - (isMobile ? 8 : 14)}
                  y={y + 4.5}
                  textAnchor="end"
                  className="fill-[var(--text-muted,#80776d)] text-[12px] sm:text-[13px] font-sans font-semibold select-none"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Linha de Corte Tracejada de 80% (Limiar Ideal) */}
          <g>
            <line
              x1={marginLeft}
              y1={getY(80)}
              x2={width - marginRight}
              y2={getY(80)}
              stroke="#ca8a04"
              strokeWidth={isMobile ? 1.3 : 1.6}
              strokeDasharray="4,4"
              strokeOpacity="0.8"
            />
            <rect
              x={width - marginRight - (isMobile ? 120 : 165)}
              y={getY(80) - (isMobile ? 19 : 23)}
              width={isMobile ? 116 : 160}
              height={isMobile ? 22 : 26}
              rx="4"
              fill="var(--bg-color, #191614)"
              stroke="#ca8a04"
              strokeWidth="1.2"
              strokeOpacity="0.9"
            />
            <text
              x={width - marginRight - (isMobile ? 62 : 85)}
              y={getY(80) - (isMobile ? 4 : 5.5)}
              textAnchor="middle"
              className="fill-[#ca8a04] dark:fill-[#eab308] text-[11.5px] sm:text-[13.5px] font-sans font-bold select-none tracking-tight"
            >
              {isMobile ? 'Limiar (80%)' : 'Limiar Ideal (80%)'}
            </text>
          </g>

          {/* Gridlines Verticais (Dias, Meses ou Anos) */}
          {xTicks.map((t, idx) => {
            const x = getX(t.day);
            return (
              <g key={`x-${idx}`}>
                <line
                  x1={x}
                  y1={marginTop}
                  x2={x}
                  y2={height - marginBottom}
                  stroke="var(--border-subtle, #292421)"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
                <text
                  x={x}
                  y={height - marginBottom + (isMobile ? 18 : 22)}
                  textAnchor="middle"
                  className="fill-[var(--text-muted,#80776d)] text-[11.5px] sm:text-[13px] font-sans font-semibold select-none"
                >
                  {t.label}
                </text>
              </g>
            );
          })}

          {/* Título do Eixo Y: Retention */}
          <text
            x={-(marginTop + plotHeight / 2)}
            y={isMobile ? 16 : 24}
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-[var(--text-main,#f3f0ea)] text-[13.5px] sm:text-[15.5px] font-sans font-bold tracking-wide select-none"
          >
            Retenção (%)
          </text>

          {/* Título do Eixo X: Unidade de Tempo */}
          <text
            x={marginLeft + plotWidth / 2}
            y={height - (isMobile ? 10 : 12)}
            textAnchor="middle"
            className="fill-[var(--text-main,#f3f0ea)] text-[13px] sm:text-[15px] font-sans font-bold tracking-wide select-none"
          >
            {timeUnit === 'dias'
              ? 'Tempo decorrido (Dias)'
              : timeUnit === 'meses'
              ? 'Tempo decorrido (Meses)'
              : 'Tempo decorrido (Anos)'}
          </text>

          {/* Estado Vazio (Nenhuma Matéria) */}
          {subjects.length === 0 && (
            <g>
              <rect
                x={marginLeft + plotWidth / 2 - 185}
                y={marginTop + plotHeight / 2 - 25}
                width="370"
                height="48"
                rx="5"
                fill="var(--bg-surface, #191614)"
                stroke="var(--border-subtle, #292421)"
              />
              <text
                x={marginLeft + plotWidth / 2}
                y={marginTop + plotHeight / 2 + 5}
                textAnchor="middle"
                className="fill-[var(--text-dimmed,#80776d)] text-[13.5px] font-sans font-medium select-none"
              >
                Cadastre matérias para visualizar as curvas de retenção
              </text>
            </g>
          )}

          {/* Curvas Fantasmas (Modo Individual) */}
          {chartData?.ghostSegments.map((segment, idx) => (
            <path
              key={`ghost-${idx}`}
              d={createPathD(segment.points)}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.8"
              strokeOpacity="0.45"
              strokeDasharray="2,2"
            />
          ))}

          {/* Saltos Verticais de Reforço */}
          {chartData?.jumpLines.map((jump, idx) => {
            const x = getX(jump.day);
            const yFrom = getY(jump.fromRetention);
            const yTo = getY(jump.toRetention);
            return (
              <g key={`jump-${idx}`}>
                <line
                  x1={x}
                  y1={yFrom}
                  x2={x}
                  y2={yTo}
                  stroke={jump.color}
                  strokeWidth="2.2"
                  strokeDasharray="4,3"
                  strokeOpacity="0.95"
                />
                <circle cx={x} cy={yFrom} r="2.5" fill={jump.color} />
                <circle cx={x} cy={yTo} r="3" fill={jump.color} />
              </g>
            );
          })}

          {/* Curvas Principais Ativas */}
          {chartData?.activeSegments.map((segment, idx) => (
            <path
              key={`active-${idx}`}
              d={createPathD(segment.points)}
              fill="none"
              stroke={segment.color}
              strokeWidth={isMobile ? '3.2' : '2.8'}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-subtle)"
            />
          ))}

          {/* Ponto inicial no Dia 0, 100% */}
          {viewMode === 'single' && activeSubject && activeSubject.history.length > 0 && (
            <circle
              cx={getX(activeSubject.history[0]?.dayIndex || 0)}
              cy={getY(100)}
              r={isMobile ? '4.5' : '4'}
              fill={activeSubject.color}
            />
          )}

          {/* Anotações de Ebbinghaus no Topo */}
          {viewMode === 'single' && activeSubject && activeSubject.history.length > 0 && (
            <g className="ebbinghaus-annotations">
              <text
                x={isMobile ? getX(0) + 6 : getX(0)}
                y={marginTop - (isMobile ? 18 : 28)}
                textAnchor={isMobile ? 'start' : 'middle'}
                className="fill-[#ea580c] font-bold text-[11px] sm:text-[13px] font-sans tracking-tight select-none"
              >
                1º Estudo
              </text>
              <line
                x1={getX(0)}
                y1={marginTop - (isMobile ? 14 : 23)}
                x2={getX(0)}
                y2={marginTop - 4}
                stroke="#ea580c"
                strokeWidth={isMobile ? 1.4 : 1.6}
                markerEnd="url(#arrow-first)"
              />

              {activeSubject.history.length > 1 && (
                <g>
                  {(() => {
                    const reviewDays = activeSubject.history
                      .slice(1)
                      .map((h) => h.dayIndex)
                      .filter((d) => d <= maxDays);
                    if (reviewDays.length === 0) return null;

                    const minReviewDay = Math.min(...reviewDays);
                    const maxReviewDay = Math.max(...reviewDays);
                    const midX = (getX(minReviewDay) + getX(maxReviewDay)) / 2;

                    return (
                      <g>
                        <text
                          x={midX}
                          y={marginTop - (isMobile ? 22 : 32)}
                          textAnchor="middle"
                          className="fill-[#ea580c] font-bold text-[11px] sm:text-[13px] font-sans tracking-tight select-none"
                        >
                          Revisões
                        </text>

                        {reviewDays.length > 1 && (
                          <line
                            x1={getX(minReviewDay)}
                            y1={marginTop - (isMobile ? 16 : 23)}
                            x2={getX(maxReviewDay)}
                            y2={marginTop - (isMobile ? 16 : 23)}
                            stroke="#ea580c"
                            strokeWidth="1.4"
                          />
                        )}

                        {reviewDays.map((rDay) => (
                          <line
                            key={`arrow-rev-${rDay}`}
                            x1={getX(rDay)}
                            y1={marginTop - (isMobile ? 16 : 23)}
                            x2={getX(rDay)}
                            y2={marginTop - 4}
                            stroke="#ea580c"
                            strokeWidth={isMobile ? 1.4 : 1.6}
                            markerEnd="url(#arrow-reviewed)"
                          />
                        ))}
                      </g>
                    );
                  })()}
                </g>
              )}
            </g>
          )}

          {/* Indicador Vertical no Hover do Mouse */}
          {hoveredDay !== null && subjects.length > 0 && (
            <g className="hover-crosshair">
              <line
                x1={getX(hoveredDay)}
                y1={marginTop}
                x2={getX(hoveredDay)}
                y2={height - marginBottom}
                stroke="var(--accent-color, #0891b2)"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                opacity="0.8"
              />
              <circle
                cx={getX(hoveredDay)}
                cy={height - marginBottom}
                r="3.5"
                fill="var(--accent-color, #0891b2)"
              />
              <rect
                x={getX(hoveredDay) - 38}
                y={height - marginBottom + 4}
                width="76"
                height="20"
                rx="3"
                fill="var(--accent-color, #0891b2)"
              />
              <text
                x={getX(hoveredDay)}
                y={height - marginBottom + 18}
                textAnchor="middle"
                className="fill-white font-sans text-[12px] font-bold select-none"
              >
                {timeUnit === 'dias'
                  ? `Dia ${hoveredDay}`
                  : timeUnit === 'meses'
                  ? `${(hoveredDay / 30).toFixed(1)}m`
                  : `${(hoveredDay / 365).toFixed(1)}a`}
              </text>
            </g>
          )}
        </svg>

        {/* Floating Tooltip HTML Overlay ao passar o mouse */}
        {hoveredDay !== null && subjects.length > 0 && (
          <div
            className="absolute top-3 pointer-events-none z-20 bg-[var(--bg-surface,#191614)] border border-[var(--border-subtle,#292421)] rounded-md p-2.5 shadow-xl backdrop-blur-md min-w-[200px]"
            style={{
              left: `${Math.min(
                82,
                Math.max(16, ((getX(hoveredDay)) / width) * 100)
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1 mb-2">
              <span className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" aria-hidden="true" />
                {formatHoverTime(hoveredDay)}
              </span>
              <span className="text-[10px] text-[var(--text-dimmed)]">
                Retenção estimada
              </span>
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
              {visibleSubjects.map((sub) => {
                const ret = getRetentionAtDay(sub, hoveredDay, baseDaysToForget);
                const isUnderThreshold = ret < 80;
                return (
                  <div 
                    key={sub.id} 
                    onClick={() => onSelectSubject(sub.id)}
                    className="flex items-center justify-between text-xs gap-3 cursor-pointer hover:bg-[var(--bg-color)] p-1 rounded transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
                      <span className="truncate text-[var(--text-main)] font-medium">
                        {sub.title}
                      </span>
                    </div>
                    <span
                      className={`font-semibold shrink-0 ${
                        isUnderThreshold
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {ret.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tópicos para Modo Agregado (Mobile: posicionado abaixo do gráfico para organização) */}
      {viewMode === 'multi' && subjects.length > 0 && (
        <div className="flex sm:hidden items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-[var(--text-dimmed)] text-xs font-semibold mr-1">
            Tópicos:
          </span>
          {subjects.map((sub) => {
            const isHidden = hiddenSubjectIds.has(sub.id);
            return (
              <button
                key={`mobile-topic-${sub.id}`}
                type="button"
                onClick={() => toggleSubjectVisibility(sub.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-all cursor-pointer ${
                  isHidden
                    ? 'opacity-40 border-[var(--border-subtle)] bg-[var(--bg-color)] text-[var(--text-dimmed)] line-through'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-color)] text-[var(--text-main)] shadow-xs'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                <span className="truncate max-w-[140px] font-medium">{sub.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EbbinghausChart;
