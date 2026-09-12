[Magyar](README.md) | [English](README.en.md)

# Warehouse Management

A web application for inventory management and warehouse operations. Developed as a group project and final project for a software development course.

## Technology Stack

**Database:** MySQL

**Backend:** ASP.NET Core Web API (C#), JWT Bearer authentication

**Frontend:** HTML5, CSS3, JavaScript, Bootstrap

## Prerequisites

* .NET SDK
* A running MySQL server (WAMP or XAMPP can be used)
* A modern web browser

The backend database connection can be changed in the configuration file.

## Database

The database dump is included in the repository.

To set up the database:

1. Start the MySQL server, for example with WAMP or XAMPP.
2. Open phpMyAdmin.
3. Import the `Database/create.sql` database script.
4. The script creates the `warehouse` database and the required tables.
5. Check the database connection settings and update them if necessary for your MySQL installation.

The database intentionally contains no pre-populated users or products.

If the database contains no users, the first user account can be created from the home page. The first account is always created with the Warehouse Manager role.

### Database Creation and Schema

For the demo, `Database/create.sql` is the authoritative database schema and should be imported. The application's `Database.EnsureCreated()` call is only a convenience fallback: it can create tables in an empty database, but it does not update or migrate an existing schema.

If the schema changes later, update `create.sql` or run the appropriate SQL `ALTER TABLE` statements. The current demo database must contain the `users.PasswordHash` column for password-hash storage.

Financial fields currently use `DECIMAL` types. If you are using an older database, run this once:

```sql
ALTER TABLE goods
    MODIFY VAT DECIMAL(5,2),
    MODIFY LPPrice DECIMAL(10,2),
    MODIFY SPrice DECIMAL(10,2);

ALTER TABLE history
    MODIFY PPrice DECIMAL(10,2),
    MODIFY SPrice DECIMAL(10,2);

ALTER TABLE users
    ADD CONSTRAINT UX_users_UserName UNIQUE (UserName);
```

## Running the Application

### 1. Start MySQL

Start the MySQL server using WAMP, XAMPP, or another MySQL environment.

### 2. Start the Backend

From the project root directory:

```bash
cd Backend\WarehouseAPI\WarehouseAPI
dotnet run
```

The backend uses the local Development HTTP address:

```text
http://localhost:5282
```

The frontend communicates with the backend through this API.

### 3. Start the Frontend

Open the `Frontend` folder in VS Code and start `index.html` with Live Server. The default Live Server address is:

```text
http://localhost:5500/Frontend/index.html
```

The `127.0.0.1` equivalent is also allowed:

```text
http://127.0.0.1:5500/Frontend/index.html
```

This project is intended as a private local exam/demo application. The Development JWT key is included in the Development configuration, so the project can be started from a fresh repository clone without an additional secret setup.

## Login and Users

If the database contains no users, the application allows the first user to be created from the home page. This first account is always assigned the Warehouse Manager role.

Further users can be created and managed by an authenticated Warehouse Manager.

Login uses JWT-based authentication. Authenticated API requests send the JWT as a Bearer token.

## User Roles

The application supports four user roles:

* **Warehouse Manager** – full access to the application, including user management.
* **Warehouse Worker** – product management and warehouse stock movement recording.
* **Salesperson** – can view products and stock quantities and modify selling prices.
* **Procurement Officer** – can view stock quantities and identify products that need reordering based on the minimum stock level.

## Main Features

* User login and JWT-based authentication
* Role-based authorization
* Product and inventory management
* Recording incoming and outgoing stock movements
* Viewing stock movements by document number while recording a movement
* Stock movement history
* Management of selling and purchase prices
* Minimum stock level monitoring and reorder warnings
* Responsive Bootstrap-based user interface
* Loading states, retry actions, notifications, and keyboard-accessible modal forms

## Main Database Tables

* **goods** – product and inventory data
* **users** – users, password hashes, and roles
* **history** – warehouse stock movements and transactions

## API

The backend provides a REST API for, among other things:

* user authentication
* user management
* product management
* inventory management
* stock movement recording
* stock movement history

Endpoints requiring authentication use JWT Bearer tokens. The authenticated user's ID is read from the JWT claims rather than trusted from the frontend request.

## Useful Development Tools

* Visual Studio / Visual Studio Code
* .NET SDK
* MySQL
* phpMyAdmin
* WAMP or XAMPP
* Live Server
* Postman
* Git / GitHub

## Authors

**Dobrocsi Zsolt**

Backend and database development.

**Tempfli Vivien**

Frontend development, user interface, and authentication.

## Notes

This project was developed for educational purposes as a group final project.

The application can be started with an empty database after importing `Database/create.sql`. After the first user is created, the system provides the functionality corresponding to that user's role.
