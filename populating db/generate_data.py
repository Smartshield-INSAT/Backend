import csv
import requests
import random

# Define the server URL
url = "http://192.168.100.92:3000/api/data"

def generate_random_sever():
    return random.choice(['ec7358c0-1e4f-4b18-8304-b0dcc11c3c12', '5c90c857-21be-4c52-87cf-735152e94862', 'ef7744d8-f8dd-409d-ad09-2b4816034d2e', '8fdd053f-580a-4cfd-b761-20038f3a9ca6', '57ee0420-31ae-4b3e-b6fe-5c8de0dcdfc5', 'ead0d762-bee4-413b-a6a3-da6df386cfb0', '17cbd153-00cc-4017-a338-282beb4ace78', 'bf737521-4a2c-4952-ab1e-7fb432b94346', '6f0c081c-b050-41ae-9340-f32b47500b0d', '950cdf61-50f9-4534-8dac-006121abcc31', '2a5306f2-2949-499b-b45d-6a2a7224d720', '143f59f8-5a90-4781-8299-ec161545e53a', '580fed04-be16-45cf-8620-17e4b789e4fa', '9c0d04de-93d0-4270-bc1f-b6b340dc0242', '7e49b5d9-8018-46aa-b809-225cc1174117', '9d29b440-1186-4976-ada7-1f1c25c1f58e', '64f447f4-df76-4a5a-87ab-4c14711f4a03', '412e4639-5206-4990-8748-68d736834ad2', '7bc356a6-14f7-46fb-a905-c14f71d161b4', '8e1e2ba2-ce6d-438e-85fc-a6fa0ab2c4df', '301df1f7-5c86-4cf0-8790-7f6641a31594', '09004d37-aaf0-4326-abf1-2ceacf266400', '55c3521b-95e6-4dcb-a202-842b840158ae', 'e7f11156-571d-45cc-9708-e471f68df633', '72af8817-54cc-4d32-8854-6ce6a947c4b6', 'cdfdc865-09c0-4204-9a74-25249981ab06', 'e1f23c36-9e9b-483d-aea8-db992fc84e17', '161eb25e-a172-45e6-ab07-5ba133dc433e', 'db83ec78-2b6a-4663-be80-708830b23015', '05f20c7b-f020-4821-82a4-eddf5882bdb7', '54a06091-13d2-46f6-b7bc-e0e1ddd8e98b', '40903561-16ec-4a96-ae53-4f309a803eca', '070acfff-5e13-4494-b26f-7ea1c89ee954', '084e5bbc-7fd2-448c-94ff-2cdb4b731476', 'a582cf45-2f98-4425-b1c9-7577f2b4d522', '0acb332b-0437-4a90-bc58-3707c9dd8c7c', '4bf6fac9-cebc-43b5-815d-5c9199576efd', '18731fb9-a270-42be-b060-deaa363c2a15', '719a1057-28ed-4ab5-8fbe-a7a09ea2ca6d', '9c7454a9-c66c-433c-8ca6-3c38076a37e9', '365fbb56-c55e-413d-841b-e69e7a897b3b', '6e706b64-5f46-4b00-b359-0ef7411a20e3', 'af62336c-b56d-4360-bd0d-0d1c156ca91f', 'eaa69b5e-e6ab-4f63-be5a-f7e5e489ad5c', '6473b2bc-164a-4a3e-bd7a-3cb41c7061c9', '2bc2f38f-ee64-4494-a423-9bb455133d07', '62bd2b83-d7b5-4411-9cf5-55a7c5e6e61e', 'b2ed9d6f-15cd-4c76-b57e-648a340719f9', 'f395b960-cd63-44f1-8228-8f3dc39aed34', '7a0a6c3a-0601-41e9-a776-4bcc14211c94', '9565d56f-f644-437b-bc8c-ba08256fe34f', 'e17c5200-7fd4-490c-a181-90201454b2d7', 'd497e15b-f88b-490c-8a22-26f88943868e', '4c984c4d-6f9b-49e2-bb33-3afe9e4dc9ba', '05e83bbe-1eb6-47bb-bbca-f83f9623e73c', 'c45ac956-46e0-49db-9983-1ed57637c01a', '391a0892-13d7-4a33-a0bd-d19cf60e4e37', '519cc34c-6b3d-4918-88f6-93e4e7c34e93', '34c98312-29bd-4834-b45e-caf25e969156', 'af7639bf-e6a7-4877-9e5d-7fa1e6e39d0f', 'f4cdd819-3185-42e6-85f8-ae95987f1308', '20d26071-0e41-4f75-a616-9d5db38c2bf4', 'b1ffdc34-e106-4435-a6dd-5f622a5a27ee', '3a16e210-5342-40d5-9c9a-64b19813b667', 'c020ebf6-67cd-483a-95a6-5d4da4dd6206', 'e7ac1367-9c7e-4176-aff2-7756492702ea', 'cf0951a2-c459-4e0e-995f-491f76fad530', '3cf9f27f-029f-42c2-9fe8-b5b9bff6e2d2', 'db28f863-b153-4cb9-abd9-5e089f10571c', '5e7d84ad-3cf2-4b91-99c3-3e9e406233b2', '852ae1b2-fd31-4529-8c7a-27068bccae35', '4aaed321-7136-4ee3-8ed9-ae7cb11be383', '32c2fb18-da1a-4968-b81e-3e0f9a8af5c9', 'fa6a9f81-9daa-47be-8952-cf3a6a9571d5', 'd3a548dc-2c85-40c8-882c-67e03c818ad5', 'c9cbcd76-3f18-4093-9134-ced3f13c610e', 'f1bc1f9a-4b45-417e-ae69-a3b8d51e3854', '70b2c5c4-6c60-4950-b4d7-f6c54c1b0cb4', '932402c7-7ff0-4522-a4ea-e3876b4f1a34', '27634bad-01d0-4dae-b8ca-1fa9f3376a35', '18174d7a-76ae-433c-9973-eb4d6530e916', 'd77bfece-8b05-48f1-aa04-76a91d272f51', 'd1fc72f7-29a3-49c8-9365-c69915df8d72', 'ec7ecc0a-cbb7-443a-9a1c-2229f7af0a63', '08a10bc3-7d3a-4de8-98bf-1bd1f765cdff', 'eacb0068-9e88-4f92-82b3-86d7a3156a08', 'c26e8370-fb0b-46b6-8929-84d45829c169', 'a8777a8e-3f6c-4467-b154-69df5658a9ed', '2b533840-3ee5-470b-9fbc-9f938d2d8b6c', '8e287892-f7f8-4687-8eaf-cbfe32babe36', 'c3d82f16-929e-454c-94c3-2e83390adbec', '1af19437-5e63-4df8-89e0-87fbbec92b05', 'e9dbfce7-ce50-46ff-9081-02c771eeb219', '548b17a7-5ca1-4951-9cd7-88ddd1c1b5c8', '0fcd2891-49a6-4b36-9dfd-842ff0a06d37', '2908ea90-54ec-43db-b36b-7fbec34d3086', '9549002c-a8be-4783-9e92-b642f5d33734', '2afe911a-f4e0-4cc2-ab4e-f3981a0ecd8b', '70d04501-32c0-4992-b839-d321ba0fb035', 'a78ec11a-64b4-4737-80ba-7d85af465b77', 'd591d9d8-38e7-478e-996f-e6103dec966e', '4d54c861-653e-43c0-90b6-d41c0adc561e', '75b07d80-1e9c-4072-94d1-95186db59736', 'd30c728b-def3-4023-8dfb-282cfd3bf6cc', '40182ed2-7f86-4303-a64c-25e9079656c2', '83d4d6e3-2213-48b5-898d-268283a97b9d', '0abc7464-c51e-4955-9f7e-7ea75fb2ad4d', 'eed57626-0c40-4549-b0f6-f3f5fabfb443', '98aee985-a7b0-4917-8d1e-3a769e070c8a', 'd9e78330-2322-4107-8fa4-13ec5a077d4a', '76814504-7ce7-40ba-82f2-84e284d411d9', '8c09eee5-5a36-4eb4-9d38-95a1d7f3aae8', '8e77d7e7-233b-4426-97f0-ffd56aec0bcc', '03a775fd-620f-4a18-8aaa-089b909fc2d6', 'b2503920-ca37-4277-9055-e3792e5cb1e5', '91c0edf6-9f85-4feb-81e4-ac9e483cd63b', '4afc2190-28a6-4a64-8ff1-e1b1abd4c370', 'cfc5d1c8-e9c9-4fd2-97b1-49db1ef7c0d9', '0b5b126e-9c9f-47ac-8e07-b837fb19ae59', '90663311-e052-4be8-a567-e0af18ab8c88', '4cc059bb-ea38-4d4f-aa49-2039083d9ca8', 'db290f4a-fb05-4db9-a410-d987dc7bd8a5', 'e9ef2fb1-c341-4135-a9a6-f7e54617f975', '9a2e4083-61f2-45d7-8aed-c51a9a34fb69', '4568b99d-e33e-4f02-88c0-763103dabbf3', '185904da-bd70-4d11-97fb-63636d210198', 'dbdbf545-466f-44c2-9f38-d21fec984ff0', '3e87d984-e5c9-4793-abfc-38a52c134416', '5aa6baaa-a2b5-457f-9142-a46ea6f89ca1', 'c5b06940-d590-4ea1-a1f0-2ed54b806c6e', '2357846b-c711-4c78-bbce-b6c6978ce932', 'bb1a69b6-cffe-4f88-b4a7-2d459a242644', '3d922960-c7e6-4de9-998f-f9cba37fd56a', '3b8fbf76-6f33-4930-bf9b-acce7f449db2', '02c92dd2-cb48-44c6-bb73-71f14d5f767b', '2cd709f8-48ed-4e78-b099-6a5686860cfb', '96dbaf24-baf9-4520-a1fb-47ee91bd1b76', '8f39671f-4bb6-4b1d-9948-c15b35aef135', 'c6b53f16-3faa-414a-8ceb-00b0eb0c37aa', '411f0054-4816-4813-9197-babf6fe284f1', 'f606d570-2b3f-452e-8f5c-1db433702cd8', '400181cf-ae8c-4d80-8f02-63fa1417d599', 'f1f7ed65-fecb-424b-bd32-3a7b16e09c13', '6a52cf3e-d312-4402-974d-9cc652e0062a', '77aa56d6-6b8a-4f5b-8037-408b26787dde', 'f56508cd-f7b4-408a-8ae1-efa9150b75fc', '477c5484-0a52-401b-8fcf-0ba86fa5a799', '54079c29-10c8-4f6b-9447-f2133cbedac7', 'db92b1c2-e031-41d3-995d-ca591346c310', '580a2a6f-ab3f-432c-930d-2a1537a7e8ed', '37466d37-50af-40dd-a8a9-f3e0b5a5b609', '7749828f-bf7f-4b3d-a58d-060efce0d551', '7ca258fa-71cb-4500-bb60-89198d514d84', '03402580-292d-4a36-8499-b1cb1ca65cc4', '25d00863-90d7-456d-8ba7-44e18f5658a5', '7db3a202-ff75-4651-a801-8b925684d5d9', '61efb65c-9dd1-449c-85a4-7e37d4bc9e1c', 'f9c919cf-ce73-4f35-96f0-3054e8f4f8c1', 'e697a725-099f-4b16-beba-874001a2885c', '56c3e57b-8cf9-4801-8fe9-24a78cb432e8', 'e7f5809e-0dda-406d-8de7-a73f6504de8e', '48663555-b4e9-4fe2-aae8-bf7194c02ada', 'bcb8d2db-da37-4e02-b1ed-1a3927600e96', '8497501a-5484-415c-9b2c-64d35da6e837', 'c1de1bb5-7b49-413c-a942-b31ac9b2489e', '6ce5de5f-ac55-45dc-a058-3741400dd0cd', 'd46932b5-ae45-42cd-8f8e-8e3c028e84a0', '6b907a11-f89f-4efe-870f-75a474663a00', '60a50051-9c12-4185-8369-1e6617c2ebaf', 'bbadf06c-a3fc-4e7e-afd5-f6e21427d606', '6134bf98-37e4-4657-b395-fde13c7b7d2d', '2e4d4d30-f234-41dd-ba62-db4eab7e46ff', '94930d8b-6696-433c-8aab-8164ba3977bd', '29c87cdf-de39-41c0-b671-f7e462fa0be9', 'd36c7d78-4034-42d5-86e5-2429fa71e03c', '1cd74a56-9d87-4fb2-9347-7c5ec0fe44c2', '10490ada-07a5-49ff-9f04-cdcb14fb8075', 'c50b3e36-867f-4820-812a-5f571450b20d', 'eb2f2324-3522-4edf-927e-94129040f332', 'fb88ec9a-af07-4b96-9a43-23bf45365377', '5ff443d5-dbac-44c1-8d58-26b4661acbf1', '70b9e00e-b26c-4af9-b592-20afdad23391', '30887faa-d922-4d92-8c6a-f470eb3fb768', 'df53d870-aeed-4ec2-9917-c9f5ed99e8e7', '3dc5be79-da80-402b-a100-2343c487bf6c', '12d6cb69-801d-41dd-a094-2678cef0efc5', '11075e5e-020b-4b9a-ade5-709e6798082c', 'ab6396de-6bb9-47a9-a060-28e41b6cb1e0', '547badae-d048-495a-8aae-0823992137e0', '37a0a0fe-3454-41a0-a917-566c0ace3f7c', 'e3127255-4ebe-482c-9f50-4917d1fd5439', 'e3fc01e7-929c-47f5-a0a1-6e20046e7b19', 'd16bda04-7082-425f-9d05-e9355784adc8', 'eaa2d333-8c64-416f-91c2-7575f0834c5f', '9fe3e611-9921-4b1a-812d-26c66194312f', '9d71754e-3e79-4aff-8ae4-f27cd5b68565', '0067dd79-9ae5-4570-9ab0-0eb4c6f77eb7', 'daf90843-3de7-4745-af7e-23a5211440e8', '0c077fa7-20a1-4fe8-8028-50998cbd11a6', '45adedc9-fd0e-46bb-b549-e34d9a7ee080'])

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
    """Randomly choose 'BENIGN' with 97% probability, otherwise choose a known threat type."""
    # 97% probability for "BENIGN"
    if random.random() < 0.97:
        return "BENIGN"
    
    # The remaining 3% is split equally among other annotations
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
