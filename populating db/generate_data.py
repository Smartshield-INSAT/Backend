import csv
import requests
import random

# Define the server URL
url = "http://192.168.100.92:3000/api/data"

servers = ['c7d79d06-45ab-4187-9a9f-d323b2101e4f', '215140be-85eb-4b41-810c-d587283b6d48', '139aeb07-7864-4606-abf7-9b3cdefb3561', '7d79cb60-8ac4-490a-b7cd-f21a23df3ffc', '30e0e707-a014-4554-b37b-5b138c946124', '9c2d147f-9f7d-40a4-82b0-e7713e114496', 'a8c56f0a-96da-48f1-8d31-df8a32756bdc', '2a7323cb-f893-498e-ac0e-842f61a8a556', '6cba3822-a2f9-4384-bdfb-7687796e32d4', '19815580-f1a9-4e71-9f40-601199eaf598']


def generate_random_sever():
    return random.choice(servers)

def generate_random_ip():
    """Generate a random IP across multiple private IP ranges."""
    ip_type = random.choice(['192', '10', '172'])
    
    if ip_type == '192':
        # 192.168.x.x range
        return f"192.168.{random.randint(0, 255)}.{random.randint(1, 254)}"
    elif ip_type == '10':
        # 10.x.x.x range
        return f"10.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"
    else:
        # 172.16.x.x to 172.31.x.x range
        return f"172.{random.randint(16, 31)}.{random.randint(0, 255)}.{random.randint(1, 254)}"

def random_annotation():
    
    
    if random.random() < 0.70:
        return "BENIGN"
    
    if random.random() < 0.80:
        return "malware"
    
    if random.random() < 0.92:
        return "SQL injection"
    if random.random() < 0.98:
        return "XSS injection"
    
    threats = [
        "DoS attack",
        "phishing attempt",
        "malware",
        "port scanning",
        "SQL injection",
        "XSS attack",
        "brute force attack",
        "DDoS attack",
        "MITM attack",
        "fuzzing",
        "XML injection",
        "HTML injection"
    ]
    return random.choice(threats)

# Read CSV, format each row to JSON, and send as POST request
with open("data.csv", mode="r") as file:
    csv_reader = csv.DictReader(file)
    
    for row in csv_reader:
        # Randomize the IP
        row["ip"] = generate_random_ip()
        
        # Format each row according to the available fields in the CSV, adding default values for missing fields
        data = {
            "dur": float(row["dur"]),
            "ip": row["ip"],
            "proto": row["proto"],
            "service": row["service"],
            "state": row["state"],
            "spkts": float(row["spkts"]),
            "dpkts": float(row["dpkts"]),
            "sbytes": float(row["sbytes"]),
            "dbytes": float(row["dbytes"]),
            "sload": float(row["sload"]),
            "dload": float(row["dload"]),
            "sloss": float(row["sloss"]),
            "dloss": float(row["dloss"]),
            "sinpkt": float(row["sinpkt"]),
            "dinpkt": float(row["dinpkt"]),
            "tcprtt": float(row["tcprtt"]),
            "smean": float(row["smean"]),
            "transDepth": float(row["trans_depth"]),
            "ctSrcDportLtm": float(row["ct_src_dport_ltm"]),
            "isFtpLogin": float(row["is_ftp_login"]),
            "ctFlwHttpMthd": float(row["ct_flw_http_mthd"]),
            "speedOfOperationsToSpeedOfDataBytes": float(row.get("speedOfOperationsToSpeedOfDataBytes", 1.0)),  # Default value
            "timeForASingleProcess": float(row.get("timeForASingleProcess", 0.5)),  # Default value
            "ratioOfDataFlow": float(row.get("ratioOfDataFlow", 1.0)),  # Default value
            "ratioOfPacketFlow": float(row.get("ratioOfPacketFlow", 0.8)),  # Default value
            "totalPageErrors": float(row.get("totalPageErrors", 0)),  # Default value
            "networkUsage": float(row.get("networkUsage", 50.0)),  # Default value
            "networkActivityRate": float(row.get("networkActivityRate", 0.7)),  # Default value
            "annotation": random_annotation(),  # Choose a random annotation
            "serverId": generate_random_sever()  # Use the same serverId for all
        }

        # Send POST request
        response = requests.post(url, json=data)
        
        # Print the response status for each row
        if response.ok:
            print(f"Successfully sent data: {data}")
        else:
            print(f"Failed to send data: {data}")
            print(f"Response Code: {response.status_code}, Message: {response.text}")
