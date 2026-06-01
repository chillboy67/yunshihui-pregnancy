# YunShiHui (孕食汇) — Pregnancy Nutrition & Health Management App

A full-stack mobile application that delivers personalized dietary guidance and nutrition tracking for pregnant women, built as a cross-disciplinary research project between the School of Nursing and the School of Biomedical Engineering.

---

## Core Features

- **User Authentication** — Secure registration, login, and JWT-based session management
- **Profile Management** — Gestational age, weight, and health condition tracking
- **Nutrition Analysis** — Trimester-aware dietary recommendations powered by a rule-based + ML backend
- **Diet Logging** — Daily food intake records with macro/micronutrient breakdown
- **AI Q&A Module** — Nutrition question-answering interface for pregnancy-specific queries
- **Health Education** — Curated article library covering prenatal care and dietary science

---

## Tech Stack

| Layer | Technology |
|------------|-------------------------------------|
| Frontend | uni-app (Vue 3) — iOS / Android / H5 |
| Backend | Python 3.11, FastAPI, Pydantic v2 |
| Database | MongoDB (Motor async driver) |
| Auth | JWT (python-jose), bcrypt |
| Deployment | Docker, Docker Compose |

---

## Project Highlights

- **Cross-platform in one codebase** — uni-app compiles to native iOS, Android, and web from a single Vue codebase, reducing frontend duplication by ~60%.
- **Async-first API** — FastAPI with Motor (async MongoDB driver) supports high-concurrency requests without thread blocking.
- **Containerized deployment** — Docker Compose orchestrates the FastAPI service and MongoDB instance, enabling one-command local setup and reproducible production environments.
- **Interdisciplinary design** — Requirements driven by nursing-domain experts ensure clinical relevance; engineering team owns the system architecture and delivery pipeline.

---

## Repository Structure

```
yunshihui-pregnancy/
├── ysh/
│   ├── hl-ysh/          # uni-app frontend (Vue 3)
│   │   ├── pages/       # App screens
│   │   ├── components/  # Shared UI components
│   │   └── api/         # Axios request layer
│   └── main.py          # FastAPI entry point
├── mongodb/             # DB init scripts & indexes
├── docker-compose.yml   # Multi-service orchestration
└── Dockerfile           # Backend container definition
```

---

## Getting Started

### Local Development

```bash
# Backend
cd ysh
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd ysh/hl-ysh
npm install
npm run dev:h5
```

### Docker (Recommended)

```bash
docker compose up --build
# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

---

## Screenshots

> _UI screenshots coming soon — app is currently in user testing with nursing college participants._

---

## License

MIT
