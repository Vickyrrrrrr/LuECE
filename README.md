# LuECE Advisor 🎓

**LuECE Advisor** is a premium, AI-powered informational portal designed for first-year students of the Electronics & Communication Engineering (ECE) department at **Lucknow University**. 

It provides an interactive way to explore the department's curriculum, infrastructure, faculty details, and previous year cutoff ranks through a modern, high-performance web interface.

## 🚀 Key Features

-   **AI-Powered Chat (RAG)**: An intelligent advisor that answers specific questions about the department using a hybrid Retrieval-Augmented Generation (RAG) system.
-   **Instant RAG**: A local keyword-matching engine for lightning-fast responses to common queries.
-   **Cutoff Insights**: Detailed breakdown of UPTAC counselling cutoff ranks (2025) across all categories (General, OBC, SC, ST, EWS).
-   **Department Overview**: Curated information on curriculum highlights, placements, internships, and laboratory infrastructure.
-   **Responsive Design**: A premium "Lovable-inspired" aesthetic that works seamlessly on mobile and desktop.

## 🛠️ Tech Stack

### Frontend
-   **Next.js 16 (App Router)**: Core framework for high-performance React application.
-   **Tailwind CSS**: For a minimalist, warm-toned design system.
-   **Framer Motion**: Smooth micro-animations and page transitions.
-   **Lucide React**: For beautiful, consistent iconography.

### Backend & AI
-   **LLM**: Leveraging **Llama 3.1 8B** via NVIDIA's integration API for advanced reasoning.
-   **Hybrid RAG Engine**:
    -   **Local Layer**: Keyword and synonym-based matching for instant data retrieval.
    -   **AI Layer**: LLM-grounded context using department-specific knowledge bases.
-   **Data Scraper**: Custom Node.js scripts (`scrape.mjs`) for extracting and structuring data from university portals.

## 📂 Project Structure

-   `src/app/api/chat`: The streaming chat endpoint with buffering logic.
-   `src/lib/data.ts`: The primary knowledge base for the department.
-   `src/lib/cutoff.ts`: Previous year rank data.
-   `src/lib/rag.ts`: The core RAG matching logic.
-   `scripts/`: Utility scripts for PDF extraction and web scraping.

## 🛠️ Getting Started

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/Vickyrrrrrr/LuECE.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env.local` file and add your NVIDIA API key:
    ```env
    API_KEY=your_api_key_here
    ```
4.  **Run locally**:
    ```bash
    npm run dev
    ```

---
Made with ❤️ by [Vickyrrrrrr](https://github.com/Vickyrrrrrr)
