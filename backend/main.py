from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import networkx as nx
import io
import time
from algorithms import detect_cycles, detect_smurfing, detect_shell_accounts

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "GraphMule API is running"}

@app.post("/analyze")
async def analyze_transactions(file: UploadFile = File(...)):
    start_time = time.time()

    if not file.filename.endswith('.csv'):
        return JSONResponse(status_code=400, content={"error": "Only CSV files are allowed"})

    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))

        # CRITICAL ADDITION: Convert timestamps to datetime for the 72-hour check
        df['timestamp'] = pd.to_datetime(df['timestamp'])

        required_columns = {'transaction_id', 'sender_id', 'receiver_id', 'amount', 'timestamp'}
        if not required_columns.issubset(df.columns):
            return JSONResponse(status_code=400, content={"error": f"Missing columns."})

        # Build Graph
        G = nx.from_pandas_edgelist(
            df,
            source='sender_id',
            target='receiver_id',
            edge_attr=['amount', 'timestamp'],
            create_using=nx.DiGraph()
        )

        # Execute Algorithms
        cycles = detect_cycles(G)
        smurfing_data = detect_smurfing(df)
        shell_rings_data = detect_shell_accounts(G, df)

        fraud_rings = []
        suspicious_accounts_dict = {}
        ring_counter = 1

        # Helper function to track node scores without creating duplicates
        def flag_account(acc_id, score, pattern, ring_id):
            if acc_id not in suspicious_accounts_dict:
                suspicious_accounts_dict[acc_id] = {
                    "account_id": str(acc_id),
                    "suspicion_score": 0.0,
                    "detected_patterns": set(),
                    "ring_id": ring_id
                }
            current = suspicious_accounts_dict[acc_id]["suspicion_score"]
            suspicious_accounts_dict[acc_id]["suspicion_score"] = max(current, score)
            suspicious_accounts_dict[acc_id]["detected_patterns"].add(pattern)

        # 1. Process Cycles
        for cycle in cycles:
            ring_id = f"RING_{ring_counter:03d}"
            for node in cycle:
                flag_account(node, 95.0, f"cycle_length_{len(cycle)}", ring_id)
            fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": cycle,
                "pattern_type": "cycle",
                "risk_score": 95.0
            })
            ring_counter += 1

        # 2. Process Fan-In Smurfing
        for ring in smurfing_data["fan_in"]:
            ring_id = f"RING_{ring_counter:03d}"
            for node in ring:
                flag_account(node, 88.5, "fan_in_smurfing", ring_id)
            fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": ring,
                "pattern_type": "fan_in_smurfing",
                "risk_score": 88.5
            })
            ring_counter += 1

        # 3. Process Fan-Out Smurfing
        for ring in smurfing_data["fan_out"]:
            ring_id = f"RING_{ring_counter:03d}"
            for node in ring:
                flag_account(node, 88.5, "fan_out_smurfing", ring_id)
            fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": ring,
                "pattern_type": "fan_out_smurfing",
                "risk_score": 88.5
            })
            ring_counter += 1

        # 4. Process Shell Networks
        for ring in shell_rings_data:
            ring_id = f"RING_{ring_counter:03d}"
            for node in ring:
                flag_account(node, 92.0, "layered_shell", ring_id)
            fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": ring,
                "pattern_type": "layered_shell",
                "risk_score": 92.0
            })
            ring_counter += 1

        # Finalize Suspicious Accounts Output
        suspicious_accounts = []
        for v in suspicious_accounts_dict.values():
            v["detected_patterns"] = list(v["detected_patterns"])
            suspicious_accounts.append(v)
            
        suspicious_accounts.sort(key=lambda x: x['suspicion_score'], reverse=True)

        processing_time = round(time.time() - start_time, 3)

        response_data = {
            "suspicious_accounts": suspicious_accounts,
            "fraud_rings": fraud_rings,
            "summary": {
                "total_accounts_analyzed": len(G.nodes()),
                "suspicious_accounts_flagged": len(suspicious_accounts),
                "fraud_rings_detected": len(fraud_rings),
                "processing_time_seconds": processing_time
            }
        }

        return JSONResponse(content=response_data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
