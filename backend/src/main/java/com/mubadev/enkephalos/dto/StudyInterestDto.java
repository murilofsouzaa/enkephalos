package com.mubadev.enkephalos.dto;

import java.util.List;

public record StudyInterestDto(
        String id,
        String title,
        String category,
        String description,
        String status,
        int progressPercentage,
        List<String> tags,
        String iconName,
        int articleCount,
        String relatedSlug
) {}
