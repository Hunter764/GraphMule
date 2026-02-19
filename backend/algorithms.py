import networkx as nx

def detect_cycles(G: nx.DiGraph, min_len=3, max_len=5):
    """
    Detects circular money flow of length 3-5.
    Returns a list of cycles (list of nodes).
    """
    cycles = []
    try:
        # simple_cycles is computationally expensive for large graphs, 
        # but for <10k nodes/edges it should be manageable within 30s 
        # provided the graph isn't fully connected.
        # We can optimize by using limit or Johnson's algorithm if needed.
        raw_cycles = nx.simple_cycles(G)
        
        for cycle in raw_cycles:
            if min_len <= len(cycle) <= max_len:
                cycles.append(cycle)
            # Optimization: break if too many cycles found? 
            # For now, let's assume the challenge dataset is manageable.
            
    except Exception as e:
        print(f"Error in cycle detection: {e}")
        
    return cycles

def detect_smurfing(G: nx.DiGraph, threshold=10):
    """
    Detects Fan-In and Fan-Out patterns.
    Fan-In: Many sends to one (In-Degree >= threshold)
    Fan-Out: One sends to many (Out-Degree >= threshold)
    Returns a dict with 'fan_in' and 'fan_out' lists.
    """
    fan_in = [n for n, d in G.in_degree() if d >= threshold]
    fan_out = [n for n, d in G.out_degree() if d >= threshold]
    
    return {"fan_in": fan_in, "fan_out": fan_out}

def detect_shell_accounts(G: nx.DiGraph):
    """
    Detects Layered Shell Networks.
    Intermediary nodes with low transaction counts (degree 2-3) that act as bridges.
    """
    shell_accounts = []
    for node in G.nodes():
        degree = G.degree(node)
        if 2 <= degree <= 3:
            # Must be an intermediate node (receive and send)
            if G.in_degree(node) > 0 and G.out_degree(node) > 0:
                shell_accounts.append(node)
                
    return shell_accounts

def calculate_suspicion_score(node, G, rings, smurfing, shell_accounts):
    """
    Calculates a suspicion score (0-100) based on involvement in patterns.
    """
    score = 0
    patterns = []
    ring_ids = []

    # Check Ring Involvement
    in_ring = False
    for i, ring in enumerate(rings):
        if node in ring:
            score += 50
            patterns.append(f"cycle_length_{len(ring)}")
            ring_ids.append(f"RING_{i+1:03d}")
            in_ring = True
    
    # Check Smurfing
    if node in smurfing['fan_in']:
        score += 30
        patterns.append("high_fan_in")
    if node in smurfing['fan_out']:
        score += 30
        patterns.append("high_fan_out")
        
    # Check Shell
    if node in shell_accounts:
        score += 20
        patterns.append("shell_account")
        
    score = min(score, 100)
    
    return {
        "score": score,
        "patterns": list(set(patterns)), # unique patterns
        "ring_ids": list(set(ring_ids))
    }
