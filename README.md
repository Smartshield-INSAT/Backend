# How to Use

## Usage Documentation

### Prerequisites

- Ensure **Docker** and **Docker Compose** are installed.

### Production Setup

1. **Copy and Configure Environment Variables**

   ```bash
   cp .env.prod.example .env.prod
   ```

   Fill in any necessary values in `.env.prod`.

2. **Build and Run Containers**

   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Access the Application**

   - The backend API is available at `http://localhost:8000`.

### Development Setup

1. **Copy and Configure Environment Variables**

   ```bash
   cp .env.dev.example .env.dev
   ```

   Fill in any necessary values in `.env.dev`.

2. **Start the Application**

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the Application**

   - The backend API is available at `http://localhost:8000`.

4. **Using the API**

   - **Upload a pcap file** via POST request to `http://localhost:8000/upload_pcap/` using a tool like `curl` or Postman.

     ```bash
     curl -F "file=@your_pcap_file.pcap" http://localhost:8000/upload_pcap/
     ```

   - **Check Task Status** via GET request to `http://localhost:8000/task_status/{task_id}`.

     ```bash
     curl http://localhost:8000/task_status/your_task_id
     ```
