# Clash of Clans Manager

This project is a full-stack application designed to manage and display data related to Clash of Clans players, wars, and clan activities. It consists of a **React + TypeScript** frontend and an **Express + TypeScript** backend, with PostgreSQL as the database.

## Features

### Frontend
- Built with **React**, **TypeScript**, and **Vite**.
- Displays a list of active clan players with detailed stats.
- Allows sorting players by various attributes (e.g., wars participated, level, trophies).
- Fetches and displays recent war participation and attack details for each player.
- Responsive and styled using **Bootstrap**.

### Backend
- Built with **Express** and **TypeScript**.
- Connects to a PostgreSQL database using **Knex.js**.
- Provides RESTful APIs for fetching player and war data.
- Includes routes for:
  - Fetching all clan players.
  - Fetching the count of a player's participation in the last 10 wars.
  - Fetching detailed attack data for a player's last 5 wars.

### Database
- Uses PostgreSQL to store data about players, wars, and attacks.
- Knex.js is used for database queries and connection pooling.

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Docker (optional, for containerized deployment)

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
2. Install dependencies:
    npm install
3. Create a .env file in the server directory with the following variables:
    RAILWAY_DB_URL=<your_postgresql_connection_string>
    FRONTEND_URL=<your_frontend_url>
    PORT=<port>
4. Start the frontend in development mode:
    npm run dev

### Frontend Setup
1. Navigate to the client directory:
    cd client
2. Install dependencies:
    npm install
3. reate a .env file in the client directory with the following variable:
    VITE_SERVER_URL=<your_server_url>
4. Start the frontend in development mode:
    npm run dev

Routes
- GET /players: Fetch all clan players.
- GET /playerLastTenWars/:playerTag: Fetch the count of a player's participation in the last 10 wars.
- GET /playerLastFiveWars/:playerTag: Fetch detailed attack data for a player's last 5 wars.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Bootstrap

### Backend
- Express
- TypeScript
- Knex.js
- PostgreSQL
- DevOps

## License
This project is licensed under the MIT License.