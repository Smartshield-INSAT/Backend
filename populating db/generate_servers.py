import requests
import random
import uuid


# Constant user UUID
user_uuid = "6767855e-e1e7-499b-b0d6-73e15dc948f9"


# Define the server URL
url = "http://192.168.100.92:3000/api/server"

def generate_random_uuid():
    """Generate a random UUID for server ID."""
    return str(uuid.uuid4())

def generate_random_hostname():
    """Generate a random hostname."""
    prefixes = ["server", "node", "host", "device", "machine"]
    suffix = random.randint(100, 999)
    return f"{random.choice(prefixes)}-{suffix}"

def choose_random_os():
    """Choose a random operating system."""
    os_choices = ["Ubuntu 20.04", "Windows Server 2019", "macOS Big Sur", "CentOS 7", "Debian 10"]
    return random.choice(os_choices)

def choose_random_arch():
    """Choose a random architecture."""
    arch_choices = ["x86_64", "arm64", "i386"]
    return random.choice(arch_choices)

def generate_random_mac_address():
    """Generate a random MAC address."""
    return "02:00:%02x:%02x:%02x:%02x" % (
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255),
    )

def generate_random_mac_addresses(count=1):
    """Generate a list of random MAC addresses."""
    return [generate_random_mac_address() for _ in range(count)]


ids = []

# Generate and send random server data
for _ in range(10):
    data = {
        "userUuid": user_uuid,  # Constant user UUID
        "hostname": generate_random_hostname(),
        "os": choose_random_os(),
        "arch": choose_random_arch(),
        "macAddresses": generate_random_mac_addresses(count=random.randint(1, 10))
    }
    # Send POST request
    response = requests.post(url, json=data)
    
    
    # Print the response status for each row
    if response.ok:
        response = response.json()
        ids.append(response['id'])
        print(f"Successfully sent data: {data}")
    else:
        print(f"Failed to send data: {data}")
        print(f"Response Code: {response.status_code}, Message: {response.text}")

# Print the result
print("============================================================================================")
print("============================GENERATED_SERVERS===============================================")
print("=================================COPY_ME====================================================")
print("============================================================================================")

print(ids)