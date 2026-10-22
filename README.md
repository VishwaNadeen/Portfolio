<div align="center">
  <a href="https://www.vishwanadeen.lk">
    <img src="./frontend/public/og-image.png" alt="Vishwa Nadeen Portfolio" width="100%" />
  </a>

  <h1>✨ Vishwa Nadeen — Portfolio Platform</h1>
  <p><strong>A polished, data-driven personal portfolio with a secure content-management workspace.</strong></p>

  <p>
    <a href="https://www.vishwanadeen.lk"><img src="https://img.shields.io/badge/Live_Site-Visit_Portfolio-22d3ee?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit live portfolio" /></a>
    <a href="https://github.com/VishwaNadeen"><img src="https://img.shields.io/badge/GitHub-VishwaNadeen-181717?style=for-the-badge&logo=github" alt="GitHub profile" /></a>
    <a href="https://www.linkedin.com/in/vishwa-nadeen-1180b0300"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn profile" /></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Express-5-111827?style=flat-square&logo=express" alt="Express 5" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  </p>
</div>

---

## 🌌 Overview

This repository powers the official portfolio of [Vishwa Nadeen](https://www.vishwanadeen.lk), a Software Engineer from Sri Lanka. It combines an animated public-facing experience with a protected admin workspace and a standalone API, keeping portfolio content fresh without hard-coding every update.

### What it does

- 🎨 Presents a responsive, motion-rich portfolio with home, about, projects, and experience pages.
- 📊 Displays live GitHub and YouTube statistics, repository language usage, and a visitor count.
- 🔄 Imports public GitHub repositories on startup and every six hours.
- 🗂️ Lets an administrator feature, reorder, hide, enrich, and add images to synced projects.
- 📄 Publishes a managed CV with browser view and download support.
- ✉️ Validates contact email addresses and delivers contact messages through Resend.
- 🔐 Protects admin routes and API operations with signed HTTP-only cookie sessions.

## 🧩 Architecture

```text
                         ┌──────────────────────────┐
                         │       Public website      │
                         │  Next.js · React · Motion │
                         └────────────┬─────────────┘
                                      │
             GitHub / YouTube ───────┼─────── Resend / Abstract API
                                      │
                         ┌────────────▼─────────────┐
                         │        Express API        │
                         │ Auth · Sync · CV · Stats  │
                         └────────────┬─────────────┘
                                      │
                   Cloudinary ───────┼──────── MongoDB
                                      │
                         ┌────────────▼─────────────┐
                         │       Admin workspace     │
                         │     Next.js · JWT guard   │
                         └──────────────────────────┘
```

| App | Directory | Purpose | Default local URL |
| --- | --- | --- | --- |
| 🌐 Public portfolio | `frontend/` | Visitor-facing site and contact endpoints | `http://localhost:3000` |
| 🛠️ Admin workspace | `admin/` | Protected project, CV, and dashboard controls | `http://localhost:3001`* |
| ⚙️ API | `backend/` | MongoDB, authentication, sync jobs, uploads, and public data | `http://localhost:5001` |

\*Next.js selects the next available port if the public site is already using `3000`.

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>🌠 Public experience</h3>
      <ul>
        <li>Animated hero, 3D social links, page transitions, and ambient backgrounds</li>
        <li>About page with journey, education, skills, interests, and downloadable CV</li>
        <li>Live GitHub project grid with custom cards and external links</li>
        <li>GitHub language breakdown and GitHub/YouTube live-stat cards</li>
        <li>Responsive floating contact form, email verification, and scroll-to-top control</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🧰 Content operations</h3>
      <ul>
        <li>GitHub repository sync with automatic removal of private, forked, or deleted projects</li>
        <li>Feature, hide, reorder, retitle, redescribe, categorize, and link projects</li>
        <li>Cloudinary-backed project image upload and replacement</li>
        <li>CV upload, replacement, preview, download, and deletion</li>
        <li>Admin health and visitor-count dashboard with JWT-protected access</li>
      </ul>
    </td>
  </tr>
</table>

## 🛠️ Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lottie, Lucide, React Icons |
| Admin | Next.js 16, React 19, TypeScript, Tailwind CSS 4, JOSE |
| Backend | Node.js, Express 5, TypeScript, Mongoose, JWT, Helmet, CORS, rate limiting, Multer, node-cron |
| Services | MongoDB, GitHub REST API, YouTube Data API, Cloudinary, Resend, Abstract Email Validation |

## 🚀 Run locally

### 1. Prerequisites

- Node.js 20.9+ (recommended for Next.js 16)
- npm
- A MongoDB database (local or Atlas)
- GitHub personal access token and username
- Optional service accounts for YouTube, Cloudinary, Resend, and Abstract Email Validation

### 2. Install dependencies

Each application owns its own `package.json` and lockfile.

```bash
cd frontend && npm install
cd ../backend && npm install
cd ../admin && npm install
```

### 3. Configure environment files

Create the following untracked files. Never commit real credentials.

<details>
<summary><strong>backend/.env</strong></summary>

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# GitHub and platform statistics
GITHUB_USERNAME=VishwaNadeen
GITHUB_TOKEN=github_personal_access_token
YOUTUBE_API_KEY=your_youtube_data_api_key
YOUTUBE_CHANNEL_ID=your_youtube_channel_id
GITHUB_WEBHOOK_SECRET=optional_webhook_secret

# Admin authentication
ADMIN_USER=admin_username
ADMIN_PASS=strong_password
JWT_SECRET=a_long_random_secret_shared_with_admin
ADMIN_TOKEN_EXPIRES=2h
COOKIE_NAME=admin_token
# COOKIE_DOMAIN=your-domain.com  # Set for a production shared domain when needed

# Uploads and contact-message records
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
IP_HASH_SALT=random_salt_for_contact_ip_hashing
```
</details>

<details>
<summary><strong>frontend/.env.local</strong></summary>

```env
# Express API used for projects, stats, visits, and the public CV
NEXT_PUBLIC_API_BASE=http://localhost:5001

# GitHub language endpoint
GITHUB_USER=VishwaNadeen
GITHUB_TOKEN=github_personal_access_token

# Contact form email delivery
RESEND_API_KEY=re_your_resend_key
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
CONTACT_TO_EMAIL=your-inbox@example.com

# Contact form deliverability checks
ABSTRACT_EMAIL_API_KEY=your_abstract_api_key
```
</details>

<details>
<summary><strong>admin/.env.local</strong></summary>

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
# Must match backend JWT_SECRET so the Next.js route guard can verify the session.
JWT_SECRET=a_long_random_secret_shared_with_backend
```
</details>

### 4. Start the platform

Use three terminals:

```bash
# Terminal 1 — API
cd backend
npm run dev
```

```bash
# Terminal 2 — public portfolio
cd frontend
npm run dev
```

```bash
# Terminal 3 — admin workspace
cd admin
npm run dev
```

Open the public site at `http://localhost:3000` and the admin login at `http://localhost:3001/admin/login` (or the port Next.js reports).

> **First boot:** after connecting to MongoDB, the API immediately syncs platform statistics and GitHub repositories, then repeats both jobs every six hours.

## 🔐 Environment reference

| Variable | App | Required for | Notes |
| --- | --- | --- | --- |
| `MONGODB_URI` | Backend | API startup | The API exits if this is missing. |
| `CORS_ORIGINS` | Backend | Browser API access | Comma-separated allowed origins. |
| `GITHUB_USERNAME` | Backend | Repository and GitHub-stat sync | Public GitHub username. |
| `GITHUB_USER` | Frontend | Language analysis route | GitHub account used by the Next.js route. |
| `GITHUB_TOKEN` | Frontend + Backend | GitHub API access | Needed for private-repository language analysis in the frontend route. |
| `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID` | Backend | YouTube stats | Required for platform-stat synchronization. |
| `ADMIN_USER`, `ADMIN_PASS`, `JWT_SECRET` | Backend | Admin sign-in | Keep the secret private and robust. |
| `JWT_SECRET` | Admin | Route guard | Must exactly match the backend secret. |
| `NEXT_PUBLIC_API_BASE` | Frontend | Public API requests | Defaults to `http://localhost:5001` in code. |
| `NEXT_PUBLIC_API_URL` | Admin | Admin API requests | Defaults to `http://localhost:5001` in code. |
| `CLOUDINARY_*` | Backend | Project image management | Needed when uploading project images. |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Frontend | Contact email delivery | Used by `/api/contact`. |
| `ABSTRACT_EMAIL_API_KEY` | Frontend | Email validation | Used by `/api/validate-email`. |

## 📡 API map

The Express API exposes a health check plus public, administrative, sync, analytics, and CV endpoints.

| Area | Key endpoints |
| --- | --- |
| Health | `GET /health` |
| Public projects | `GET /api/github/projects`, `GET /api/github/featured?limit=3` |
| Live statistics | `GET /api/stats/latest` |
| Visitor counter | `POST /api/public/visit` |
| Public CV | `GET /api/cv/public`, `/public/view`, `/public/download` |
| Administration | `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/projects`, `PATCH /api/admin/projects/:id` |
| Admin tools | `POST /api/admin/github/sync`, image upload/remove, CV management, dashboard health/stats |

Protected endpoints require the admin session cookie issued at login.

## 🗂️ Project structure

```text
Portfolio/
├── frontend/                 # Public Next.js portfolio
│   ├── app/                  # Routes, metadata, API routes, global styles
│   ├── components/           # Navigation, cards, animations, contact UI
│   ├── sections/             # Home and about-page sections
│   ├── data/                 # Profile, social, and project adapters
│   └── public/               # Icons, manifest, OG image, Lottie asset
├── backend/                  # Express + MongoDB API
│   └── src/
│       ├── config/           # Database and Cloudinary configuration
│       ├── jobs/             # GitHub and platform-stat cron jobs
│       ├── middleware/       # Auth and upload protection
│       ├── models/           # Projects, CV, visits, stats, contact messages
│       ├── routes/           # API route groups
│       └── services/         # External platform synchronization
├── admin/                    # Protected Next.js admin workspace
│   └── app/admin/            # Login, dashboard, project, and CV screens
└── README.md
```

## ✅ Quality checks

Run checks independently for each app:

```bash
cd frontend && npm run lint && npm run build
cd ../backend && npm run build
cd ../admin && npm run lint && npm run build
```

## 👤 Contact

Built and maintained by **Vishwa Nadeen**.

- 🌐 Website: [vishwanadeen.lk](https://www.vishwanadeen.lk)
- 💼 LinkedIn: [vishwa-nadeen-1180b0300](https://www.linkedin.com/in/vishwa-nadeen-1180b0300)
- 🐙 GitHub: [@VishwaNadeen](https://github.com/VishwaNadeen)
- 📺 YouTube: [@vishwanadeen](https://youtube.com/@vishwanadeen)

<div align="center">
  <br />
  <sub>Designed with curiosity, motion, and a healthy respect for reliable software. ✦</sub>
</div>
