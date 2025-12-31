# 🚀 BeyondChats Assignment - Backend & AI Automation

This repository contains the **Backend Server** and **AI Automation Script** for the Full Stack Web Developer Intern assignment.

The project is built using **Node.js, Express, and MongoDB**, following a strict **Layered Architecture (Controller-Service-Repository)** to ensure clean separation of concerns and maintainability. It also features a **Standalone Worker Script** for handling complex AI tasks decoupled from the main server.

---

## 🏗️ Architecture & Design

### 1. Server Architecture (Layered Pattern)
The backend is structured to separate business logic from database operations:
* **Controllers:** Handle HTTP requests and responses.
* **Services:** Contain business logic (Orchestration).
* **Repositories:** Handle direct database interactions (Mongoose).
* **Models:** Define Database Schema.

### 2. Phase 2 Design (Decoupled Micro-Script)
Instead of blocking the main server with heavy AI/Scraping tasks, Phase 2 is implemented as a **Standalone Node.js Script** (`scripts/runAssignment.js`).
* It acts as an independent client.
* It fetches data via the **API Layer** (GET).
* It processes data (Search -> Scrape -> AI Rewrite).
* It publishes results back via the **API Layer** (PUT).
* **Robustness:** Includes fail-safe mechanisms for scraping (Brave Search Fallback) and AI generation (Simulation Mode).

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose)
* **AI Engine:** Google Gemini (Generative AI SDK)
* **Scraping:** Axios + Cheerio (with User-Agent rotation)
* **Search Strategy:** Brave Search / Bing / DuckDuckGo (HTML Parsing)

---

## 📂 Folder Structure

```bash
beyondchats-backend/
├── src/
│   ├── config/         # DB Connection logic
│   ├── controllers/    # API Controllers (Req/Res handling)
│   ├── models/         # Mongoose Schemas
│   ├── repositories/   # DB Access Layer (CRUD)
│   ├── routes/         # API Routes Definition
│   ├── services/       # Business Logic (Scraper, Google, LLM)
│   └── app.js          # Entry Point
├── scripts/
│   └── runAssignment.js # Phase 2: Standalone AI Worker Script
├── docs/
│   └── screenshots/    # Proof of execution
├── .env                # Environment variables
└── package.json

---

⚙️ Setup & Installation
1. Prerequisites
Node.js (v18+)

MongoDB (Local or Atlas)

Google Gemini API Key

2. Install Dependencies
Bash

npm install

3. Environment Variables
Create a .env file in the root directory:

Code snippet

PORT=3001
MONGO_URI=mongodb://localhost:27017/beyondchats_assignment
GEMINI_API_KEY=your_gemini_api_key_here

🚀 How to Run
Step 1: Start the Backend Server
This runs the Express API on Port 3001.

Bash

npm run dev

Step 2: Trigger Phase 1 (Scraping)
You can use Postman or Curl to populate the database with initial articles.

Endpoint: POST http://localhost:3001/api/articles/scrape

Step 3: Run Phase 2 (AI Automation Script)
Open a new terminal and run the worker script. This script will talk to the running server.

Bash

node scripts/runAssignment.js
Watch the terminal logs as it searches, scrapes, and rewrites articles using AI.

Method,                                 Endpoint,                                  Description
GET,                                    /api/articles,                             Fetch all articles.
POST,                                   /api/articles/scrape,                      Phase 1: Scrape 5 latest articles from BeyondChats.
PUT,                                    /api/articles/:id,                         Phase 2: Update article content (used by script).
DELETE,                                 /api/articles/clear,                       Clear all data from database.

---

📸 Proof of Execution
Phase 1: Scraping & Storage
Successfully scraping articles from BeyondChats and storing them in MongoDB.

Phase 2: AI Processing (Standalone Script)
Running the standalone script that fetches data via API, scrapes web context, generates AI content, and updates via API.

Database After AI Update: Notice the updated content structure (HTML) and source change to generative-ai.

Admin: Data Cleanup
API to reset the database for fresh testing.

🛡️ Fail-Safe Mechanisms
To ensure the project runs smoothly even during rate-limiting or API downtime, the following systems were implemented:

Search Fallback: If Google/DuckDuckGo blocks requests, the system switches to Brave Search logic.

Scraping Resilience: If a specific URL returns 403 (Forbidden), the generic scraper logs the error but continues processing other links.

AI Simulation Mode: If the LLM API quota is exceeded or models are unavailable, the system generates a structured, high-quality simulated response to ensure the pipeline completes successfully.