package com.mubadev.enkephalos.controller;

import com.mubadev.enkephalos.dto.ArticleDto;
import com.mubadev.enkephalos.dto.StudyInterestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudyController {

    private final List<StudyInterestDto> sampleInterests = List.of(
            new StudyInterestDto(
                    "ai-engineering",
                    "Engenharia de Inteligência Artificial & LLMs",
                    "Inteligência Artificial",
                    "Estudo aprofundado de arquiteturas de atenção, inferência otimizada, agentes com ferramentas e avaliação empírica.",
                    "Em Foco",
                    88,
                    List.of("Transformers", "Tool Calling", "KV-Cache", "Quantização"),
                    "Cpu",
                    3,
                    "propagandas-enganosas-openai-anthropic-nvidia"
            ),
            new StudyInterestDto(
                    "distributed-systems",
                    "Sistemas Distribuídos & Concorrência",
                    "Arquitetura de Software",
                    "Algoritmos de consenso (Raft, Paxos), consistência eventual e CRDTs para edição colaborativa.",
                    "Ativo",
                    74,
                    List.of("Consenso", "CRDT", "Event-Driven", "Kafka"),
                    "Network",
                    2,
                    "ai-memory-2-0-sistema-memoria-agentes-times"
            ),
            new StudyInterestDto(
                    "low-level-retro",
                    "Engenharia de Baixo Nível & Retrocomputação",
                    "Computação Fundamental",
                    "Arquiteturas 8 e 16-bits (MOS 6502, Z80), temporização de clocks e emuladores determinísticos.",
                    "Avançado",
                    65,
                    List.of("Assembly", "Emuladores", "6502", "Z80"),
                    "Binary",
                    1,
                    "desafio-ia-converter-roms-nes-para-master-system"
            )
    );

    private final List<ArticleDto> sampleArticles = List.of(
            new ArticleDto(
                    "1",
                    "propagandas-enganosas-openai-anthropic-nvidia",
                    "Você é um idiota se acredita nas propagandas enganosas da OpenAI, Anthropic, NVIDIA, DeepSeek. Entenda",
                    "2026-09-09",
                    "9 de setembro de 2026",
                    "2026 - Setembro",
                    List.of("#inteligencia-artificial", "#llms", "#negocios"),
                    "12 min de leitura",
                    42,
                    "Nvidia e OpenAI declararam que a AGI chegou, a OpenAI resolveu um problema do milênio na marra e ameaçou a carreira de um matemático...",
                    "Sua empolgação com IA é inversamente proporcional ao seu conhecimento sobre IA",
                    List.of(
                            new ArticleDto.HeaderDto("quem-vende-a-pa", "'A AGI chegou', diz quem vende a pá", 2),
                            new ArticleDto.HeaderDto("problema-milenio", "O 'problema do milênio' resolvido na marra", 2),
                            new ArticleDto.HeaderDto("conclusao", "Conclusão", 2)
                    )
            ),
            new ArticleDto(
                    "2",
                    "desafio-ia-converter-roms-nes-para-master-system",
                    "Desafio pra IA: converter ROMs de NES pra Master System/SMS",
                    "2026-09-07",
                    "7 de setembro de 2026",
                    "2026 - Setembro",
                    List.of("#retrocomputacao", "#agentes-de-codigo", "#games", "#emulacao"),
                    "18 min de leitura",
                    29,
                    "Tentei usar LLMs de fronteira pra converter ROMs de NES em jogos de Master System...",
                    "Traduzir instruções de CPU é fácil; emular o timing do clock da PPU com sprites é onde a ilusão desmorona.",
                    List.of(
                            new ArticleDto.HeaderDto("a-ideia-do-experimento", "A ideia do experimento", 2),
                            new ArticleDto.HeaderDto("ppu-vs-vdp", "O pesadelo gráfico", 2)
                    )
            )
    );

    @GetMapping("/interests")
    public ResponseEntity<List<StudyInterestDto>> getInterests() {
        return ResponseEntity.ok(sampleInterests);
    }

    @GetMapping("/articles")
    public ResponseEntity<List<ArticleDto>> getArticles() {
        return ResponseEntity.ok(sampleArticles);
    }

    @GetMapping("/articles/{slug}")
    public ResponseEntity<ArticleDto> getArticleBySlug(@PathVariable String slug) {
        return sampleArticles.stream()
                .filter(a -> a.slug().equalsIgnoreCase(slug))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
