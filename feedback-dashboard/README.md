# Feedback Dashboard

The `feedback-dashboard` folder houses the source code for OpusFlow InsightHub—a web application designed to provide a consolidated dashboard for viewing, filtering, and sorting user feedback data within OpusFlow.

## Prerequisites

Make sure you have Node.js installed. The project is compatible with Node versions 16.x and 18.x.

## Getting Started

### Using Yarn (Recommended)

1. Install project dependencies with:

    ```bash
    yarn install
    ```

2. Start the development server with:

    ```bash
    yarn dev
    ```

### Using npm

**Note: If `npm i` encounters issues, try using `npm i --legacy-peer-deps`.**

1. Install project dependencies with:

    ```bash
    npm i --legacy-peer-deps
    ```

   **Note:** If `npm i` does not work, try `npm i --legacy-peer-deps`.

2. Start the development server with:

    ```bash
    npm run dev
    ```

## Running Tests

To run tests using Jest, use the following command:

```bash
yarn test
```
or

```bash
npm run test
```

## Configuration

Make sure to set up your environment variables by copying the provided `.env.example` file:

```bash
cp .env.example .env
