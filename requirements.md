
# Project Name: Bolttech Poland Applications Dashboard

**Version:** 1.0.0

**Stack Preference:** [React + Tailwind + Vite]

## 1. System Overview
The application will only be a clien-sided frontend application. It's purpose is to display a list of applications with their urls per environment, swagger urls, repo url and health check status. All this will be generated from a json.

*  **Core Goal:** Application will display a list of applications that are hosted within company with their urls per environment, swagger urls, repo url and health check status. All this will be dynamically generated from a json. It's made so that everyone interested can on-demand check what are the urls and health statuses of every app that we have hosted in our company.

*  **Primary Users:** Every company's employee regardless of department they are working in.

  

## 2. Functional Requirements (EARS Notation)

| Pattern | Requirement (Syntax: "While/When/Where... the system shall...") |

| **Ubiquitous** | The system shall display a responsive list of application urls per environment as buttons. The list shall be generated dynamically based on a json file named applications.json where all the applications, environments and urls will be stated. There will be 4 environments per app: tst, uat, pre, prd. There will be 3 urls per environment: url, swaggerUrl, healthCheckUrl.

- If a url is empty or null the button displayed for that url shall be gray

- When a user clicks on swagger url, he should be taken to a swagger page in a new tab.
- When a user clicks on environment url, it should be copied to clipboard.
- The HealthCheck button shall be generated based on healthCheckUrl and it should just show the status of response from the healthcheck url. A request shall be made periodically (each 5 minutes) to that url so that the status is updated(green if the response was successful and red if not). When clicked a request to the healthCheckUrl shall be made and the button color shall be immediately updated. 

**If** the applications.json file is updated, the site generated shall also be updated accordingly

## 3. Component Architecture

- The application shall only have one page.

*  **`Layout`**: The layout shall have 4 columns, one per environment. Each application shall be a separate section and shall have 3 rows, one per the url. At the top there shall be an application name and company logo.

There's no authentication needed, only people that have vpn access will be able to open it within the company.

  

## 5. Visual Style & Branding

*  **Primary Colors:**  `#00bcc5` `#150e4f` 
* At the top there should be a bolttech logo that's in file: bolttech-thumbnailtwitter.avif

*  **Theme:** Dark

*  **Component Library:** [e.g., Lucide Icons, Radix UI primitives]

  

## 6. Definition of Done (Success Criteria)

* [ ] All sections displayed correspond to all applications stated in an array in applications.json
* [ ] All buttons are displayed properly

* [ ] The app is fully responsive from 375px to 1440px.

* [ ] Tailwind classes are organized using `tailwind-merge`.