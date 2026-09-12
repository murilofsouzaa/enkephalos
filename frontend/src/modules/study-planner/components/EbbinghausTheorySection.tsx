import type { FC } from 'react';
import { motion } from 'framer-motion';

export const EbbinghausTheorySection: FC = () => {
  return (
    <section className="mt-16 border-t border-[var(--border-subtle,#292421)] pt-12 pb-20 font-sans text-[var(--text-main,#f3f0ea)]">
      {/* Título Principal em 6xl, Centralizado e na Cor Escolhida pelo Usuário */}
      <div className="w-full text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--accent-color,#06b6d4)] max-w-5xl mx-auto leading-tight">
          Entendendo a Curva do Esquecimento
        </h2>
      </div>

      {/* Grid Principal com Foto sem Bordas Arredondadas e Títulos na Cor do Usuário */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
        
        {/* Foto de Hermann Ebbinghaus Aumentada, sem bordas arredondadas (rounded-none) e com Efeito de Opacidade */}
        <motion.div
          initial={{ opacity: 0.15, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-5 flex flex-col items-center lg:items-start lg:sticky lg:top-24"
        >
          <div className="w-full max-w-[360px] sm:max-w-[420px] lg:max-w-none overflow-hidden rounded-none bg-black/10">
            <img
              src="/Hermann-Ebbinghaus.webp"
              alt="Hermann Ebbinghaus"
              className="w-full aspect-[3/4] object-cover object-center grayscale contrast-105 rounded-none shadow-md"
              loading="lazy"
            />
          </div>
          <span className="text-sm text-[var(--text-dimmed,#80776d)] mt-3 font-medium text-center lg:text-left">
            Hermann Ebbinghaus (1850–1909)
          </span>
        </motion.div>

        {/* Perguntas e Respostas com Títulos em 2xl na Cor do Usuário e Revelação de Opacidade no Scroll */}
        <div className="lg:col-span-7 flex flex-col gap-10 text-base sm:text-lg leading-relaxed text-[var(--text-muted,#b8ada0)]">
          
          {/* Pergunta 1: Quem foi Hermann Ebbinghaus? */}
          <motion.div
            initial={{ opacity: 0.15, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--accent-color,#06b6d4)] tracking-tight">
              Quem foi Hermann Ebbinghaus?
            </h3>
            <p>
              Foi um psicólogo alemão pioneiro nos estudos científicos sobre a memória. No final do século XIX, 
              ele realizou testes rigorosos para entender a velocidade com que esquecemos as coisas e como a repetição 
              ajuda o cérebro a consolidar novas informações.
            </p>
          </motion.div>

          {/* Pergunta 2: O que é a Curva do Esquecimento? */}
          <motion.div
            initial={{ opacity: 0.15, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--accent-color,#06b6d4)] tracking-tight">
              O que é a Curva do Esquecimento?
            </h3>
            <p>
              É uma representação gráfica que mostra a perda de retenção de um assunto ao longo do tempo. 
              Sem revisão, a maior parte do esquecimento acontece logo nos primeiros dias após o estudo inicial 
              (podendo cair mais de 50% nas primeiras 24 a 48 horas). Depois dessa queda inicial, o esquecimento continua, 
              mas em um ritmo mais lento.
            </p>
          </motion.div>

          {/* Pergunta 3: Como funciona a repetição espaçada? */}
          <motion.div
            initial={{ opacity: 0.15, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--accent-color,#06b6d4)] tracking-tight">
              Como funciona a repetição espaçada?
            </h3>
            <p>
              Em vez de tentar rever tudo de uma vez só na véspera, você faz revisões curtas e distribuídas ao longo do tempo. 
              Ao revisar no momento em que a lembrança começa a enfraquecer (por volta de 80% de retenção):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>A retenção volta imediatamente para perto de 100%.</li>
              <li>A próxima perda de memória acontece de forma mais lenta, permitindo intervalos cada vez maiores (dias, semanas, meses e anos).</li>
            </ul>
          </motion.div>

          {/* Pergunta 4: O que são as curvas pontilhadas (fantasmas)? */}
          <motion.div
            initial={{ opacity: 0.15, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--accent-color,#06b6d4)] tracking-tight">
              O que são as curvas pontilhadas (fantasmas) no gráfico?
            </h3>
            <p>
              Elas mostram a rota que a sua memória teria seguido caso você <em>não</em> tivesse feito a revisão naquele ponto. 
              Elas servem para você comparar e visualizar claramente o impacto positivo de cada revisão realizada.
            </p>
          </motion.div>

        </div>

      </div>

      {/* SEÇÃO 2: Como Aplicar nos Seus Estudos (Separada com Título em 6xl) */}
      <div className="mt-20 sm:mt-28 border-t border-[var(--border-subtle,#292421)] pt-14 sm:pt-20">
        {/* Título Principal em 6xl, Centralizado e na Cor Escolhida pelo Usuário */}
        <div className="w-full text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--accent-color,#06b6d4)] max-w-5xl mx-auto leading-tight">
            Como Aplicar nos Seus Estudos
          </h2>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          {/* Efeito Visual de Gráfico Caindo e Subindo (Curva de Ebbinghaus Dinâmica) */}
          <motion.div
            initial={{ opacity: 0.15, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Gráfico SVG Responsivo Interativo com a Dinâmica da Memória */}
            <div className="w-full overflow-x-auto overflow-y-hidden py-2 select-none">
              <svg
                viewBox="0 0 900 190"
                className="w-full min-w-[620px] sm:min-w-full h-auto overflow-visible"
              >
                <defs>
                  {/* Gradiente da Área sob a Curva */}
                  <linearGradient id="flowCurveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-color, #06b6d4)" stopOpacity="0.22" />
                    <stop offset="60%" stopColor="var(--accent-color, #06b6d4)" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="var(--accent-color, #06b6d4)" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Gradiente da Linha de Subida Rápida */}
                  <linearGradient id="riseGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="var(--accent-color, #06b6d4)" />
                  </linearGradient>
                </defs>

                {/* Linha Guia de 100% (Topo) */}
                <line
                  x1="60"
                  y1="38"
                  x2="850"
                  y2="38"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeDasharray="4 4"
                />
                <text
                  x="60"
                  y="28"
                  className="fill-[var(--text-dimmed,#80776d)] text-[11px] font-medium"
                >
                  100% Retenção
                </text>

                {/* Linha Guia do Limiar de Revisão (80% - Fundo da Queda) */}
                <line
                  x1="60"
                  y1="135"
                  x2="850"
                  y2="135"
                  stroke="#eab308"
                  strokeOpacity="0.25"
                  strokeDasharray="4 4"
                />
                <text
                  x="60"
                  y="148"
                  className="fill-amber-500/80 dark:fill-amber-400/80 text-[11px] font-medium"
                >
                  Limiar Ideal (~80%)
                </text>

                {/* Rota Fantasma do Esquecimento (Se você NÃO revisar) */}
                <motion.path
                  d="M 450 135 C 505 142, 555 160, 620 174"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
                <text
                  x="626"
                  y="178"
                  className="fill-[var(--text-dimmed,#80776d)] text-[10px] italic select-none"
                >
                  Sem revisão (perda)
                </text>

                {/* Preenchimento Suave da Área sob a Curva com Gradiente */}
                <motion.path
                  d="M 60 38 L 150 38 C 270 95, 370 135, 450 135 C 490 135, 520 40, 560 38 C 630 38, 690 44, 750 48 C 790 51, 825 54, 860 56 L 860 180 L 60 180 Z"
                  fill="url(#flowCurveGrad)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />

                {/* Curva Principal Caindo e Subindo (Efeito Animado ao Rolar a Página) */}
                <motion.path
                  d="M 60 38 L 150 38 C 270 95, 370 135, 450 135 C 490 135, 520 40, 560 38 C 630 38, 690 44, 750 48 C 790 51, 825 54, 860 56"
                  fill="none"
                  stroke="var(--accent-color, #06b6d4)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                />

                {/* Indicador Animado do Repique / Subida da Revisão */}
                <motion.g
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.85 }}
                >
                  <rect
                    x="475"
                    y="74"
                    width="70"
                    height="20"
                    rx="10"
                    className="fill-[var(--bg-color,#121110)] stroke-[var(--accent-color,#06b6d4)]/40"
                    strokeWidth="1"
                  />
                  <text
                    x="510"
                    y="88"
                    textAnchor="middle"
                    className="fill-[var(--accent-color,#06b6d4)] text-[10px] font-bold tracking-wide select-none"
                  >
                    Revisão ↑
                  </text>
                </motion.g>

                {/* NÓ 1: Ponto Inicial (Dia 0 - 100%) */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  style={{ transformOrigin: '150px 38px' }}
                >
                  <circle
                    cx="150"
                    cy="38"
                    r="24"
                    className="fill-[var(--accent-color,#06b6d4)]/10 animate-pulse"
                  />
                  <circle
                    cx="150"
                    cy="38"
                    r="16"
                    className="fill-[var(--bg-color,#121110)] stroke-[var(--accent-color,#06b6d4)]"
                    strokeWidth="3"
                  />
                  <text
                    x="150"
                    y="43"
                    textAnchor="middle"
                    className="fill-[var(--accent-color,#06b6d4)] font-extrabold text-xs select-none"
                  >
                    1
                  </text>
                  <text
                    x="150"
                    y="16"
                    textAnchor="middle"
                    className="fill-[var(--text-main,#f3f0ea)] font-bold text-[11px] select-none"
                  >
                    Dia 0 (100%)
                  </text>
                </motion.g>

                {/* NÓ 2: Ponto Mais Baixo (A Queda da Memória até o Limiar) */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.65 }}
                  style={{ transformOrigin: '450px 135px' }}
                >
                  <circle
                    cx="450"
                    cy="135"
                    r="24"
                    className="fill-amber-500/10 animate-pulse"
                  />
                  <circle
                    cx="450"
                    cy="135"
                    r="16"
                    className="fill-[var(--bg-color,#121110)] stroke-amber-500 dark:stroke-amber-400"
                    strokeWidth="3"
                  />
                  <text
                    x="450"
                    y="140"
                    textAnchor="middle"
                    className="fill-amber-500 dark:fill-amber-400 font-extrabold text-xs select-none"
                  >
                    2
                  </text>
                  <text
                    x="450"
                    y="168"
                    textAnchor="middle"
                    className="fill-amber-500 dark:fill-amber-400 font-bold text-[11px] select-none"
                  >
                    Queda da Memória (~80%)
                  </text>
                </motion.g>

                {/* NÓ 3: Ponto Restaurado & Curva Suavizada */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                  style={{ transformOrigin: '750px 48px' }}
                >
                  <circle
                    cx="750"
                    cy="48"
                    r="24"
                    className="fill-emerald-500/10 animate-pulse"
                  />
                  <circle
                    cx="750"
                    cy="48"
                    r="16"
                    className="fill-[var(--bg-color,#121110)] stroke-emerald-500 dark:stroke-emerald-400"
                    strokeWidth="3"
                  />
                  <text
                    x="750"
                    y="53"
                    textAnchor="middle"
                    className="fill-emerald-500 dark:fill-emerald-400 font-extrabold text-xs select-none"
                  >
                    3
                  </text>
                  <text
                    x="750"
                    y="22"
                    textAnchor="middle"
                    className="fill-emerald-500 dark:fill-emerald-400 font-bold text-[11px] select-none"
                  >
                    Consolidação Duradoura
                  </text>
                </motion.g>
              </svg>
            </div>
          </motion.div>

          {/* Passo a Passo Limpo sem Formato de Card Fechado */}
          <motion.div
            initial={{ opacity: 0.15, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-2"
          >
            {/* Passo 1 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-color,#06b6d4)]/15 text-[var(--accent-color,#06b6d4)] font-bold text-xs border border-[var(--accent-color,#06b6d4)]/30">
                  1
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent-color,#06b6d4)]">
                  Estudo Inicial
                </span>
              </div>
              <h3 className="font-bold text-[var(--text-main,#f3f0ea)] text-lg sm:text-xl">
                Cadastre o conteúdo inicial
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-muted,#b8ada0)] leading-relaxed">
                Após estudar um novo tema pela primeira vez, adicione a matéria no calendário para registrar o Dia 0 e iniciar o acompanhamento da retenção em 100%.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 font-bold text-xs border border-amber-500/30">
                  2
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-amber-500 dark:text-amber-400">
                  A Queda & Alerta
                </span>
              </div>
              <h3 className="font-bold text-[var(--text-main,#f3f0ea)] text-lg sm:text-xl">
                Acompanhe o calendário inteligente
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-muted,#b8ada0)] leading-relaxed">
                Nos primeiros dias a memória cai rapidamente. O sistema sinaliza a data exata em que sua retenção atinge o limiar de 80%, o ponto exato para frear o esquecimento.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30">
                  3
                </span>
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-500 dark:text-emerald-400">
                  A Subida & Retenção
                </span>
              </div>
              <h3 className="font-bold text-[var(--text-main,#f3f0ea)] text-lg sm:text-xl">
                Revise e consolide a retenção
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-muted,#b8ada0)] leading-relaxed">
                Faça uma revisão ativa rápida e confirme no calendário. O gráfico salta de volta para 100% e a nova curva passa a cair muito mais devagar ao longo do tempo.
              </p>
            </div>
          </motion.div>

          {/* Tópico: Não substitui o Anki - Sem formato de card fechado */}
          <motion.div
            initial={{ opacity: 0.15, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-12 sm:mt-16 pt-10 border-t border-[var(--border-subtle,#292421)] flex flex-col gap-5"
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color,#06b6d4)] tracking-tight">
                Não substitui o Anki
              </h3>
              <p className="text-base sm:text-lg text-[var(--text-muted,#b8ada0)] leading-relaxed">
                O Anki é excepcional para memorização atômica (flashcards diários de fatos, termos, fórmulas e vocabulário). 
                No entanto, este gráfico faz uma organização macroscópica que você <strong>não tem no Anki</strong>: uma visão panorâmica, temporal e integrada de disciplinas e matérias completas.
              </p>
              <p className="text-base sm:text-lg text-[var(--text-muted,#b8ada0)] leading-relaxed">
                Sendo assim, é de suma importância utilizá-lo em <strong className="text-[var(--text-main,#f3f0ea)] font-semibold">tópicos de revisão geral do conteúdo aprendido</strong>.
              </p>
            </div>

            <div className="border-l-2 border-[var(--accent-color,#06b6d4)] pl-5 sm:pl-6 py-1.5 text-base text-[var(--text-muted,#b8ada0)] leading-relaxed mt-1">
              <span className="font-semibold text-[var(--accent-color,#06b6d4)] block mb-1.5 text-base">
                Exemplo prático:
              </span>
              Você estuda múltiplos tópicos durante a semana e exercita seus flashcards. No fim de semana (por exemplo, no sábado), você adiciona o resumo geral da matéria aprendida no planejador para gerenciar os ciclos amplos de consolidação ao longo do tempo.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EbbinghausTheorySection;
