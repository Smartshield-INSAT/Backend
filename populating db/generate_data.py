import csv
import requests
import random

# Define the server URL
url = "http://192.168.100.92:3000/api/data"

def generate_random_sever():
    return random.choice(['32ad398b-8db3-4ed2-b5e0-5d3fdffaee6d', 'ef3eeeb4-526e-4feb-a7bc-77c1521e1a02', '1f910631-3e72-4f7c-904e-69b20eb10021', '6651f44b-5e3c-42ee-b62a-421ba87f98da', '4d746e76-1a48-4ca8-b26a-50f7da5623b6', '35cf0543-f512-4586-b1c0-623a5d4a03b4', '9f3cc81f-71d0-4de9-983d-29e0d316572e', '26005916-cc75-437b-a98c-7c64c72194c6', '9d17f7a8-d505-4c8e-a58a-23766426e3ea', '927152ed-4847-44fe-8315-264539b32e23', '4be2d2bd-63e4-410c-8c84-0f544a1713b5', '71cf8ac2-c2b6-427e-a2e0-241a8a78c4ed', 'a1a41f15-a553-4416-9e68-03af354925e4', 'e53a5f35-4c02-4ea3-9cde-d9263ae48688','f7f6d8f4-d0e1-4856-94fe-901bad5bbfca', '9312b26a-15b2-49ee-a25a-7c179df4292a', 'c5cb2db3-8a56-4549-9f06-f1c91add8cdf', '67ff0a35-561b-499b-8fbc-76a509d3cd79', 'ad6d0c09-ab21-4a7e-a147-ce24276c4cb6', '5a63844a-4d5d-408c-b5b2-6b157dbf0acd', 'bea0d7dd-bbe5-4fc4-8e38-f3635650799d', 'fa9e7e35-7174-4a2a-a42a-f02e1bed6aba', 'a0dcebcf-d3ea-43dc-a36e-d5ca27c90c44', 'fef9d2aa-ecad-47b5-88ae-28a6824bbd6d', '598902fd-0f6f-4fef-a8f2-2352c007e958', 'cabf11d5-7346-4693-88a4-a4becdfaa65a', '0d4c521b-280f-4ec8-bdf0-f8f31c8437c6', '2520f264-5e13-4a29-b630-373de7da9481','27037643-3fd9-4ac2-913d-d477f28abc5e', '8e642b85-9aaa-4dd8-811c-72f7e1148cea', '9858429f-0bd5-41a0-bc7b-1a6e02978a00', 'dfddf59f-5242-40f2-b101-523398564178', '21c54a08-b054-4861-970b-ea772319e3a4', '81b54fca-4f76-49d8-ba0f-b5fdb2455ac1', '42adcf4a-52c3-4d48-86ed-0a97091940be', '78583fa8-2862-4931-8839-38f826b88b27', '9d69ca1f-5575-4efe-9486-ba9ccdb66499', '2f0cfb9d-3c17-4f39-bf1f-643a0e2b3e87', '1642147c-9e16-466a-86f1-c9295d776752', '23b21786-3803-495f-9c2b-8db11ff589df', 'f88cc944-0680-4340-97ee-9a8acb3c1e8f', 'e6531c47-6eb9-4750-8f2d-d851ee266e07'])
        
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
    """Randomly choose 'BENIGN' with 94% probability, otherwise choose a known threat type."""
    # 94% probability for "BENIGN"
    if random.random() < 0.94:
        return "BENIGN"
    
    # The remaining 6% is split equally among other annotations
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
