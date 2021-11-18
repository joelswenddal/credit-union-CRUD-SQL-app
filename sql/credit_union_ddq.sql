
/* Data definition queries: Generate DB */

DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    customer_ID int (9) NOT NULL AUTO_INCREMENT,
    ssn varchar(9),
    first_name varchar(40) NOT NULL,
    middle_name varchar(40),
    last_name varchar(40) NOT NULL,
    dob date NOT NULL,
    street_address varchar(80) NOT NULL,
    city varchar(30) NOT NULL,
    state char(3) NOT NULL,
    zip int(5),
    phone_number varchar(10),
    email varchar (40),
    PRIMARY KEY (customer_ID),
    UNIQUE (customer_ID)
    ) 
    
    ENGINE=InnoDB;

DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    account_ID int (9) NOT NULL AUTO_INCREMENT,
    account_type varchar(40) NOT NULL,
    balance decimal(65,2) NOT NULL,
    PRIMARY KEY (account_ID),
    UNIQUE (account_ID)
    )
    ENGINE=InnoDB; 


DROP TABLE IF EXISTS account_types;

CREATE TABLE account_types (
    account_type varchar(40) NOT NULL,
    offer_ID int (9),
    interest_rate decimal(2,2) NOT NULL,
    PRIMARY KEY (account_type)
    )
    ENGINE=InnoDB;
    /*Note that I changed offer_ID to allow NULL so that
    it would become NULL on delete of the parent table 
    (special_offers), since this is a foreign key
      */


DROP TABLE IF EXISTS special_offers;

CREATE TABLE special_offers (
    offer_ID int (9) NOT NULL AUTO_INCREMENT,
    chequebook varchar(10),
    no_fee_transactions varchar(10),
    sign_up_bonus int(4),
    PRIMARY KEY (offer_ID),
    UNIQUE(offer_ID)
    )
    ENGINE=InnoDB;
 
DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    transaction_ID int (9) NOT NULL AUTO_INCREMENT,
    account_ID int (9) NOT NULL,
    date_time timestamp NOT NULL,
    amount decimal(65,2) NOT NULL,
    transaction_type varchar (20) NOT NULL,
    PRIMARY KEY (transaction_ID),
    UNIQUE(transaction_ID)
    )
    ENGINE=InnoDB;

DROP TABLE IF EXISTS accounts_customers;

/*Set up intersection table for M:M relationship*/

CREATE TABLE accounts_customers (
    account_ID int (9) NOT NULL,
    customer_ID int (9) NOT NULL,
    PRIMARY KEY (account_ID, customer_ID),
    FOREIGN KEY (account_ID)
    REFERENCES accounts(account_ID)
    ON DELETE CASCADE,
    FOREIGN KEY (customer_ID)
    REFERENCES customers(customer_ID)
    ON DELETE CASCADE)
    ENGINE=InnoDB;

/*Set up additional relationships/foreign keys*/

ALTER TABLE accounts
ADD CONSTRAINT fk_account_type
FOREIGN KEY (account_type)
REFERENCES account_types(account_type)
ON DELETE CASCADE;

ALTER TABLE account_types
ADD CONSTRAINT fk_offer_ID
FOREIGN KEY (offer_ID)
REFERENCES special_offers(offer_ID)
ON DELETE SET NULL;
/*This is the null-able relationship*/

ALTER TABLE transactions
ADD CONSTRAINT fk_account_ID
FOREIGN KEY (account_ID)
REFERENCES accounts(account_ID)
ON DELETE CASCADE;

/* Dumping data for table `customers` */

LOCK TABLES customers WRITE;

INSERT INTO customers
VALUES 
(DEFAULT, '111112222', 'Andrew', 'H.','Generic', 
'2002-08-05', '217 East St.','New Haven','NJ', 02345, 
'4168757777', 'andrew@fakemail.com'),
(DEFAULT, '555555555', 'Joe', 'H.','Sample', 
'2000-02-02', '213 Smith St.','Smithville','CA', 97657, 
'4014568976', 'joes@fakemail.com'),
(DEFAULT, '234876666', 'Sandy', 'H.','Generic', 
'2002-08-02', '217 East St.','New Haven','NJ', 02345, 
'4014568709', 'sandyg@fakemail.com');
UNLOCK TABLES;


LOCK TABLES special_offers WRITE;
INSERT INTO special_offers
VALUES 
(DEFAULT, 'Yes', 'Yes', 0), 
(DEFAULT, 'Yes', 'No', 0),
(DEFAULT, 'No', 'Yes', 250);
UNLOCK TABLES;

LOCK TABLES account_types WRITE;
INSERT INTO account_types
VALUES 
('Checking', 2, 0.00), 
('Savings', 2, 0.00), 
('Credit Card', 3, 0.00);
UNLOCK TABLES;

LOCK TABLES accounts WRITE;
INSERT INTO accounts
VALUES 
(DEFAULT, 'Checking', 0.00), 
(DEFAULT, 'Savings', 0.00), 
(DEFAULT, 'Credit Card', 0.00);
UNLOCK TABLES;

LOCK TABLES transactions WRITE;
INSERT INTO transactions
VALUES 
(DEFAULT, 1, DEFAULT, 3000.00, 'Deposit'),
(DEFAULT, 2, DEFAULT, 1000.00, 'Withdrawal'),
(DEFAULT, 2, DEFAULT, 4500.00, 'Deposit');
UNLOCK TABLES;


LOCK TABLES accounts_customers WRITE;
/* This references the first two accounts that were
auto-generated (1 and 2) in the first field, and the
first two customers who were auto-generated in the
second field*/
INSERT INTO accounts_customers
VALUES
(1, 1), 
(2, 1), 
(1, 2);
UNLOCK TABLES;