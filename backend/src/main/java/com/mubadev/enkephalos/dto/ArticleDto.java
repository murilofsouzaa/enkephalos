package com.mubadev.enkephalos.dto;

import java.util.List;

public record ArticleDto(
        String id,
        String slug,
        String title,
        String date,
        String displayDate,
        String period,
        List<String> tags,
        String readTime,
        int discussionCount,
        String excerpt,
        String highlightQuote,
        List<HeaderDto> headers
) {
    public record HeaderDto(
            String id,
            String title,
            int level
    ) {}
}
