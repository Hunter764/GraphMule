# GraphMule Presentation Slides

**Instructions:** These slides are designed to be paired directly with your existing `Presentation_Script.md`. You can build these slides using PowerPoint, Google Slides, or Canva. 

---

## Slide 1: Title Slide
*(Visuals: IIT Guwahati logo, clean minimalist background)*

**GraphMule: Financial Crime Detection Engine**
*Integrating Network Analysis and Unsupervised Machine Learning*

**Prepared by:** [Your Name]
**Programme:** BSc (Hons) Data Science and AI, IIT Guwahati
**Term Project Presentation**

---

## Slide 2: Introduction
*(Visuals: Professional headshot or a sleek icon representing 'Data Science')*

**Introduction**
* **Programme:** BSc Data Science and AI Degree
* **Project Focus:** Advanced network analysis to detect complex financial fraud.
* **Goal:** Moving beyond simple rules to intelligent, data-driven detection.

---

## Slide 3: The Problem
*(Visuals: Diagram showing 'Smurfing' or a network of bad actors compared to a normal transaction loop)*

**The Challenge of Modern Financial Crime**
* **Traditional Systems Fail:** Standard threshold rules (e.g., >$10k) are easily bypassed.
* **Complex Techniques:**
  * **Smurfing:** Breaking large sums into micro-transactions via burner accounts.
  * **Money Muling:** Rapidly moving funds in closed loops to hide the source.
* **The Solution:** Model the ledger as a mathematical network graph to spot unnatural topologies.

---

## Slide 4: Technology Stack
*(Visuals: Logos of the technologies mentioned)*

**Tools & Technologies**
* **Backend & Data Processing:** Python, Pandas, NetworkX
* **Machine Learning:** Scikit-Learn (Isolation Forest)
* **API Layer:** FastAPI
* **Frontend Dashboard:** Next.js, TailwindCSS
* **Visualization:** react-force-graph-2d

---

## Slide 5: The Dataset
*(Visuals: Screenshot of raw CSV features, or a schema diagram showing nodes and edges)*

**The Data Foundation**
* **Dataset:** Custom synthetic transactions mirroring real-world money laundering topologies.
* **Raw Schema:** `sender_id`, `receiver_id`, `amount`, `timestamp`
* **Feature Engineering:**
  * Aggregation of multi-edge transactions
  * Node-level metrics: In-degree, out-degree, total sent/received volumes

---

## Slide 6: Architecture & Implementation
*(Visuals: Flowchart showing Data Ingestion -> NetworkX Graph -> ML/Rule Processing -> API -> UI)*

**Core Implementation**
* **Network Graph Construction:** Converting tabular ledgers into NetworkX `DiGraph` structures.
* **Mathematical Detectors:** Detecting fan-in, fan-out, and precise circular flows.
* **Unsupervised Machine Learning:** 
  * Applying `Isolation Forest` models
  * Learning baseline network behavior to mathematically isolate abnormal accounts.
* **Cumulative Risk Scoring:** Fusing topological flags with ML anomaly scores up to a 99% risk limit.

---

## Slide 7: Live System Results
*(Visuals: High-quality screenshot of the GraphMule web interface showing the 2D force graph with a flagged red cluster)*

**Automated Threat Detection**
* **Visual Isolation:** Rendered physics-based network graphs for instant investigator insight.
* **Cluster Identification:** Automatically isolating high-risk 'layered shell' networks.
* **Hub Discovery:** Flagging nodes with abnormal transaction velocities and degree ratios.

---

## Slide 8: Evaluation Metrics
*(Visuals: Bar chart showing high precision/low false positive rate, or an anomaly distribution plot)*

**Performance Evaluation**
* **Primary Metrics:** Anomaly isolation capability and risk score accuracy.
* **Results:** 
  * High precision in identifying known smurfing and muling nodes.
  * Maintained exceptionally low false positive rates.
* **Conclusion:** Fusing rigid graph topological rules with statistical anomaly detection (Isolation Forest) outperforms singular models.

---

## Slide 9: Conclusion
*(Visuals: 'Thank You' text next to your contact info/GitHub repo link)*

**Conclusion & Future Work**
* **Impact:** Revolutionizing fraud detection through interconnected, graph-driven AI.
* **Key Takeaway:** Connected network data yields significantly stronger predictive insights than isolated point data.
* **Next Steps:** Preparing architecture for Graph Neural Network (GNN) integration for deep learning capabilities.

**Thank You!**
*(Q&A)*
