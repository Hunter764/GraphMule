# 🐴 GraphMule - Financial Crime Detection Engine

> **RIFT 2026 Hackathon Finalist Project**

GraphMule is a next-generation, graph-based financial crime detection engine designed to identify money muling networks, smurfing patterns, and shell accounts using advanced network analysis and beautiful, high-performance data visualizations.

---

## 🎯 The Problem
In modern digital finance, money laundering structurally mimics normal transactional traffic. Traditional rule-based engines (e.g., "flag transactions over $10,000") fail to catch coordinated bad actors who break their movements into micro-transactions sent across dozens of burner accounts ("smurfing") before consolidating the funds elsewhere. 

## 💡 The GraphMule Solution
GraphMule analyzes the **relationships** between accounts, not just the isolated transactions. By representing the financial ledger as a mathematical Graph (where Accounts = Nodes and Transactions = Edges), we employ powerful topological algorithms to instantly detect:
1. **Circular Fast-Flows (Money Muling Rings)**: Funds moving rapidly in closed loops to obfuscate the original source.
2. **Scatter-Gather (Smurfing)**: A single source sending micro-payments to multiple intermediate nodes, which then forward it to a final destination.
3. **High-Risk Centrality**: Accounts acting as unnatural routing hubs for thousands of separate micro-transactions.

---

## ✨ Core Features

* **Advanced Graph Algorithms**: Powered by Python's `NetworkX` library to execute deeply nested Cycle Detection and connected-component analysis on raw transaction ledgers.
* **Premium Fintech Aesthetic**: A stunning UI/UX designed with a `charcoal/graphite` color palette, sophisticated glassmorphism, and a liquid 3D mesh landing background using `react-three-fiber` and ShaderGradients.
* **Interactive Threat Modeling**: A dynamic, physics-based 2D force graph that allows investigators to visually isolate fraud rings, interrogate individual suspicious accounts, and track relationships in real-time.
* **Intelligent Dashboard**: At-a-glance summaries calculating total financial risk exposure, flagged networks, and a precise CSV schema modal for clean data ingestion.
* **One-Click Intelligence Export**: Instantly export the analysis result as a structured JSON report for downstream compliance teams.

---

## 🛠️ Technology Stack

GraphMule perfectly decouples high-performance mathematical modeling from premium client-side rendering.

**Frontend (Client)**
* **Framework**: Next.js 14 (React)
* **Styling**: TailwindCSS
* **Visual Data Enging**: `react-force-graph-2d`
* **Animations & 3D**: Framer Motion, `@shadergradient/react`, `@react-three/fiber`, `three.js`
* **Icons**: Lucide-React

**Backend (API & Analysis)**
* **Framework**: FastAPI (Python)
* **Data Processing**: Pandas
* **Graph Mathematics**: NetworkX
* **Server**: Uvicorn

---

## 🚀 Quick Start & Local Setup

Since this is a decoupled full-stack application, you need to run the backend and frontend separately.

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**

### 1. Backend Setup (FastAPI / NetworkX)

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

Run the intelligence server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The API is now analyzing data on `http://localhost:8000`*

### 2. Frontend Setup (Next.js)

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
# We use legacy-peer-deps to allow React 18 compatibility with ShaderGradient
npm install --legacy-peer-deps
```

Run the development server:
```bash
npm run dev
```
*The Web UI is now live on `http://localhost:3000`*



---
*Built with precision for the RIFT 2026 Hackathon.*
