# How to Use

## Usage Documentation

### Prerequisites

- Ensure **Docker** and **Docker Compose** are installed.
- Install **pnpm** globally if not already installed.

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

   - The backend API is available at `http://localhost:3000`.

### Development Setup

1. **Copy and Configure Environment Variables**

   ```bash
   cp .env.dev.example .env.dev
   ```

   Fill in any necessary values in `.env.dev`.

2. **Start Redis Container**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Install Dependencies and Run NestJS Backend**

   ```bash
   pnpm install
   pnpm nx serve backend
   ```

4. **Access the Application**

   - The backend API is available at `http://localhost:3000`.
