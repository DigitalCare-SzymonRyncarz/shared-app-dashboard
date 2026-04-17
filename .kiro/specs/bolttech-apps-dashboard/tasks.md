# Implementation Plan: Bolttech Poland Applications Dashboard

## Overview

Scaffold a React 18 + Vite + TypeScript SPA from scratch, implement all components and hooks described in the design, wire everything together, and cover correctness properties with fast-check property-based tests alongside Vitest unit tests.

## Tasks

- [x] 1. Scaffold project and configure tooling
  - Run `npm create vite@latest . -- --template react-ts` (or equivalent) to initialise the project
  - Install dependencies: `tailwindcss`, `tailwind-merge`, `lucide-react`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `fast-check`, `jsdom`
  - Configure `tailwind.config.ts` with the brand palette (`#00bcc5`, `#150e4f`) and dark-mode class strategy
  - Configure `vitest.config.ts` with jsdom environment and `@testing-library/jest-dom` setup file
  - Copy `applications.json` and `bolttech-thumbnailtwitter.avif` into `public/` (or `src/assets/` as appropriate for static Vite import)
  - _Requirements: 1.1, 7.5_

- [x] 2. Define TypeScript types and data models
  - [x] 2.1 Create `src/types.ts` with all shared interfaces
    - `Application`, `Environment`, `ApplicationsFile`, `HealthStatus`, `HealthMap` as specified in the design
    - `UrlButtonVariant`, `AppCardProps`, `EnvColumnProps`, `UrlButtonProps`, `HealthButtonProps`, `RepoButtonProps`
    - _Requirements: 1.1, 2.3, 2.4, 5.1_

- [x] 3. Implement `useApplications` hook
  - [x] 3.1 Create `src/hooks/useApplications.ts`
    - Static Vite import of `applications.json`; expose `{ applications, error }`
    - Set `error` string when import/parse throws; return empty array on error
    - _Requirements: 1.1, 1.3, 1.4_
  - [ ]* 3.2 Write unit tests for `useApplications`
    - Test: returns parsed array on success
    - Test: returns error string when import throws
    - _Requirements: 1.4_

- [x] 4. Implement `useHealthPoller` hook
  - [x] 4.1 Create `src/hooks/useHealthPoller.ts`
    - Initialise all non-null `healthCheckUrl` entries to `"unknown"` in a `Map`
    - Fire immediate full poll on mount; schedule `setInterval` for 5-minute repeating polls
    - `checkNow(url)` sets entry to `"loading"`, fires single fetch, resolves to `"healthy"` (2xx) or `"unhealthy"` (non-2xx), catches rejections → `"unknown"`
    - Clean up interval on unmount
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_
  - [ ]* 4.2 Write property test for health status mapping (Property 8)
    - **Property 8: Health status reflects HTTP response code**
    - **Validates: Requirements 5.2, 5.3**
    - Generate random HTTP status codes; assert `"healthy"` iff 200–299, `"unhealthy"` otherwise
  - [ ]* 4.3 Write property test for network failure handling (Property 9)
    - **Property 9: Network or CORS failure yields unknown status**
    - **Validates: Requirements 5.7**
    - Simulate fetch rejection for random URLs; assert status becomes `"unknown"`
  - [ ]* 4.4 Write property test for poller coverage (Property 7)
    - **Property 7: Health poller covers all non-null URLs**
    - **Validates: Requirements 5.1**
    - Generate random application lists with mixed null/non-null health URLs; assert fetch called exactly once per non-null URL on mount
  - [ ]* 4.5 Write property test for on-demand health check (Property 10)
    - **Property 10: On-demand health check triggers immediate fetch**
    - **Validates: Requirements 5.5**
    - Generate random health URLs; simulate `checkNow` call; assert fetch dispatched immediately

- [x] 5. Implement UI utility and base button styles
  - [x] 5.1 Create `src/utils/cn.ts`
    - Export a `cn(...inputs)` helper wrapping `tailwind-merge` for class composition
    - _Requirements: 7.5_
  - [x] 5.2 Create `src/components/UrlButton.tsx`
    - `variant="env"` → copies URL to clipboard on click; shows brief teal "copied" feedback
    - `variant="swagger"` → opens URL in new tab on click
    - Null/empty URL → disabled gray state, no action
    - Use `lucide-react` icons (e.g. `Copy`, `ExternalLink`)
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 7.4_
  - [ ]* 5.3 Write property test for null URL disables button (Property 4)
    - **Property 4: Null URL disables button and suppresses action**
    - **Validates: Requirements 3.3, 4.2**
    - Generate null/empty URL values; assert button is disabled and no clipboard/navigation side-effect fires on click
  - [ ]* 5.4 Write property test for env URL clipboard (Property 6)
    - **Property 6: Environment URL copy to clipboard**
    - **Validates: Requirements 3.1**
    - Generate random valid URLs; assert `navigator.clipboard.writeText` called with exact URL
  - [ ]* 5.5 Write property test for swagger/repo new tab (Property 5)
    - **Property 5: Non-null URL opens in new tab**
    - **Validates: Requirements 4.1, 6.1**
    - Generate random valid URLs; assert `window.open` called with correct URL and `_blank` target

