const res = require('express/lib/response');
const db = require('./db/connection');
const inquirer = require('inquirer');

//Function to display all employees
function displayEmployees () {
    let sql = `SELECT * FROM employee`;

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        createDisplayData();
    });
};

//Function to display all departments
function displayDepartments() {
    let sql = `SELECT * FROM department`;

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        createDisplayData();
    });
};

//Function to display all roles
function displayRoles() {
    let sql = `SELECT * FROM role`;

    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        createDisplayData();
    });
};

//Function to add an employee
function addEmployee() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employees first name?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employees last name?',
        }
    ])
    .then(answer => {
        const newData = [answer.first_name, answer.last_name]
        const getRole = `SELECT roles.id, roles.title FROM roles`;
        db.query(getRole, (err, result) => {
            const role = result.map(({id, title}) => ({name: title, value: id}));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role associated with the employee?',
                    choices: role
                }
            ])
            .then(roleChoice => {
                const newRole = roleChoice.role;
                newData.push(newRole);
                const getMgr = `SELECT * FROM employee`;
                db.query(getMgr, (err, data) => {
                    const managers = data.map(({id, first_name, last_name}) => ({name: first_name + '' + last_name, value: id}));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is this employees manager?',
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const newManager = managerChoice.manager;
                        newData.push(newManager);
                        const insertData = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`
                        db.query(insertData, newData, (err, result) => {
                            if (err) {
                                res.status(500).json({message: "There was an error"});
                                return;
                            }
                            console.log('A new employee has been added and will be displayed.');
                            displayEmployees();
                            //after an employee has been created, we can display all employees for the user
                        });
                    });
                });
            });
        });
    });
};

//Function to add a department
function addDepartment() {
    inquirer.prompt([
      {  
        type: 'input',
        name: 'name',
        message: 'What is the name of this department?'
    }
    ])
    .then(newDpt => {
        const newData = [newDpt.name];
        const addDpt = `INSERT INTO department (name) VALUES (?)`
        db.query(addDpt, newData, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Error'});
                return;
            }
            console.log('A new department has been added! Anything else?');
            createDisplayData();
        })
    })
};


//Function to add a role
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role would you like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role'
        }
    ])
    .then(newRole => {
        const newData = [newRole.role, newRole.salary];
        const getDpt = `SELECT department.id, department.name FROM department`;
        db.query(getDpt, (err, result) => {
            const department = result.map(({ id, name }) => ({ name: name, value: id}));
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'What department is associated with this role?',
            choices: department
        }
    ])
    .then(newRole => {
        const rtrDpt = newRole.department;
        newData.push(rtrDpt);
        const putDpt = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`
        db.query(putDpt, newData, (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Error'});
                return;
            }
            console.log('A new role has been added! Anything else?');
            createDisplayData();
        });
    });
        });
    });
};


//Function to remove an employee
function removeEmployee() {
    const getEmployees = `SELECT * FROM employee`;
    db.query(getEmployees, (err, data) => {
        const employees = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee will be removed?',
            choices: employees
        }
    ])
    .then(employeeChoice => {
        const delChoice = [employeeChoice.employee];
        const delData = `DELETE FROM employee WHERE employee.id = ?`;
        db.query(delData, delChoice, (err, result) => {
            if (err) {
                res.status(500).json({message: 'There has been an error'});
                return;
            }
            console.log('The employee has been removed. How else can I assist?');
            createDisplayData();
        });
    });
    });
};


//Function to guide user to functions
function validateChoice(choice) {
    if(choice === 'View All Employees') {
        displayEmployees();
    } else if (choice === 'View Departments') {
        displayDepartments();
    } else if (choice === 'View Roles') {
        displayRoles();
    } else if (choice === 'Add an Employee') {
        addEmployee();
    } else if (choice === 'Add a Department') {
        addDepartment();
    } else if (choice === 'Add a Role') {
        addRole();
    } else if (choice === 'Remove an Employee') {
        removeEmployee();
    } else if (choice === 'End Session') {
        console.log("Bye");
        process.exit();
    }
};


//We will set up an initial prompt to direct the users
function createDisplayData () {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What are you looking to do?',
            choices: ["View All Employees", "View Departments", "View Roles", "Add an Employee", "Add a Department", "Add a Role", "Remove an Employee", "End Session"  ],
        }
    ])
    .then(data =>{
        const choice = (data.choice);
        console.log(choice)
        validateChoice(choice)
    })
}

//Call the initial prompt
createDisplayData();
