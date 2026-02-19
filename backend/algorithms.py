import networkx as nx
import pandas as pd
from datetime import timedelta

def detect_cycles(G: nx.DiGraph, min_len=3, max_len=5):
    """Detects circular money flow of length 3-5."""
    cycles = []
    try:
        raw_cycles = list(nx.simple_cycles(G))
        for cycle in raw_cycles:
            if min_len <= len(cycle) <= max_len:
                cycles.append(cycle)
    except Exception as e:
        print(f"Error in cycle detection: {e}")
    return cycles

def detect_smurfing(df: pd.DataFrame, threshold=10):
    """Detects Fan-In and Fan-Out rings strictly within a 72-hour window."""
    fan_in_rings = []
    fan_out_rings = []
    
    # Fan-In (Group by receiver)
    for receiver, group in df.groupby('receiver_id'):
        if group['sender_id'].nunique() >= threshold:
            time_diff = group['timestamp'].max() - group['timestamp'].min()
            if time_diff <= timedelta(hours=72):
                members = [receiver] + group['sender_id'].unique().tolist()
                fan_in_rings.append(members)
                
    # Fan-Out (Group by sender)
    for sender, group in df.groupby('sender_id'):
        if group['receiver_id'].nunique() >= threshold:
            time_diff = group['timestamp'].max() - group['timestamp'].min()
            if time_diff <= timedelta(hours=72):
                members = [sender] + group['receiver_id'].unique().tolist()
                fan_out_rings.append(members)
                
    return {"fan_in": fan_in_rings, "fan_out": fan_out_rings}

def detect_shell_accounts(G: nx.DiGraph, df: pd.DataFrame):
    """Detects 3-hop layered shell network rings."""
    out_counts = df['sender_id'].value_counts()
    in_counts = df['receiver_id'].value_counts()
    total_tx = out_counts.add(in_counts, fill_value=0)
    
    shell_candidates = set(total_tx[(total_tx >= 2) & (total_tx <= 3)].index)
    shell_rings = []
    
    for node in G.nodes():
        if node not in shell_candidates:
            for hop1 in G.successors(node):
                if hop1 in shell_candidates:
                    for hop2 in G.successors(hop1):
                        if hop2 in shell_candidates:
                            for end_node in G.successors(hop2):
                                members = [node, hop1, hop2, end_node]
                                shell_rings.append(members)
                                
    return shell_rings
