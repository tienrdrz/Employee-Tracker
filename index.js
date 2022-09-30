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
    let sql = `SELECT * FROM deparments`;

    createDisplayData();
};

//Function to display all roles
function displayRoles() {
    let sql = `SELECT * FROM role`;

    createDisplayData();
};

//Function to add an employee
function addEmployee() {

    inquirer.createPromptModule([
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
            inquirer.createPromptModule([
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
                    inquirer.createPromptModule([
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



//Function to add a role



//Function to remove an employee
function removeEmployee() {
    const getEmployees = `SELECT * FROM employee`;
    db.query(getEmployees, (err, data) => {
        const employees = data.map(({id, first_name, last_name}) => ({name: first_name + '' + last_name, value: id}));
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

//We will set up an initial prompt to direct the user
function createDisplayData () {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'choice',
            message: 'What are you looking to do?',
            choices: ["View All Employees", "View Departments", "View Roles", "Add an Employee", "Add a Department", "Add a Role", "Remove an Employee", "End Session"  ]
        }
    ])
    .then(data =>{
        const choice = JSON.stringify(data.choice);
        validateChoice(choice)
    })
};

//Call the initial prompt
createDisplayData();