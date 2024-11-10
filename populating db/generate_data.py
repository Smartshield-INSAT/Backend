import csv
import requests
import random
import time

# Define the server URL
# url = "http://192.168.100.92:3000/api/data"
url = "http://localhost:3000/api/data"

servers = ['84339aa2-d58f-4797-96ad-4beca64fe806', '94480cfd-2055-4d66-ba32-0e2a9efe7c43', 'e77dd3e5-7544-4997-8dd4-b540c0b643f1', '08632ad0-1f63-41a6-b4f4-60e3d53c0124', '5d9b7054-d86e-4f26-a0b7-f6636f35de69', '45ccea8e-d6c1-4b5c-bd40-2089ecd12386', 'a4772d3d-fe7f-40a9-94ff-78af454cfc7c', '01400a3f-933f-44e0-ae22-13f5d687e1df', 'c05d06c7-7478-4e70-b6e2-5e58596914f8', '18f14276-1c0a-46e9-b7e6-d54f4779eca5']

def generate_random_sever():
    r = random.random()
    if  r < 0.02:
        return servers[-1]
    if  r < 0.12:
        return servers[-2]
    if  r < 0.50:
        return servers[0]
    if r < 0.8:
        return servers[1]
    if r < 0.9:
        return servers[2]
    
    return random.choice(servers[3:-3:])

def generate_random_ip():
    """Generate a random IP across multiple private IP ranges."""
    ip_type = random.choice(['192', '172'])
    
    if ip_type == '192':
        # 192.168.x.x range
        return f"192.168.{random.randint(130, 200)}.{random.randint(70, 130)}"
    else:
        # 172.16.x.x to 172.31.x.x range
        return f"172.{random.randint(16, 31)}.{random.randint(100, 200)}.{random.randint(100, 200)}"

def random_annotation():
    
    r = random.random()
    if  r < 0.70:
        return "BENIGN"
    if  r < 0.82:
        return "Generic"
    if  r < 0.9:
        return "Exploits"
    if  r < 0.97:
        return "Fuzzers"
    
    threats = [
        "Exploits", "Generic", "Fuzzers", "DoS", "Reconnaissance" 
    ]
    return random.choice(threats)

i = 0
# Read CSV, format each row to JSON, and send as POST request
with open("data.csv", mode="r") as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        # Randomize the IP
        row["ip"] = generate_random_ip()
        
        i += 1
        if( i % 200 == 0):
            time.sleep(60)
        
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
