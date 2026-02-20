from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import networkx as nx
import io
import time
from algorithms import detect_cycles, detect_smurfing, detect_shell_accounts, detect_bursts, detect_degree_anomalies

app = FastAPI(title="GraphMule Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_transactions(file: UploadFile = File(...)):
    start_time = time.time()

    if not file.filename.endswith('.csv'):
        return JSONResponse(status_code=400, content={"error": "Only CSV files are allowed"})

    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        df['timestamp'] = pd.to_datetime(df['timestamp'])

        # Multi-edge aggregation to prevent data loss in DiGraph
        agg_df = df.groupby(['sender_id', 'receiver_id']).agg({
            'amount': 'sum',
            'timestamp': 'max'
        }).reset_index()

        G = nx.from_pandas_edgelist(agg_df, source='sender_id', target='receiver_id', edge_attr=['amount', 'timestamp'], create_using=nx.DiGraph())

        # Execute all algorithms
        cycles = detect_cycles(G)
        smurfing_data = detect_smurfing(df)
        shell_rings_data = detect_shell_accounts(G, df)
        burst_accounts = detect_bursts(df)
        anomaly_hubs = detect_degree_anomalies(G)

        fraud_rings = []
        suspicious_accounts_dict = {}
        ring_counter = 1

        # CHANGES 6 & 7: Cumulative Risk Scoring Function
        def flag_account(acc_id, score_to_add, pattern, ring_id="N/A"):
            acc_id = str(acc_id)
            if acc_id not in suspicious_accounts_dict:
                suspicious_accounts_dict[acc_id] = {
                    "account_id": acc_id,
                    "suspicion_score": 0.0,
                    "detected_patterns": set(),
                    "ring_id": ring_id
                }

            # Additive scoring: The more patterns an account appears in, the higher the risk
            current_score = suspicious_accounts_dict[acc_id]["suspicion_score"]
            suspicious_accounts_dict[acc_id]["suspicion_score"] = min(99.0, current_score + score_to_add)

            suspicious_accounts_dict[acc_id]["detected_patterns"].add(pattern)

            if ring_id != "N/A" and suspicious_accounts_dict[acc_id]["ring_id"] == "N/A":
                suspicious_accounts_dict[acc_id]["ring_id"] = ring_id

        # 1. Cycles (Base Risk: +45)
        for cycle in cycles:
            ring_id = f"RING_{ring_counter:03d}"
            for node in cycle: flag_account(node, 45.0, f"cycle_length_{len(cycle)}", ring_id)
            fraud_rings.append({"ring_id": ring_id, "member_accounts": cycle, "pattern_type": "cycle", "risk_score": 95.0})
            ring_counter += 1

        # 2. Fan-In Smurfing (Base Risk: +35)
        for ring in smurfing_data["fan_in"]:
            ring_id = f"RING_{ring_counter:03d}"
            for node in ring: flag_account(node, 35.0, "fan_in_smurfing", ring_id)
            fraud_rings.append({"ring_id": ring_id, "member_accounts": ring, "pattern_type": "fan_in_smurfing", "risk_score": 88.5})
            ring_counter += 1

        # 3. Fan-Out Smurfing (Base Risk: +35)
        for ring in smurfing_data["fan_out"]:
            ring_id = f"RING_{ring_counter:03d}"
            for node in ring: flag_account(node, 35.0, "fan_out_smurfing", ring_id)
            fraud_rings.append({"ring_id": ring_id, "member_accounts": ring, "pattern_type": "fan_out_smurfing", "risk_score": 88.5})
            ring_counter += 1

        # 4. Layered Shells (Base Risk: +40)
        for ring in shell_rings_data:
            ring_id = f"RING_{ring_counter:03d}"
            for node in ring: flag_account(node, 40.0, "layered_shell", ring_id)
            fraud_rings.append({"ring_id": ring_id, "member_accounts": ring, "pattern_type": "layered_shell", "risk_score": 92.0})
            ring_counter += 1

        # 5. Velocity Bursts (Base Risk: +20)
        for node in burst_accounts:
            flag_account(node, 20.0, "high_velocity_burst")

        # 6. Degree Anomalies (Base Risk: +25)
        for node in anomaly_hubs:
            flag_account(node, 25.0, "degree_anomaly_hub")

        # Final formatting
        suspicious_accounts = []
        for v in suspicious_accounts_dict.values():
            v["detected_patterns"] = list(v["detected_patterns"])
            suspicious_accounts.append(v)

        suspicious_accounts.sort(key=lambda x: x['suspicion_score'], reverse=True)

        response_data = {
            "suspicious_accounts": suspicious_accounts,
            "fraud_rings": fraud_rings,
            "summary": {
                "total_accounts_analyzed": len(G.nodes()),
                "suspicious_accounts_flagged": len(suspicious_accounts),
                "fraud_rings_detected": len(fraud_rings),
                "processing_time_seconds": round(time.time() - start_time, 3)
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
