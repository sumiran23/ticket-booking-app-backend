## 🚀 Backend API Setup Guide

### 📦 Database Setup

#### Step 1: Launch PostgreSQL Container

Run the following Docker command to create and start a PostgreSQL container:

```bash
docker run -d \
    --name node-postgres-db \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=ticket-booking-app \
    -p 5432:5432 \
    postgres
```

#### Step 2: Connect via pgAdmin

- Install [pgAdmin](https://www.pgadmin.org/download/)
- Create a new server connection with the following credentials:
  - **Host:** `localhost`
  - **Port:** `5432`
  - **Username:** `postgres`
  - **Password:** `postgres`
  - **Database:** `ticket-booking-app`

#### Step 3: Initialize Database Schema

Execute the `final-schema.sql` file (located in the project root) to create all required tables.

#### Step 4: Seed Sample Data

Run the `data-seed.sql` file to populate the database with sample data for testing and development.

---

> ✅ Your database is now ready to use!
