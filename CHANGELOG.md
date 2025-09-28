# Changelog

## Unreleased

- 2025-09-28: Redesign `src/pages/Profile.jsx` to a cleaner, responsive layout (two-column on desktop, stacked on mobile). Replaced previous multi-card layout with a clearer profile card, account information panel, and role-specific summary sections. Added accessible action buttons and preserved existing data sources from `useAuth`.

- 2025-09-28: Tweak `src/pages/Profile.jsx` to match an academic-style profile (large name header, left contact block with details, right sections for Biography, Research Interests, and Courses). Improved readability and mobile stack behavior.

Note: Updated `Profile.jsx` to improve readability and responsiveness. No API or backend changes.

- 2025-09-28: Redesign `src/pages/Projects.jsx` to a friendlier, professional card-based layout. Projects now display in a responsive 3-column grid on large screens and stack on smaller screens. Added consistent card heights, clearer metadata layout, and action buttons.

- 2025-09-28: Add thumbnail icons to each project card in `src/pages/Projects.jsx` for improved scannability.

- 2025-09-28: Update `src/pages/Projects.jsx` to an Amazon-style product grid (larger thumbnail, concise meta line, rating placeholder, and prominent CTA). This improves scannability and makes project cards resemble product tiles for easier browsing.
