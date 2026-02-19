import networkx as nx
import pandas as pd

def detect_cycles(G: nx.DiGraph, min_len=3, max_len=5):
    """
    Detects circular money flow of length 3-5.
    """
    cycles = []
    try:
        raw_cycles = list(nx.simple_cycles(G))
        for cycle in raw_cycles:
            if min_len <= len(cycle) <= max_len:
                cycles.append(cycle)
    except Exception as e:
        print(f"Error in cycle detection: {e}")
    return cycles

def detect_smurfing(df: pd.DataFrame, time_col='timestamp', threshold=10, window_hours=72):
    """
    Detects Fan-In and Fan-Out patterns within a rolling time window.
    Applies FP control for legitimate high-volume merchants and payroll.
    """
    df = df.copy()
    df[time_col] = pd.to_datetime(df[time_col])
    
    in_degree = df.groupby('receiver_id').size()
    out_degree = df.groupby('sender_id').size()
    
    fan_in = set()
    fan_out = set()
    
    df_sorted = df.sort_values(by=time_col)
    
    # Fan-in (Aggregators)
    receivers = df_sorted.set_index(time_col).groupby('receiver_id')
    for node, group in receivers:
        rolling_count = group.rolling(f'{window_hours}h').count()['transaction_id']
        if rolling_count.max() >= threshold:
            out_d = out_degree.get(node, 0)
            in_d = in_degree.get(node, 0)
            # FP Control: Merchant (high in, low out)
            if in_d >= threshold and out_d <= 2:
                continue
            if in_d > 30 and out_d < 5:
                continue
            fan_in.add(node)
                
    # Fan-out (Dispersers)
    senders = df_sorted.set_index(time_col).groupby('sender_id')
    for node, group in senders:
        rolling_count = group.rolling(f'{window_hours}h').count()['transaction_id']
        if rolling_count.max() >= threshold:
            out_d = out_degree.get(node, 0)
            in_d = in_degree.get(node, 0)
            # FP Control: Payroll (high out, low in)
            if out_d >= threshold and in_d <= 2:
                continue
            if out_d > 30 and in_d < 5:
                continue
            fan_out.add(node)
                
    return {"fan_in": list(fan_in), "fan_out": list(fan_out)}

def detect_shell_accounts(G: nx.DiGraph):
    """
    Detects Layered Shell Networks.
    Look for chains of 3+ hops (A->B->C->D) where intermediate accounts (B, C) 
    have only 2-3 total transactions.
    """
    shell_nodes = set()
    total_degree = {n: G.degree(n) for n in G.nodes()}
    
    # 1. Identify all potential shell candidates (degree 2 or 3, acts as pass-through)
    candidates = set()
    for n, d in total_degree.items():
        if 2 <= d <= 3 and G.in_degree(n) > 0 and G.out_degree(n) > 0:
            candidates.add(n)
            
    # 2. Find if candidates connect to other candidates (forming a chain of shells)
    for u in candidates:
        for v in G.successors(u):
            if v in candidates:
                shell_nodes.add(u)
                shell_nodes.add(v)
                
    return list(shell_nodes)
