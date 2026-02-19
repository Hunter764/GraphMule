# GraphMule - RIFT 2026 Hackathon
## Financial Crime Detection Engine

GraphMule is a hackathon-winning graph-based financial crime detection engine designed to identify money muling networks, smurfing patterns, and shell accounts using advanced graph algorithms.

### 🚀 Quick Start Guide

Since this is a full-stack application, you need to run the backend and frontend separately.

#### Prerequisites
- **Python 3.9+**
- **Node.js 18+**

---

### 1. Backend Setup (FastAPI)

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The API will be available at `http://localhost:8000`*

---

### 2. Frontend Setup (Next.js)

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
*The Web UI will be available at `http://localhost:3000`*

---

### 3. Usage

1. Open `http://localhost:3000` in your browser.
2. Upload a CSV file with transaction data.
   - **Format**: `transaction_id, sender_id, receiver_id, amount, timestamp`
3. Click **"Analyze Network"**.
4. View the interactive graph and fraud detection results.
5. Download the JSON report for submission.

### 4. Project Structure

- `backend/`
  - `main.py`: FastAPI application and API endpoints.
  - `algorithms.py`: Core graph algorithms (Cycle Detection, Smurfing, Shell Accounts).
- `frontend/`
  - `src/app/page.js`: Main dashboard page.
  - `src/components/GraphVisualizer.js`: Interactive graph using `react-force-graph-2d`.
  - `src/components/ResultsDashboard.js`: Fraud stats and summary tables.

### 5. Deployment

- **Backend**: Ready for Render/Railway (Python).
- **Frontend**: Ready for Vercel/Netlify (Next.js).

---
**Hackathon Use Only** - Built for RIFT 2026.
