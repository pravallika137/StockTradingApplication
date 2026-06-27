# 📈 Stock Trading Application

A full-stack Stock Trading Application that allows users to buy and sell company shares, view transaction history, and monitor portfolio performance. The application is built using **Java Spring Boot**, **React.js**, and **MySQL**. Swagger is integrated for API documentation, and stock market data is fetched using the **Finnhub API**.

---

# Features

* User authentication and account management
* Dashboard showing balance, total investment, current value, and profit/loss
* Portfolio page with holdings, quantities, investment, current value, and profit/loss
* Buy page to browse available stocks, view historical charts, and purchase shares
* Sell page to liquidate holdings and record transactions
* Transaction history (buy/sell)
* Portfolio performance charts and visualizations
* REST API with Swagger documentation
* Real-time/near-real-time market data via Finnhub

---

# Tech Stack

## Backend

* Java 17
* Spring Boot 3.5
* Spring MVC
* Spring Data JPA
* Hibernate
* Maven

## Frontend

* React.js
* JavaScript

## Database

* MySQL

## API Documentation

* Swagger (Springdoc OpenAPI)

## External API

* Finnhub API

---

# Backend Dependencies

* Spring Boot Starter Web
* Spring Boot Starter Data JPA
* MySQL Connector/J
* Spring Boot Starter Validation
* Springdoc OpenAPI Starter WebMVC UI
* Lombok
* Spring Boot Starter Test

---

# Prerequisites

Make sure the following are installed on your system:

* Java 17
* Maven
* Node.js & npm
* MySQL
* Git

---

# Getting Started

## Clone the Repository

```bash
git clone <repository-url>
cd Stock-Trading-Application
```

---

## Backend Setup

Navigate to the backend folder.

```bash
cd trading-backend
```

Build the project.

```bash
mvn clean install
```

Run the Spring Boot application.

```bash
mvn spring-boot:run
```

The backend will start on:

```
http://localhost:8080
```

---

## Frontend Setup

Open a new terminal.

```bash
cd trading-frontend
```

Install dependencies.

```bash
npm install
```

Start the React application.

```bash
npm start
```

The frontend will start on:

```
http://localhost:3000
```

---

# Database Configuration

Create a MySQL database.

```sql
CREATE DATABASE stock_trading;
```

Update your `application.properties`.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stock_trading
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# Finnhub API Configuration

Create a free account at:

https://finnhub.io

Generate an API key and add it to your backend configuration.

```properties
finnhub.api.key=YOUR_API_KEY
```

---

# Running the Application

1. Start the MySQL server.
2. Run the Spring Boot backend.
3. Run the React frontend.
4. Open the application:

```
http://localhost:3000
```

---

# API Documentation

After starting the backend, open Swagger UI:

```
http://localhost:8080/swagger-ui/index.html
```

---

# Application Pages

* Dashboard
* Portfolio
* Buy Stocks
* Sell Stocks
* Transaction History

---

# Testing

Run backend tests:

```bash
mvn test
```

Run frontend tests:

```bash
npm test
```

