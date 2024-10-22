# Stock Data API

This API allows uploading CSV or JSON data for stock information, storing it in a MongoDB database, and retrieving it through various endpoints for analysis such as highest volume, average close price, and VWAP. The API supports filtering by date range and symbol.

## Table of Contents

- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints) <!-- Correct link -->
  - [Highest Volume](#highest-volume) <!-- Correct links -->
  - [Average Close Price](#average-close-price)
  - [Average VWAP](#average-vwap)
- [Testing with Postman](#testing-with-postman)
- [Unit Tests](#unit-tests)
- [Contributing](#contributing)

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

API Endpoints <!-- This is where the API Endpoints section begins -->
Highest Volume
Endpoint: GET /api/highest_volume
Description: Retrieves the record with the highest volume within a specified date range, and optionally filtered by stock symbol.

Query Parameters:
start_date (required): Start date in YYYY-MM-DD format.
end_date (required): End date in YYYY-MM-DD format.
symbol (optional): Stock symbol (e.g., ULTRACEMCO).

Example Request:
bash
curl -X GET 'http://localhost:3000/api/highest_volume?start_date=2024-01-01&end_date=2024-12-31&symbol=ULTRACEMCO'
Response:
json
{
  "highest_volume": {
    "date": "2024-03-15",
    "symbol": "ULTRACEMCO",
    "volume": 1000000
  }
}

Average Close Price
Endpoint: GET /api/average_close
Description: Returns the average closing price for the given stock symbol within the specified date range.

Query Parameters:
start_date (required): Start date in YYYY-MM-DD format.
end_date (required): End date in YYYY-MM-DD format.
symbol (required): Stock symbol (e.g., ULTRACEMCO).
Example Request:
bash
curl -X GET 'http://localhost:3000/api/average_close?start_date=2024-01-01&end_date=2024-12-31&symbol=ULTRACEMCO'
Response:
json
{
  "average_close": 265.75
}

Average VWAP
Endpoint: GET /api/average_vwap
Description: Returns the average VWAP for the given stock symbol within the specified date range.

Query Parameters:
start_date (optional): Start date in YYYY-MM-DD format.
end_date (optional): End date in YYYY-MM-DD format.
symbol (optional): Stock symbol (e.g., ULTRACEMCO).
Example Request:
bash
curl -X GET 'http://localhost:3000/api/average_vwap?start_date=2024-01-01&end_date=2024-12-31&symbol=ULTRACEMCO'
Response:
json
{
  "average_vwap": 268.80
}

Testing with Postman
You can use Postman to test the endpoints. A Postman collection is provided to facilitate testing.

Import the Postman collection and environment to set up pre-configured API requests.
Ensure your server is running (npm start), and then you can run the requests directly from Postman.
