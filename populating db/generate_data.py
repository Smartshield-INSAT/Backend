import csv
import requests
import random
import time
import math

# Define the server URL
# url = "http://192.168.100.92:3000/api/data"
url = "http://localhost:3000/api/data"

servers = ['5b5603c8-e1c2-4389-a350-9bba60dca0a5', 'f68b76d4-b5b1-447d-8f8e-8efbc55ba0e4', '6b9dedc8-3ee8-48f6-b00d-ffe3c9b39cce', '36b4c5f0-077c-4c14-b5a4-c1bfd78d6dbe', '56c3e502-20e3-4bcb-95b4-feb710f49efa', '5c61e92f-b996-4586-903e-2c98ea7ad04f', 'c3a68a6b-28b9-47bb-b482-ebfc8aad8d64', 'f31f79b3-6d2b-4b32-ba2a-713f20a6bab4', '4ec10a7a-d818-48fb-b294-59e8ab331ea2', 'eb5cab6a-71b0-4e94-9fde-7a7536f541dc']
random.seed(random.random())
 

def gaussian_choice(items, mu=None, sigma=1.0):
    """
    Select an item from a list using weights based on a Gaussian distribution.
    
    Parameters:
    items (list): List of items to choose from
    mu (float): Mean position (defaults to center of list)
    sigma (float): Standard deviation in positions
    
    Returns:
    item: Selected item from the list
    """
    if not items:
        raise ValueError("Items list cannot be empty")
    
    if mu is None:
        mu = (len(items) - 1) / 2
    
    weights = []
    for i in range(len(items)):
        weight = math.exp(-((i - mu) ** 2) / (2 * sigma ** 2))
        weights.append(weight)
    
    total = sum(weights)
    weights = [w/total for w in weights]    
    return random.choices(items, weights=weights, k=1)[0]

def generate_random_sever():
    return gaussian_choice(servers, sigma=random.uniform(0.5, 3.0))

def generate_random_ip():
    """Generate a random IP across multiple private IP ranges."""
    ip_type = random.choice(['192', '172'])
    
    if ip_type == '192':
        # 192.168.x.x range
        return f"192.168.{random.randint(130, 170)}.{random.randint(70, 100)}"
    else:
        # 172.16.x.x to 172.31.x.x range
        return f"172.{random.randint(16, 31)}.{random.randint(100, 130)}.{random.randint(160, 200)}"

def random_annotation():
    threats = ["BENIGN", "Exploits", "Generic", "Fuzzers", "DoS", "Reconnaissance"]
    r = random.random()
    
    # 70% chance for BENIGN
    if r < 0.7:
        return "BENIGN"
        
    # 30% for others
    r = random.random()  # New random number for remaining 30%
    
    if r < 0.42:
        return "Exploits"
    elif r < 0.70:  # 0.42 + 0.28
        return "Fuzzers"
    elif r < 0.83:  # 0.70 + 0.13
        return "DoS"
    elif r < 0.92:  # 0.83 + 0.09
        return "Generic"
    else:
        return "Reconnaissance"

i = 0
# Read CSV, format each row to JSON, and send as POST request
with open("data.csv", mode="r") as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        # Randomize the IP
        row["ip"] = generate_random_ip()
        
        i += 1
        if( i % 20 == 0):
            time.sleep(random.randint(2, 10))
        
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
