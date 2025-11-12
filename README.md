# SMB Suite — Angebote, Rechnungen & Mini-ERP für kleine Unternehmen

**Stack:** Next.js (App Router, **Sass**), NestJS + Prisma (PostgreSQL), Redis (Queues), Docker Compose

[![CI](https://github.com/EwaldHertel-hub/smb-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/EwaldHertel-hub/smb-suite/actions/workflows/ci.yml)

> Ziel: Zwei praxisnahe Apps im Monorepo: 
> 1) **Smart Angebots- & Rechnungsmanager**
> 2) **Business Dashboard (Mini-ERP Light)**

---

## ✨ Features (MVP)
- Kundenverwaltung (CRM light)
- Angebote erstellen → PDF → E-Mail-Versand
- Angebot → Rechnung umwandeln
- Rechnungsstatus & Zahlungen
- Dashboard: Umsatz/Monat & offene Posten
- CSV-Import (Dashboard) & einfache KPIs

## 🏗️ Architektur
Monorepo mit Workspaces:

apps/
api/ # NestJS + Prisma + PostgreSQL
web/ # Next.js + Sass (Frontend)
packages/
ui/ # (optional) Shared UI-Komponenten
schemas/ # (optional) Zod/OpenAPI Schemas
infrastructure/
docker-compose.yml

bash
Code kopieren

- **API:** REST (NestJS), Auth (JWT), Prisma ORM, Queue (BullMQ/Redis)
- **Frontend:** Next.js (App Router), Sass, Axios, React Table
- **PDF-Service:** Headless Chrome (Puppeteer) — später als Queue-Job

## 🚀 Schnellstart (Lokal)
Voraussetzungen: Node 20+, PNPM, Docker Desktop
