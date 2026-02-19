from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import networkx as nx
import io
import time
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from algorithms import detect_cycles, detect_smurfing, detect_shell_accounts

# Exact Schema Models
class SuspiciousAccount(BaseModel):
    account_id: str
    suspicion_score: float = Field(ge=0, le=100)
    detected_patterns: List[str]
    ring_id: str

class FraudRing(BaseModel):
    ring_id: str
    member_accounts: List[str]
    pattern_type: str
    risk_score: float

class SummaryStats(BaseModel):
    total_accounts_analyzed: int
    suspicious_accounts_flagged: int
    fraud_rings_detected: int
    processing_time_seconds: float

class FraudReportSchema(BaseModel):
    suspicious_accounts: List[SuspiciousAccount]
    fraud_rings: List[FraudRing]
    summary: SummaryStats

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
    
    # Check file type
    if not file.filename.endswith('.csv'):
        return JSONResponse(status_code=400, content={"error": "Only CSV files are allowed"})

    try:
        # Read CSV directly into DataFrame
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        
        # Basic Validation
        required_columns = {'transaction_id', 'sender_id', 'receiver_id', 'amount', 'timestamp'}
        if not required_columns.issubset(df.columns):
             return JSONResponse(status_code=400, content={"error": f"Missing columns. Required: {required_columns}"})

        # Build Graph
        # We use a DiGraph. If there are multiple transactions between A and B, 
        # DiGraph will only keep the last one unless we use MultiDiGraph.
        # However, for cycle detection and flow, DiGraph is usually sufficient for structure.
        # But if we need to sum amounts, we might need to aggregate first.
        # For this hackathon, let's aggregate amounts if multiple edges exist or just take the latest.
        # Promoting to MultiDiGraph might make simple_cycles slower or more complex.
        # Let's stick to DiGraph and maybe aggregate weights if needed.
        # For the prompt "sender_id (becomes a node)", "receiver_id (becomes a node)".
        
        G = nx.from_pandas_edgelist(
            df, 
            source='sender_id', 
            target='receiver_id', 
            edge_attr=['amount', 'timestamp'],
            create_using=nx.DiGraph()
        )
        
        # 1. Detect Cycles (Rings)
        cycles = detect_cycles(G) # List of lists of nodes
        
        # 2. Detect Smurfing (Using DataFrame for temporal analysis)
        smurfing_data = detect_smurfing(df) # {'fan_in': [], 'fan_out': []}
        
        # 3. Detect Shell Accounts
        shell_accounts = detect_shell_accounts(G) # List of nodes
        
        # Process Rings for Output
        fraud_rings = []
        for i, cycle in enumerate(cycles):
            ring_id = f"RING_{i+1:03d}"
            fraud_rings.append({
                "ring_id": ring_id,
                "member_accounts": cycle,
                "pattern_type": "cycle",
                "risk_score": 95.0 + (len(cycle) * 1.0) # Heuristic: longer cycles might be higher risk? Or fixed high score.
            })

        # Process Suspicious Accounts
        suspicious_accounts = []
        
        # We need to score ALL nodes that are involved in any suspicious activity
        suspect_nodes = set()
        for cycle in cycles:
            suspect_nodes.update(cycle)
        suspect_nodes.update(smurfing_data['fan_in'])
        suspect_nodes.update(smurfing_data['fan_out'])
        suspect_nodes.update(shell_accounts)
        
        for node in suspect_nodes:
            # Re-calculate specific score details
            # We can't reuse the algorithm's internal scoring easily without passing all data back
            # So we implement a scoring logic here or helper
            
            score = 0
            patterns = []
            node_ring_id = None
            
            # Check Rings
            for ring in fraud_rings:
                if node in ring['member_accounts']:
                    score += 50
                    patterns.append(f"cycle_length_{len(ring['member_accounts'])}")
                    node_ring_id = ring['ring_id'] # Assign the first ring found (simplification)
                    break # Stop after finding one ring for the ID field
            
            # Check Smurfing
            if node in smurfing_data['fan_in']:
                score += 30
                patterns.append("fan_in_smurfing")
            if node in smurfing_data['fan_out']:
                score += 30
                patterns.append("fan_out_smurfing")
                
            # Check Shell
            if node in shell_accounts:
                score += 20
                patterns.append("shell_account")
            
            final_score = min(score, 100)
            
            suspicious_accounts.append({
                "account_id": str(node),
                "suspicion_score": float(final_score),
                "detected_patterns": list(set(patterns)),
                "ring_id": node_ring_id if node_ring_id else "N/A"
            })
            
        # Sort by score descending
        suspicious_accounts.sort(key=lambda x: x['suspicion_score'], reverse=True)

        processing_time = round(time.time() - start_time, 3)
        
        response_data = {
            "suspicious_accounts": suspicious_accounts,
            "fraud_rings": fraud_rings,
            "summary": {
                "total_accounts_analyzed": len(G.nodes),
                "suspicious_accounts_flagged": len(suspicious_accounts),
                "fraud_rings_detected": len(fraud_rings),
                "processing_time_seconds": processing_time
            }
        }
        
        # Ensure schema validation before download/response
        validated_data = FraudReportSchema.model_validate(response_data)
        
        return JSONResponse(content=validated_data.model_dump())

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
