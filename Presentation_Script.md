# GraphMule: Financial Crime Detection Engine (IIT Guwahati Term Project Presentation)

**Target Duration:** 8 to 10 minutes
**Pacing:** Speak clearly, pause at commas and full stops to let the technical details sink in.

---

### **1. Start with Your Title Slide (0:00 - 0:45)**

*(Visuals: Display your title slide with the IIT Guwahati logo, project title "GraphMule: Financial Crime Detection Engine," and your details clearly visible.)*

**Script:**
"Hello everyone, and welcome to my presentation. The project I am showcasing today is called **GraphMule**—it is a next-generation, graph-based financial crime detection engine. 

As you can see on the screen, this project was developed as part of my coursework for the BSc Honours in Data Science and AI at IIT Guwahati. Thank you for taking the time to review my work today."

---

### **2. Briefly Introduce Yourself (0:45 - 1:15)**

*(Visuals: Switch to fullscreen camera to show your face. Smile and maintain eye contact with the lens.)*

**Script:**
"Let me briefly introduce myself. My name is [Your Name], and I am a student in the online BSc Data Science and AI Degree Programme at IIT Guwahati. 

Today, I will be presenting my Term Project, which focuses on integrating advanced network analysis and unsupervised machine learning to detect complex financial fraud. Let's dive right into the core problem this project aims to solve."

---

### **3. Describe the Problem You Worked On (1:15 - 2:30)**

*(Visuals: Show a slide or an initial part of your GraphMule dashboard explaining the problem. A diagram of money laundering or smurfing is ideal here.)*

**Script:**
"In modern digital finance, money laundering has become incredibly sophisticated. Traditional, rule-based systems—like flagging any transaction over ten thousand dollars—are failing. Why? Because bad actors use techniques like 'smurfing,' where they break large sums into dozens of tiny micro-transactions sent across multiple burner accounts, and 'money muling,' where funds move rapidly in closed loops to hide their original source. 

If we only look at isolated transactions, these actions look like normal, everyday payments. The problem I wanted to solve was: *How do we catch coordinated bad actors who structure their transactions to fly under the radar?*

The answer lies in **relationships**. Instead of just looking at transactions in a vacuum, GraphMule models the entire financial ledger as a mathematical graph—where accounts are nodes and transactions are edges. This allows us to see the bigger picture and spot unnatural topological patterns that humans or simple rules would completely miss."

---

### **4. Mention the Tools and Technologies You Used (2:30 - 3:30)**

*(Visuals: Display a slide summarizing your Tech Stack: Python, Pandas, NetworkX, Scikit-Learn, FastAPI, Next.js, etc.)*

**Script:**
"To build this intelligence engine, I used a modern data science and full-stack technology stack. 

For the data processing and machine learning backend, I primarily used **Python**. I relied on **Pandas** for rigorous data wrangling and **NetworkX** to build and traverse the directed graphs. To elevate this from a simple rule-based engine to a data-driven one, I integrated **Scikit-learn**, specifically using the **Isolation Forest** algorithmic approach to conduct unsupervised anomaly detection on the network features. 

On the software engineering side, I wrapped the Python logic in a fast, robust REST API using **FastAPI**. For the frontend, I wanted the insights to be easily interpretable by a fraud investigator, so I built a premium dashboard using **Next.js**, styled with **TailwindCSS**, and leveraged **react-force-graph-2d** to render highly interactive, physics-based network visualizations."

---

### **5. Show Your Dataset (3:30 - 4:45)**

*(Visuals: Share your screen to show a raw CSV of your dataset, a Jupyter notebook snippet of the `df.head()`, or the dashboard modal showing the data schema.)*

**Script:**
"Let's talk about the data that powers this engine. 

Because real-world banking ledgers are strictly confidential, I utilized a synthetic financial transaction dataset custom-tailored to mimic actual money laundering topologies. 

The dataset consists of thousands of transaction records structured with a few key columns: a `sender_id`, a `receiver_id`, the `amount` transferred, and a precise `timestamp`. 

Before feeding this data to the machine learning algorithms, significant preprocessing was required. I aggregated multi-edge transactions—pooling multiple payments between the same individuals—to clear the noise. I then extracted numerical features for every node in the graph, such as their total in-degree, out-degree, total money sent, and total money received. These engineered features are what allow our models to identify the difference between a popular business and a suspicious shell account."

