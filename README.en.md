[Magyar](README.md) | [English](README.en.md)

# Warehouse Management System

A web application for inventory management and warehouse process management. Final project / group project for a software development course.

## Technology Stack

**Database:** MySQL

**Backend:** ASP.NET Core Web API (C#), JWT Bearer authentication

**Frontend:** HTML5, CSS3, JavaScript, Bootstrap

## Prerequisites

* .NET SDK
* Running MySQL server (WAMP/XAMPP can also be used)
* Modern web browser

The backend database connection can be configured in the configuration file.

## Database

The database dump required for the project is included in the repository.

To set up the database:

1. Open the phpMyAdmin interface.
2. Import the `create.sql` database dump included in the repository.
3. The dump automatically creates the `warehouse` database and the required tables.
4. Check the database connection settings in the backend configuration file and modify them if necessary to match your local MySQL environment.

The database intentionally does not contain any pre-populated users or products.

If the database does not yet contain any users, the first user account can be created from the application's home page.

## Running the Application

### 1. Starting MySQL

Start the MySQL server using WAMP, XAMPP, or another MySQL environment.

### 2. Starting the Backend

From the project root directory:

```bash
cd Backend\WarehouseAPI\WarehouseAPI

dotnet run
```

After the backend starts, the API is available at the address displayed in the terminal.

### 3. Starting the Frontend

1. Open the project's `Frontend` folder in Visual Studio Code.
2. Start the `index.html` file using **Live Server**.

The default Live Server address is:

```text
http://localhost:5500/Frontend/index.html
```

If Live Server uses the `127.0.0.1` address, this is also supported.

The frontend communicates with the server through the backend API.

## Login and Users

The system uses JWT-based authentication.

If the database does not yet contain any users, the first user account can be created from the application's home page.

Subsequent users can be created and managed by users with the appropriate permissions.

## User Roles

The application supports four user roles:

* **Warehouse Manager** – full access to the application, including user management.
* **Warehouse Worker** – product management and recording warehouse stock movements.
* **Salesperson** – viewing products and stock quantities, as well as modifying prices.
* **Procurement Officer** – viewing stock quantities and checking products that require reordering based on the minimum stock level.

## Main Features

* User login and JWT-based authentication
* Role-based access control
* Product and inventory management
* Recording incoming and outgoing stock
* Inventory movement tracking
* Management of sales and purchase prices
* Minimum stock level monitoring
* Viewing warehouse history
* Responsive, Bootstrap-based user interface

## Main Database Tables

* **goods** – product data
* **users** – users and their permissions
* **history** – warehouse stock movements and transactions

## API

The backend provides, among other things, the following functionality through a REST API:

* user authentication
* user management
* product management
* inventory management
* recording stock movements
* retrieving history

Endpoints requiring authentication use JWT Bearer tokens.

## Useful Development Tools

* Visual Studio / Visual Studio Code
* MySQL
* phpMyAdmin
* WAMP
* Postman
* Git / GitHub

## Authors

**Dobrocsi Zsolt**

Backend and database development.

**Tempfli Vivien**

Frontend development, user interface, authentication.

## Notes

The project was developed for educational purposes as a group final project.

The development JWT key is included in the Development configuration, so the project can be run from a fresh repository clone without additional secret configuration.