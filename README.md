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

### 🔧 API Setup

#### Step 1: Install Dependencies

Install the required packages using npm:

```bash
npm install
```

#### Step 2: Configure Environment Variables

Refer to the `.env.example` file and create a `.env` file with all the necessary environment variables.

#### Step 3: Start the Development Server

Run the following command to start the API server:

```bash
npm run dev
```

---

> ✅ Your API server is now running!

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ ticketstatus : "reserves/books"
    users ||--o{ booking_confirmations : "makes"
    events ||--o{ seats : "has"
    events ||--o{ ticketstatus : "for"
    events ||--o{ booking_confirmations : "for"
    seats ||--|| ticketstatus : "tracked_in"
    booking_confirmations ||--o{ booking_confirmation_seats : "contains"
    seats ||--o{ booking_confirmation_seats : "included_in"

    users {
        int id PK
        string email UK
        string password
    }

    events {
        int id PK
        string title
        text description
        string thumbnail
        string venue
        timestamp eventdatetime
    }

    seats {
        int id PK
        int event_id FK
        string seat_number
        string type
        decimal price
    }

    ticketstatus {
        int id PK
        int event_id FK
        int seat_id FK "UK with event_id"
        int user_id FK "nullable"
        string status "available, reserved, booked"
        timestamp held_until "nullable"
    }

    booking_confirmations {
        int id PK
        int event_id FK
        int user_id FK
        decimal total_price
    }

    booking_confirmation_seats {
        int id PK
        int booking_confirmation_id FK
        int seat_id FK "UK with booking_confirmation_id"
    }
```