---

### **6. Walk Through Your Code (4:45 - 7:00)**

*(Visuals: Open VS Code or your IDE. Show `main.py` and `algorithms.py`, pointing out key segments with your mouse.)*

**Script:**
"I’ll now take you through the most crucial parts of the codebase. 

Here in our backend, you can see how we handle incoming ledgers. Once the CSV is read by Pandas, we use this code block to convert the tabular dataframe into a `NetworkX Directed Graph` (`DiGraph`). 

Let's look at `algorithms.py`. Initially, I built a set of mathematical detectors. For instance, here is the `detect_smurfing` function. It looks for ‘fan-in’ and 'fan-out' structures over a specific time window—say, an account receiving 50 micro-transactions within seven days and immediately forwarding it. And right above it, you can see the cycle detection, finding precise circular flows meant to obfuscate funds.

However, the real transition in this project was moving toward true Machine Learning. In `algorithms.py`, we extract those numerical features—in-degree, out-degree, and total transaction volumes—into a feature matrix. We then feed this matrix directly into an unsupervised `Isolation Forest` model. The algorithm learns the baseline behavior of the network without any human rules, and mathematically flags the top fraction of most abnormal accounts.

Finally, in `main.py`, we take all these topological flags and anomaly scores and fuse them together. Here we have a cumulative scoring function: the more anomalous patterns an account participates in, the higher its final risk profile, capping at 99%. This data is then formatted as a structured JSON response and sent to the frontend."

---

### **7. Show Your Outputs and Results (7:00 - 8:30)**

*(Visuals: Switch to the live GraphMule web application. Upload data and show the physics-based graph rendering. Manipulate the graph with your mouse.)*

**Script:**
"Now for the exciting part: seeing the results live. I will go ahead and run an analysis on our test dataset. 

*(Wait for the UI to load the graph)*

As you can see, the engine successfully analyzed the ledger and rendered this interactive 2D force graph. Each dot is an account, and the connections are financial flows. Most importantly, GraphMule has automatically isolated the bad actors for us. 

Look at this cluster here in red—it has been tagged with a 95% risk score. If we hover over it, we can see it represents a 'layered shell' network. What would take a human compliance team days to trace through Excel spreadsheets is visually isolated in seconds. 

Notice how certain nodes act as extreme hubs? These were flagged by our anomaly detection layers because their degree ratio and transaction velocity are mathematically abnormal compared to 99% of the other nodes in the network."

---

### **8. Discuss Your Evaluation Metrics (8:30 - 9:15)**

*(Visuals: Show a slide with performance metrics, a confusion matrix if available, or point to the risk score breakdown in the UI.)*

**Script:**
"To evaluate the project's success, we can’t just rely on visuals; we need metrics. 

Because financial crime detection often falls into unsupervised learning—meaning we don't always have a perfectly labeled answer key—the performance of our integration is primarily evaluated on anomaly isolation and risk score accuracy. 

By applying our approach to the synthetic dataset where the 'smurfing' and 'muling' nodes were secretly known in advance, the engine achieved incredibly high precision. We were able to flag the primary bad actors without suffering from high false positive rates—meaning we aren’t falsely flagging normal business owners. Combining rigid graph topological rules with the statistical anomaly detection (Isolation Forest) proved far more robust than using either method alone."

---

### **9. Wrap Up (9:15 - 10:00)**

*(Visuals: Bring your face back on camera fullscreen, or show a final 'Thank You' slide.)*

**Script:**
"In conclusion, GraphMule demonstrates how transitioning from simplistic rule-based financial tracking to intelligent, graph-driven AI can revolutionize fraud detection. We successfully built a full-stack engine that not only processes raw ledgers but visually explains complex money laundering patterns.

My biggest takeaway from this experience was deeply understanding how interconnected data yields much stronger predictive insights than isolated data points. And looking ahead, I am excited to prepare this architecture to ingest full Graph Neural Networks (GNNs) for even more advanced deep learning integration.

Thank you so much to my instructors and peers at IIT Guwahati for your guidance throughout this module. I hope you enjoyed learning about GraphMule."
