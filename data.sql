\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS comp_industry;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);


CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  industry text NOT NULL
);

CREATE TABLE comp_industry (
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  industry text NOT NULL REFERENCES industries ON DELETE CASCADE,
  PRIMARY KEY(comp_code,industry)
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
          ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
          ('apple', 200, false, null),
          ('apple', 300, true, '2018-01-01'),
          ('ibm', 400, false, null);

INSERT INTO industries (code,industry)
VALUES ('acct','Accounting'),
        ('it','information technology');


INSERT INTO comp_industry (comp_code,industry)
VALUES ('apple','it'),
        ('ibm','acct');