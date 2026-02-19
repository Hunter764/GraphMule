import pandas as pd
import datetime
from datetime import timedelta

def generate_test_data():
    transactions = []
    base_time = datetime.datetime(2026, 1, 1, 12, 0, 0)
    tx_id = 1

    def add_tx(sender, receiver, amount, hours_offset=0):
        nonlocal tx_id
        t = base_time + timedelta(hours=hours_offset)
        transactions.append({
            "transaction_id": f"TX_{tx_id:05d}",
            "sender_id": sender,
            "receiver_id": receiver,
            "amount": amount,
            "timestamp": t.isoformat()
        })
        tx_id += 1

    # 1. Genuine Random Transactions
    for i in range(50):
        add_tx(f"GEN_{i}", f"GEN_{i+50}", 150.0, i)

    # 2. FP Trap: Legitimate Merchant (Many in, zero out)
    for i in range(50):
        add_tx(f"BUYER_{i}", "MERCHANT_X", 35.0, i*0.5)

    # 3. FP Trap: Legitimate Payroll (Many out, zero in)
    for i in range(50):
        add_tx("PAYROLL_CORP", f"EMP_{i}", 3500.0, i*0.1)

    # 4. Ring 1: Cycle Length 3
    add_tx("RING1_A", "RING1_B", 5000.0, 1)
    add_tx("RING1_B", "RING1_C", 5000.0, 2)
    add_tx("RING1_C", "RING1_A", 5000.0, 3)

    # 5. Ring 2: Cycle Length 5
    add_tx("RING2_A", "RING2_B", 2000.0, 10)
    add_tx("RING2_B", "RING2_C", 2000.0, 11)
    add_tx("RING2_C", "RING2_D", 2000.0, 12)
    add_tx("RING2_D", "RING2_E", 2000.0, 13)
    add_tx("RING2_E", "RING2_A", 2000.0, 14)

    # 6. Smurfing Fan-In (12 small deposits in 10 hours, then one big hop out)
    # The aggregator is SMURF_AGG. It receives 12 tx and sends 1.
    for i in range(12):
        add_tx(f"SMURF_IN_{i}", "SMURF_AGG", 900.0, i)
    add_tx("SMURF_AGG", "OFFSHORE_1", 10000.0, 15)

    # 7. Smurfing Fan-Out (1 big deposit in, 12 small dispersed out in 10 hours)
    add_tx("SHADY_CORP", "SMURF_DISP", 10000.0, 20)
    for i in range(12):
        add_tx("SMURF_DISP", f"SMURF_OUT_{i}", 800.0, 21 + i)

    # 8. Layered Shell Networks (Chain of 4 hops, intermediaries SH2 and SH3 have degree 2)
    # SOURCE -> SH1 -> SH2 -> SH3 -> SH4 -> DEST
    # We want intermediate accounts to have EXACTLY 2-3 total transactions.
    # SH2 receives 1, sends 1 (degree 2)
    # SH3 receives 1, sends 1 (degree 2)
    add_tx("SHELL_SOURCE", "SHELL_A", 50000.0, 30)
    add_tx("SHELL_A", "SHELL_B", 50000.0, 31)
    add_tx("SHELL_B", "SHELL_C", 50000.0, 32)
    add_tx("SHELL_C", "SHELL_DEST", 50000.0, 33)

    # Write to CSV
    df = pd.DataFrame(transactions)
    df.to_csv("test_data.csv", index=False)
    print(f"Generated test_data.csv with {len(df)} rows.")

if __name__ == "__main__":
    generate_test_data()
