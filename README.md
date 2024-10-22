# Stock Data API

This API allows uploading CSV or JSON data for stock information, storing it in a MongoDB database, and retrieving it through various endpoints for analysis such as highest volume, average close price, and VWAP. The API supports filtering by date range and symbol.

## Table of Contents

- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints]
  - [Highest Volume]
  - [Average Close Price]
  - [Average VWAP]
- [Testing with Postman]
- [Unit Tests]
- [Contributing]
  
## Project Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/rohan196/nodetask
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add your environment variables (see [Environment Variables](#environment-variables)).

4. Run the development server:
    ```bash
    npm start
    ```

5. The API will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```bash

MONGO_URI=mongodb:your mongo uri
PORT=3000

Ensure you replace the MONGO_URI with your actual MongoDB connection string
