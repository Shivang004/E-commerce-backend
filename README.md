# Product Management System

This project is a Product Management System for managing products in a basic e-commerce setup. It allows users to view, add, edit, and delete products, with basic authentication. Built using **React** (Next.js), **Node.js**, and **PostgreSQL**, this application showcases full-stack development with JWT-based authentication and deployment readiness.

## Live Demo

[Live Demo on Vercel](https://your-app-url.vercel.app) (replace with actual URL if deployed)

## Features

### Frontend
- **Product Listing Page**: View a list of products with details like name, description, price, and quantity.
- **Add Product**: Form to add a new product.
- **Edit Product**: Option to edit an existing product's details.
- **Delete Product**: Option to delete a product from the list.
- **Styling**: Basic CSS and optional Bootstrap integration.

### Backend
- **API Endpoints**:
  - `GET /products`: Fetches all products.
  - `POST /products`: Adds a new product.
  - `PUT /products/:id`: Updates an existing product.
  - `DELETE /products/:id`: Deletes a product.
- **Authentication**: JWT-based authentication for add, edit, and delete operations.

### Database
- PostgreSQL Database with tables:
  - `products`: Stores product information.
  - `users`: Stores user credentials for authentication.

### Optional Features
- **Unit Tests**: API route tests using Jest and Supertest.
- **Deployment**: Hosted on Vercel.

---

## Getting Started

### Prerequisites

- **Node.js** and **npm**
- **PostgreSQL**
- **Git**

### Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/Shivang004/E-commerce.git
   cd E-commerce
   ```
2. **Install Dependencies**:
- Install server-side dependencies:
    ```
    cd my-backend
    npm install
    ```

3. **Set up PostgreSQL Database**:
- Start PostgreSQL and create a database named product_management.
- Create the products and users tables:
    ```
    CREATE DATABASE product_management;

    \c product_management;

    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price FLOAT NOT NULL,
        quantity INTEGER NOT NULL
    );

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
    ```

4. **Environment Variables**:
- Create a .env file in the backend directory with the following contents:.
    ```
    DATABASE_URL=postgresql://<username>:<password>@localhost:5432/product_management
    JWT_SECRET=your_jwt_secret
    ```
- Replace ```<username>``` and ```<password>``` with your PostgreSQL credentials and set a value for JWT_SECRET.

5. **Running the Backend**:
- In the backend directory, start the server:.
    ```
    node server.js
    ```
6. **Running the Frontend**:
- In the frontend directory, start the React application:.
    ```
    npm run dev
    ```
7. **Accessing the Application**:
- Open a browser and go to ```http://localhost:3001``` to view the frontend.
- The backend server is running on ```http://localhost:3000```.

## API Endpoints
**The following API endpoints are available:**
- GET /products - Fetch all products
- POST /products - Add a new product (requires authentication)
- PUT /products/
- Edit an existing product (requires authentication)
- DELETE /products/
- Delete a product (requires authentication)
- POST /auth/login - Log in and receive a JWT token
- POST /auth/register - Register a new user

## Authentication
- Only authenticated users can add, edit, or delete products.
- Use the /auth/login endpoint to log in and receive a token, then include the token in the Authorization header for protected requests.

## Testing
To run tests for the API, run the following command in the backend directory:
    ```
    npm test
    ```
