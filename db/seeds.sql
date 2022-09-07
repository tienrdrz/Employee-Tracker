INSERT INTO department (name)
VALUES
    ('Clothing'),
    ('Sports'),
    ('Equipment'),
    ('Front');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Personal Shopper', 25.50, 1),
    ('Sales Rep', 20, 1),
    ('Sport Rep', 20.50, 2)
    ('Equipment Rep', 21.50, 3),
    ('Cashier', 20, 4),
    ('Floor Attendant', 18, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Chris', 'Split', 1, 0),
    ('Steve', 'Pork', 2, 1),
    ('Michael', 'Debouis', 3, 2),
    ('James', 'Lindsay', 4, 1)
    ('Hamster', 'Sire', 5, 1)
    ('Lion', 'Dragon', 5, 3),
    ('Abel', 'Leba', 6, 0);
