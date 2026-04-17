# Requirements Document

## Introduction

The Bolttech Poland Applications Dashboard is a client-side single-page application built with React, Vite, and Tailwind CSS. It displays a list of internal company applications with their environment URLs, Swagger documentation links, repository links, and live health check statuses — all dynamically driven by an `applications.json` file. The dashboard is accessible only over VPN and requires no authentication.

## Glossary

- **Dashboard**: The single-page frontend application described in this document.
- **Application**: A company-hosted service represented by one entry in `applications.json`.
- **Environment**: One of four deployment tiers — `tst`, `uat`, `pre`, `prd` — each with its own set of URLs.
- **Environment_URL**: The base URL of an Application in a given Environment.
- **Swagger_URL**: The URL pointing to the Swagger/OpenAPI documentation page for an Application in a given Environment.
- **HealthCheck_URL**: The URL used to probe the health status of an Application in a given Environment.
- **Repository_URL**: The source-code repository URL for an Application.
- **Health_Status**: The result of the most recent health check probe — one of `unknown`, `healthy`, or `unhealthy`.
- **Application_Card**: The UI section that groups all environment columns for a single Application.
- **Environment_Column**: One of the four vertical columns inside an Application_Card, representing one Environment.
- **URL_Button**: A clickable button that represents a single URL (Environment_URL, Swagger_URL, or HealthCheck_URL).
- **Poller**: The background timer that periodically triggers health check requests.
- **applications.json**: The JSON data file that is the single source of truth for all Application data.

## Requirements

### Requirement 1: Data Loading

**User Story:** As a company employee, I want the dashboard to load all application data from `applications.json`, so that the displayed information always reflects the current state of the file.

#### Acceptance Criteria

1. THE Dashboard SHALL load application data exclusively from `applications.json` at startup.
2. THE Dashboard SHALL render one Application_Card per entry in the `Applications` array of `applications.json`.
3. WHEN `applications.json` is updated and the Dashboard is reloaded, THE Dashboard SHALL reflect the updated data.
4. IF `applications.json` cannot be loaded, THEN THE Dashboard SHALL display a visible error message indicating that data could not be fetched.

---

### Requirement 2: Application Card Layout

**User Story:** As a company employee, I want each application displayed in a structured card with one column per environment, so that I can quickly compare URLs across environments.

#### Acceptance Criteria

1. THE Dashboard SHALL display each Application in a dedicated Application_Card.
2. THE Application_Card SHALL display the Application name at the top of the card.
3. THE Application_Card SHALL contain exactly 4 Environment_Columns, one each for `tst`, `uat`, `pre`, and `prd`, in that order.
4. EACH Environment_Column SHALL contain exactly 3 URL_Buttons: one for the Environment_URL, one for the Swagger_URL, and one for the HealthCheck_URL, in that order.
5. THE Application_Card SHALL display a repository link button using the Application's `repositoryUrl`.
6. IF an Application has no entry for a given Environment in `applications.json`, THEN THE Dashboard SHALL render that Environment_Column with all URL_Buttons in the disabled/gray state.

---

### Requirement 3: Environment URL Button — Copy to Clipboard

**User Story:** As a company employee, I want to copy an environment URL to my clipboard by clicking its button, so that I can quickly paste it into other tools.

#### Acceptance Criteria

1. WHEN a user clicks an Environment_URL button, THE Dashboard SHALL copy the corresponding URL string to the system clipboard.
2. WHEN the copy operation succeeds, THE Dashboard SHALL provide brief visual feedback on the button to confirm the copy.
3. IF the Environment_URL value is empty or null, THEN THE Dashboard SHALL render the button in a disabled gray state and SHALL NOT perform any clipboard action on click.

---

### Requirement 4: Swagger URL Button — Open in New Tab

**User Story:** As a company employee, I want to open the Swagger documentation for an application environment in a new browser tab, so that I can inspect the API without leaving the dashboard.

#### Acceptance Criteria

1. WHEN a user clicks a Swagger_URL button, THE Dashboard SHALL open the corresponding Swagger_URL in a new browser tab.
2. IF the Swagger_URL value is empty or null, THEN THE Dashboard SHALL render the button in a disabled gray state and SHALL NOT navigate on click.

---

### Requirement 5: Health Check Status and Polling

**User Story:** As a company employee, I want to see the live health status of each application per environment, so that I can quickly identify which services are up or down.

#### Acceptance Criteria

1. THE Poller SHALL send an HTTP GET request to each non-null HealthCheck_URL every 5 minutes.
2. WHEN a health check response has an HTTP status code in the range 200–299, THE Dashboard SHALL display the corresponding HealthCheck button in green.
3. WHEN a health check response has an HTTP status code outside the range 200–299, THE Dashboard SHALL display the corresponding HealthCheck button in red.
4. WHILE a health check request is in-flight, THE Dashboard SHALL display the corresponding HealthCheck button in a loading state.
5. WHEN a user clicks a HealthCheck button, THE Poller SHALL immediately send a new HTTP GET request to the corresponding HealthCheck_URL and update the Health_Status upon receiving a response.
6. IF a HealthCheck_URL is empty or null, THEN THE Dashboard SHALL render the HealthCheck button in a disabled gray state and THE Poller SHALL NOT send any request for that URL.
7. IF a health check request fails due to a network error or CORS restriction, THEN THE Dashboard SHALL display the corresponding HealthCheck button in the gray `unknown` state.
8. WHEN the Dashboard first loads, THE Dashboard SHALL display all HealthCheck buttons in the gray `unknown` state until the first poll completes.

---

### Requirement 6: Repository URL Button

**User Story:** As a company employee, I want to open the source code repository for an application, so that I can quickly navigate to the codebase.

#### Acceptance Criteria

1. WHEN a user clicks the repository button on an Application_Card, THE Dashboard SHALL open the corresponding Repository_URL in a new browser tab.
2. IF the `repositoryUrl` value is empty or null, THEN THE Dashboard SHALL render the repository button in a disabled gray state and SHALL NOT navigate on click.

---

### Requirement 7: Visual Design and Branding

**User Story:** As a company employee, I want the dashboard to follow Bolttech's visual identity, so that it feels like an official internal tool.

#### Acceptance Criteria

1. THE Dashboard SHALL apply a dark color theme throughout all UI components.
2. THE Dashboard SHALL use `#00bcc5` and `#150e4f` as the primary brand colors for interactive elements and backgrounds.
3. THE Dashboard SHALL display the Bolttech logo (`bolttech-thumbnailtwitter.avif`) in the page header.
4. THE Dashboard SHALL use Lucide Icons for all iconographic elements.
5. THE Dashboard SHALL manage all Tailwind CSS class composition using `tailwind-merge`.

---

### Requirement 8: Responsiveness

**User Story:** As a company employee, I want the dashboard to be usable on any screen size from mobile to desktop, so that I can check application statuses from any device.

#### Acceptance Criteria

1. THE Dashboard SHALL render correctly at viewport widths from 375px to 1440px without horizontal overflow.
2. WHEN the viewport width is below the breakpoint at which 4 columns cannot fit, THE Dashboard SHALL reflow the Environment_Columns into a stacked or scrollable layout.
3. THE Dashboard SHALL maintain legible text and accessible touch/click target sizes at all supported viewport widths.
