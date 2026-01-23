# GarageFlow

GarageFlow is a self-initiated front-end concept for a small auto repair workshop: repair orders, customers, schedule, estimates, and analytics in one admin shell. Built with Angular 19 and Chart.js, it explores how day-to-day shop operations might look on a single screen—KPIs, filterable job lists, charts, and a work-order detail drawer. Current data is mocked; nothing persists between sessions.

## Live Demo — [🔗](https://garageflow.netlify.app/)

## Overview

The app is organized around workshop workflows: bays, technicians, work orders, bookings, and revenue. Views target shop owners and front-desk staff who need numbers at a glance, searchable jobs, and chart-backed analytics. Routing, signals, and shared components carry most of the structure; domain records live in client-side fixtures.

## Highlights

- Dashboard with shop KPIs, workload chart, bay overview, approval queue, and activity feed
- Work orders with status/priority/technician filters, search, and a detail drawer
- Customers, schedule, estimates, and analytics views with Chart.js visualizations
- App shell with collapsible sidebar, top bar, theme toggle, and responsive mobile nav
- Reusable UI: status badges, KPI cards, empty states, drawer, chart wrappers

## Tech Stack

- Angular 19 (standalone components, signals)
- TypeScript
- Tailwind CSS 3 + SCSS design tokens
- Chart.js 4
- In-memory mock data (no API)

## Run Locally

```bash
npm install
npm start
```

```bash
npm run build
```

## Scope Note

This build focuses on front-end experience and interaction design. Current data is mocked—no API, authentication, or persistence. Create/update/delete actions do not save; filters run against bundled fixtures only.