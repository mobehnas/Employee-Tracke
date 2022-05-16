USE employees;

INSERT INTO department (name)
VALUES 
    ("Finance"),
    ("Insurance");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Accounts", 420000, 1),
    ("Banker", 35500, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Rekha", "Kumari",1,NULL),
    ("John", "Doe",2,1);

