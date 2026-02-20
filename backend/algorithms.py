import networkx as nx
import pandas as pd
from datetime import timedelta

def deduplicate_rings(rings):
    seen = set()
    unique_rings = []
    for r in rings:
        r_set = frozenset(r)
        if r_set not in seen:
            seen.add(r_set)
            unique_rings.append(r)
    return unique_rings

def detect_cycles(G: nx.DiGraph, min_len=3, max_len=5):
    cycles = []
    try:
        raw_cycles = list(nx.simple_cycles(G))
        for cycle in raw_cycles:
            if min_len <= len(cycle) <= max_len:
                cycles.append(cycle)
    except Exception as e:
        pass
    return deduplicate_rings(cycles)

# TUNED FOR DEMO: Lowered threshold from 6 to 4, increased time window to 7 days
def detect_smurfing(df: pd.DataFrame, threshold=4): 
    fan_in_rings = []
    fan_out_rings = []
    
    total_sent = df.groupby('sender_id')['amount'].sum()
    total_received = df.groupby('receiver_id')['amount'].sum()
    
    for receiver, group in df.groupby('receiver_id'):
        if group['sender_id'].nunique() >= threshold:
            time_diff = group['timestamp'].max() - group['timestamp'].min()
            # Relaxed from 72 hours to 7 days (168 hours) to catch slower smurfs
            if time_diff <= timedelta(days=7): 
                if total_sent.get(receiver, 0) > 0: 
                    members = [receiver] + group['sender_id'].unique().tolist()
                    fan_in_rings.append(members)
                
    for sender, group in df.groupby('sender_id'):
        if group['receiver_id'].nunique() >= threshold:
            time_diff = group['timestamp'].max() - group['timestamp'].min()
            if time_diff <= timedelta(days=7):
                if total_received.get(sender, 0) > 0: 
                    members = [sender] + group['receiver_id'].unique().tolist()
                    fan_out_rings.append(members)
                
    return {
        "fan_in": deduplicate_rings(fan_in_rings), 
        "fan_out": deduplicate_rings(fan_out_rings)
    }

def detect_shell_accounts(G: nx.DiGraph, df: pd.DataFrame):
    out_counts = df['sender_id'].value_counts()
    in_counts = df['receiver_id'].value_counts()
    
    total_sent = df.groupby('sender_id')['amount'].sum()
    total_received = df.groupby('receiver_id')['amount'].sum()
    
    active_both = set(out_counts.index).intersection(set(in_counts.index))
    shell_candidates = set()
    
    for acc in active_both:
        total_tx = out_counts.get(acc, 0) + in_counts.get(acc, 0)
        
        # TUNED FOR DEMO: Allow shells to have up to 6 transactions
        if 2 <= total_tx <= 6: 
            in_amt = total_received.get(acc, 0)
            out_amt = total_sent.get(acc, 0)
            
            if out_amt > 0:
                ratio = in_amt / out_amt
                # TUNED FOR DEMO: Massively relaxed ratio (0.40 to 2.50)
                if 0.40 <= ratio <= 2.50: 
                    shell_candidates.add(acc)
            
    shell_rings = []
    
    for node in G.nodes():
        if node not in shell_candidates:
            for hop1 in G.successors(node):
                if hop1 in shell_candidates:
                    for hop2 in G.successors(hop1):
                        if hop2 in shell_candidates:
                            for end_node in G.successors(hop2):
                                t1 = G.edges[node, hop1]['timestamp']
                                t2 = G.edges[hop1, hop2]['timestamp']
                                t3 = G.edges[hop2, end_node]['timestamp']
                                
                                if t1 <= t2 <= t3:
                                    # TUNED FOR DEMO: Velocity allowed to take up to 5 days
                                    if (t3 - t1) <= timedelta(days=5): 
                                        members = [node, hop1, hop2, end_node]
                                        shell_rings.append(members)
                                
    return deduplicate_rings(shell_rings)

def detect_bursts(df: pd.DataFrame):
    burst_accounts = set()
    for sender, group in df.groupby('sender_id'):
        times = group['timestamp'].sort_values().tolist()
        for i in range(len(times) - 2): 
            # TUNED FOR DEMO: A burst is now 3 tx in 12 hours (instead of 1 hour)
            if (times[i+2] - times[i]) <= timedelta(hours=12):
                burst_accounts.add(sender)
                break
    return list(burst_accounts)

def detect_degree_anomalies(G: nx.DiGraph):
    if len(G.nodes) == 0: return []
    
    avg_in_degree = sum(dict(G.in_degree()).values()) / len(G.nodes)
    anomaly_accounts = []
    
    for node, degree in G.in_degree():
        # TUNED FOR DEMO: Lowered the anomaly multiplier from 5x to 3x average
        if degree > (avg_in_degree * 3) and degree > 3:
            anomaly_accounts.append(node)
            
    return anomaly_accounts

