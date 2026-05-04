# OrganoChem Content Workflow

The site is now split into pages, with shared styling and shared topic-detail logic:

- `assets/css/style.css` controls the design.
- `assets/js/main.js` controls topic click notes, modals, search, progress, and interactive behavior.
- `parts/*.html` contains the visible part pages.

## Current Content System

All numbered syllabus topics use `masterTopicDetails` in `assets/js/main.js`.
When a topic is clicked, `buildBookChapter(num, d)` generates a detailed book-style chapter with:

- chapter orientation
- learning outcomes
- conceptual foundation
- study map
- mechanism/practical logic
- representative examples
- pharma/application angle
- interview answer structure
- common mistakes
- practice prompts
- chapter summary

`Chapter 14: Chirality` currently has a custom handwritten chapter.

## Best Next Step For Full Premium Textbook Quality

For truly premium notes, replace generated chapters one-by-one with custom handwritten chapters:

1. Add a custom chapter in `assets/js/main.js`.
2. Check it in the browser.
3. Continue part-by-part:
   - Part 01: GOC - custom chapters added
   - Part 02: Stereochemistry
   - Part 03: Functional Groups
   - Part 04: Redox
   - Part 05: Rearrangements
   - Part 06: Couplings
   - Part 07: Named Reactions
   - Part 08: Analytical
   - Part 09: Pharma Industrial
   - Part 10: Advanced

This avoids making any single HTML file huge.
