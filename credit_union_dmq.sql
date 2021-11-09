-- Customers Page --
-- get customers table
SELECT * FROM customers
-- add a customer
INSERT INTO customers (customer_ID, first_name, middle_name, last_name, ssn, dob, street_address, city, state, zip, phone, email) 
VALUES(:auto_incremented,:first_name_input,:middle_name_input,:last_name_input,:ssn_input,:dob_input,:street_address_input,:city_input,:state_input,:zip_input,:phone_input,:email_input )
-- update/edit a customer
UPDATE customers SET first_name = :first_name_input, middle_name = :middle_name_input, last_name = :last_name_input,
ssn = :ssn_input, dob = :dob_input, street_address = :street_address_input, city = :city_input, state = :state_input, zip = :zip_input, phone = :phone_input, email = :email_input
WHERE customer_ID= :customer_ID_input
-- delete a customer
DELETE FROM customer WHERE customer_ID = :customer_ID_input AND ssn = :ssn_input
-- search/filter a customer
SELECT * FROM customers WHERE first_name = :first_name_input AND middle_name = :middle_name_input AND last_name = :last_name_input AND ssn = :ssn_input AND dob = :dob_input


-- Accounts Page --
-- get accounts table
SELECT account_ID, account_type, balance FROM accounts
-- add an account, inserting customer id, account type, and balance.
INSERT INTO accounts (account_ID, account_type, balance) VALUES(:customer_ID_input,:account_type_from_account_types,:balance_input)


-- Transactions Page --
-- get transaction table
SELECT transaction_ID, account_ID, date_time, amount, transaction_type FROM transactions
-- add a transaction 
INSERT INTO transaction (transaction_ID, account_ID, date_time, amount, transaction_type) VALUES(:account_ID_of_originating_account, :amount_input, :transaction_type_input)


-- Account Types Page --
-- get account types table
SELECT account_type, interest_rate, offer_ID FROM account_types
-- add account type
INSERT INTO account_types (account_type, interest_rate, offer_ID) VALUES (:account_type, :interest_rate, :offer_ID_if_applicable)
-- update/edit account type
UPDATE account_types SET account_type = :account_type_input, interest_rate= :interest_rate_input, offer_ID = :offer_ID_input WHERE account_type= :account_type_from_update_form


-- Special Offers Page --
-- get special offers table
SELECT offer_ID, chequebook, no_fee_transactions, sign_up_bonus FROM special_offers
-- add special offer
INSERT INTO special_offers(offer_ID, chequebook, no_fee_transactions, sign_up_bonus) VALUES (:auto_incremented, :chequebook_input, :no_fee_transactions_input, :sign_up_bonus_input)


-- Accounts_Customers Page --
-- get accounts_customers table
SELECT account_ID, customer_ID FROM accounts_customers
-- add a customer to an existing account
INSERT INTO special_offers(offer_ID, chequebook, no_fee_transactions, sign_up_bonus) VALUES (:auto_incremented, :chequebook_input, :no_fee_transactions_input, :sign_up_bonus_input)
-- delete a customer from an account removing m:m relationship
DELETE FROM accounts_customers WHERE account_ID = :account_ID_from_accounts AND customer_ID = :customer_ID_from_customers




