[Magyar](README.md) | [English](README.en.md)

# Warehouse Management

A web application for inventory management and handling warehouse operations. Developed as a group project and final project for a software development course.

## Technology Stack

**Database:** MySQL

**Backend:** ASP.NET Core Web API (C#), JWT Bearer authentication

**Frontend:** HTML5, CSS3, JavaScript, Bootstrap

## Prerequisites

* .NET SDK
* Running MySQL server (WAMP/XAMPP can be used)
* Modern web browser

The database connection used by the backend can be modified in the configuration file.

## Database

The database dump for the project is included in the repository.

To set up the database:

1. Start the MySQL server, for example using WAMP.
2. Open phpMyAdmin.
3. Import the `create.sql` database dump from the repository.
4. The dump automatically creates the `warehouse` database and the required tables.
5. Check the database connection settings in the backend configuration file and modify them if necessary to match your MySQL environment.

The database intentionally does not contain any pre-populated users or products.

If the database does not contain any users yet, the first user account can be created from the home page.

## Running the Application

### 1. Start MySQL

Start the MySQL server using WAMP, XAMPP, or another MySQL environment.

### 2. Start the Backend

From the project root directory:

```bash
cd Backend\WarehouseAPI\WarehouseAPI
dotnet run
```

After starting the backend, the application is available at the address displayed in the terminal.

The frontend communicates with the server through the backend API.

## Login and Users

If the database does not contain any users yet, the application allows the first user to be created.

Subsequent users can be created and managed by users with the appropriate permissions.

Login uses JWT-based authentication.

## User Roles

The application supports four user roles:

* **Warehouse Manager** – full access to the application, including user management.
* **Warehouse Worker** – product management and recording warehouse stock movements.
* **Salesperson** – can view products and stock quantities and modify prices.
* **Procurement Officer** – can view stock quantities and check which products require reordering based on the minimum stock level.

## Main Features

* User login and JWT-based authentication
* Role-based access control
* Product and inventory management
* Recording incoming and outgoing stock
* Stock movement tracking
* Management of sales and purchase prices
* Minimum stock level monitoring
* Viewing warehouse history
* Responsive Bootstrap-based user interface

## Main Database Tables

* **goods** – product information
* **users** – users and their permissions
* **history** – warehouse stock movements and transactions

## API

The backend provides a REST API for, among other things:

* user authentication
* user management
* product management
* inventory management
* recording stock movements
* retrieving warehouse history

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

Frontend development, user interface, and authentication.

## Notes

This project was developed for educational purposes as a group final project.

The application can be started with an empty database. After the first user is created, the system provides the functionality corresponding to that user's role.