- [x] 6. Implement `HealthButton` component
  - [x] 6.1 Create `src/components/HealthButton.tsx`
    - Renders green / red / gray / loading spinner states based on `HealthStatus`
    - Null/empty URL → disabled gray, no fetch triggered
    - Calls `onCheck()` on click when URL is non-null
    - Use `lucide-react` icons (e.g. `Activity`, `Loader2`)
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.8_
  - [ ]* 6.2 Write unit tests for `HealthButton`
    - Test: shows loading spinner while fetch is in-flight
    - Test: shows gray `unknown` on initial render
    - Test: disabled state when URL is null
    - _Requirements: 5.4, 5.6, 5.8_

- [x] 7. Implement `RepoButton` component
  - [x] 7.1 Create `src/components/RepoButton.tsx`
    - Opens `repositoryUrl` in new tab on click
    - Null/empty URL → disabled gray state
    - Use `lucide-react` `Github` or `ExternalLink` icon
    - _Requirements: 6.1, 6.2_

- [x] 8. Implement `EnvColumn` component
  - [x] 8.1 Create `src/components/EnvColumn.tsx`
    - Renders column header label (`tst` | `uat` | `pre` | `prd`)
    - Renders `UrlButton` (env), `UrlButton` (swagger), `HealthButton` in order
    - When `env` is `undefined`, all three buttons render disabled
    - _Requirements: 2.3, 2.4, 2.6_
  - [ ]* 8.2 Write unit test for undefined env column
    - Test: all 3 buttons disabled when `env` is `undefined`
    - _Requirements: 2.6_

- [x] 9. Implement `AppCard` component
  - [x] 9.1 Create `src/components/AppCard.tsx`
    - Renders card header with application name and `RepoButton`
    - Renders `EnvGrid` containing 4 `EnvColumn` components in order: `tst`, `uat`, `pre`, `prd`
    - Applies responsive grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
    - _Requirements: 2.1, 2.2, 2.3, 2.5_
  - [ ]* 9.2 Write property test for card structure invariant (Property 3)
    - **Property 3: Card structure invariant**
    - **Validates: Requirements 2.3, 2.4**
    - Generate random application lists; assert every card has 4 columns with correct labels and 3 buttons each
  - [ ]* 9.3 Write property test for application name in card (Property 2)
    - **Property 2: Application name appears in its card**
    - **Validates: Requirements 2.2**
    - Generate random application names; assert each name appears in its rendered card

- [x] 10. Implement `Header` component
  - [x] 10.1 Create `src/components/Header.tsx`
    - Renders Bolttech logo (`bolttech-thumbnailtwitter.avif`) and dashboard title
    - Applies dark background with brand colors
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ]* 10.2 Write unit test for `Header`
    - Test: renders `<img>` with `src` containing `bolttech-thumbnailtwitter.avif`
    - _Requirements: 7.3_

- [x] 11. Wire everything together in `App.tsx`
  - [x] 11.1 Compose `App.tsx` using `useApplications`, `useHealthPoller`, `Header`, and `AppCard` list
    - Render full-page error banner when `useApplications` returns an error
    - Pass `healthMap` and `checkNow` down to each `AppCard`
    - Apply global dark background and brand colors via Tailwind
    - _Requirements: 1.2, 1.4, 7.1, 7.2_
  - [ ]* 11.2 Write property test for data-driven card count (Property 1)
    - **Property 1: Data drives card count**
    - **Validates: Requirements 1.1, 1.2**
    - Generate random arrays of N applications; assert rendered card count equals N

- [x] 12. Checkpoint — ensure all tests pass
  - Run `npx vitest --run` and confirm all unit and property tests pass. Ask the user if any questions arise.

- [x] 13. Responsiveness and visual polish
  - [x] 13.1 Verify responsive layout across breakpoints
    - Confirm `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` reflows correctly
    - Ensure touch/click targets are accessible at 375 px
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ]* 13.2 Write property test for no horizontal overflow (Property 11)
    - **Property 11: No horizontal overflow at any supported viewport width**
    - **Validates: Requirements 8.1**
    - Generate random viewport widths in [375, 1440]; assert `document.body.scrollWidth <= window.innerWidth`

- [x] 14. Final checkpoint — ensure all tests pass
  - Run `npx vitest --run` and confirm the full test suite is green. Ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests are tagged with `// Feature: bolttech-apps-dashboard, Property N: <description>` comments
- `tailwind-merge` (`cn` helper) must be used for all Tailwind class composition
- The 5-minute polling interval constant should be extracted to a named constant for easy adjustment
