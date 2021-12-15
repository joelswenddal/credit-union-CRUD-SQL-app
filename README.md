# Credit Union Database Project

## Development Team
Joel Swenddal, Andrew Vo

## Project
As part of a simulation undertaken for a course in databases at Oregon State University, this project implements a DB backend for a small local credit union seeking to update its customer database.

## Contents

- [Background Scenario](#Background)
- [Project Goals](#Goals)
- [Outline](#Outline)
- [ER and Schema Diagrams](#ER)
- [DB Access: CRUD Functionalities](#CRUD)
- [Technologies](#Technologies)

## Website

[Site Link](https://nameless-island-54872.herokuapp.com/)

### <a id="Background"></a>Background Scenario
The organization currently uses a database system that is out of date, with customer information and promotional data that are siloed and not easily accessible. The granular details tracked by the new DB will be information regarding the customer, the accounts associated with the customer, and the transactions tied to the customer and accounts. The credit union uses this updated database to provide a comprehensive view of their customer base to see what services a customer uses, and where the credit union can try to upsell further services and products to them, further tying them to the credit unions’ banking ecosystem. To specifically address this effort, a Special Offers entity has been implemented in order to support better tracking of promotional efforts for the organization.

## <a id="Goals"></a>Project Goals
- Analyze a client's business goals and informational needs
- Use best-practice methods for designing a relational db model and schema that fit the needs of a client
- Implement a MySQL db backend
- Implement CRUD functionality for access to db
- Implement limited front-end access to db for basic administrative functionality (not a full front-end for a customer user)

## <a id="Outline"></a>Database Outline

### Entities:
**CUSTOMERS**: Details of the bank’s customer
- customer_ID: int(9), auto increment, unique, not NULL, primary key
- ssn: varchar(9)
- first_name: varchar (40), not NULL
- middle_name: varchar (40)
- last_name: varchar (40), not NULL
- dob: date, not NULL
- street_address: varchar (80), not NULL
- city: varchar (30), not NULL
- state: char (3), not NULL
- zip: int (5)
- phone_number: varchar (10)
- email: varchar(40)

- **Relationships**: M:1 relationship with ACCOUNTS_CUSTOMERS intersection table
Constraints: CUSTOMERS can be associated with 0 or more ACCOUNTS

**ACCOUNTS**: Details of the account entity that belongs to a customer

- account_ID: int(9), auto increment, unique, not NULL, primary key

- account_type: varchar(40), not NULL, foreign key
- balance: decimal, not NULL

- **Relationships**: 1:M relationship with ACCOUNTS_CUSTOMERS (this is the relationship entity -- ACCOUNTS has M:M relationship with CUSTOMERS); M:1 relationship with ACCOUNT_TYPES 
- **Constraints**: Every ACCOUNTS item must have at least one CUSTOMER

**ACCOUNT_TYPES**: Details on different account types available to the banking customer
- account_type: varchar(40), not NULL, unique, primary key; choice of: checking, savings, credit_card

- offer_ID: int(9), foreign key

- interest_rate: decimal, not NULL

- **Relationships**: 1:M relationship with ACCOUNTS
- **Constraints**: Every ACCOUNTS item must have an ACCOUNT_TYPE; interest rate structures are dependent on different account types

**SPECIAL_OFFERS**: Special offer packages that may be related to an account type
- offer_ID: int(9), auto increment, unique, not NULL, primary key

- chequebook: varchar(10)

- no_fee_transactions: varchar(10)

- sign_up_bonus: int(4)

- **Relationships**: 1:M relationship with ACCOUNT_TYPES. 
- **Constraints**: one SPECIAL_OFFERS can be associated with 0 or more ACCOUNT_TYPES and one ACCOUNT_TYPES can be associated with 0 or 1 SPECIAL_OFFERS.

**TRANSACTIONS**: Details regarding a transaction event that is related to an account

- transaction_ID: int(9), auto increment, unique, not NULL, primary key

- account_ID: int(9), unique, foreign key

- date_time: timestamp, not NULL

- amount: decimal, not NULL

- transaction_type: varchar(20), not NULL; choice of: “deposit”, “withdrawal”

- **Relationships**: 1:M relationship with ACCOUNTS
- **Constraints**: Every TRANSACTIONS item must have one and only one associated ACCOUNT

**ACCOUNTS_CUSTOMERS**: Records the activity between ACCOUNTS and CUSTOMERS (a composite entity/intersection table to deal with the M:M relationship between these entities). Holds a unique record of all ACCOUNTS and CUSTOMERS intersections. Superkey is { account_ID, customer_ID }.

- account_ID: int(9), not NULL, foreign key

- customer_ID: int(9), not NULL, foreign key

- **Relationships**: 1:M with ACCOUNTS, 1:M with CUSTOMERS


## <a id="ER"></a>ER & Schema Diagrams
![ER Diagram](/images/cs340_Bank_Project_ER.jpeg)

![Schema Diagram](/images/DB_Schema_Credit_Union.jpeg)

## <a id="CRUD"></a>Supported CRUD Operations

- **Customers Page**: CREATE/READ/UPDATE/DELETE Customer records; FILTER Customers by State; SEARCH Customers by Last Name

- **Accounts Page**: READ/ADD Account records

- **Transactions Page**: READ/ADD Transaction records

- **Account Types Page**: READ/ADD Account Type records

- **Special Offers Page**: READ/ADD Special Offer records

## <a id="Technologies"></a> Technologies

- MySQL (MariaDB)
- Node.js, Javascript, HTML
- Bootstrap, CSS
- Handlebars (templating)