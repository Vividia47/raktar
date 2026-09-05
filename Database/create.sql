CREATE DATABASE IF NOT EXISTS warehouse
    DEFAULT CHARACTER SET utf8;

USE warehouse;

CREATE TABLE goods (
    idP INT PRIMARY KEY AUTO_INCREMENT,
    Article VARCHAR(20),
    Barcode VARCHAR(13),
    Name VARCHAR(100),
    VAT FLOAT,
    LPPrice FLOAT,
    SPrice FLOAT,
    Stock FLOAT,
    MinStock FLOAT,
    Unit VARCHAR(20),
    Shelf VARCHAR(20),
    Bundle FLOAT,
    BUnit VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE users (
    idU INT PRIMARY KEY AUTO_INCREMENT,
    UserName VARCHAR(100),
    FullName VARCHAR(100),
    Password VARCHAR(30),
    UserRank INT
) ENGINE=InnoDB;

CREATE TABLE history (
    idH INT PRIMARY KEY AUTO_INCREMENT,
    idP INT,
    idU INT,
    Date DATETIME,
    InvoiceNr VARCHAR(100),
    Quantity FLOAT,
    Direction INT,
    PPrice FLOAT,
    SPrice FLOAT,
    SerialNr VARCHAR(50),

    CONSTRAINT fk_history_goods
        FOREIGN KEY (idP)
        REFERENCES goods(idP),

    CONSTRAINT fk_history_users
        FOREIGN KEY (idU)
        REFERENCES users(idU)
) ENGINE=InnoDB;