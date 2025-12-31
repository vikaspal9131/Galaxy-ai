# Setup Guide 

This document explains **only the setup steps** for running the project locally.  
Project description and features are intentionally omitted.

---

## Requirements

Make sure these are installed:

- Node.js (v18+)
- npm or yarn
- Database (as configured in Prisma)
- Google Gemini API key

---

## 1. Install Dependencies

```bash
npm install
```


### .env



DATABASE_URL="your_database_url"
GEMINI_API_KEY="your_gemini_api_key"






### Prisma setup 

```bash
npx prisma generate
npx prisma migrate dev

```
