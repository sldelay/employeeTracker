const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root1234",
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    promptUser();
});

function promptUser() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add a new role",
                "Add a new department",
                "Add a new employee",
                "View all employees",
                "View all departments",
                "View all roles",
                "Update an employees role"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "Add a new role":
                    addRole();
                    break;

                case "Add a new department":
                    addDepartment();
                    break;

                case "Add a new employee":
                    addEmployee();
                    break;

                case "View all employees":
                    viewEmployees();
                    break;

                case "View all departments":
                    viewDepartments();
                    break;

                case "View all roles":
                    viewRoles();
                    break;

                case "Update an employees role":
                    updateRole();
                    break;

                case "Update an employees manager":
                    updateManager();
                    break;
            }
        });
}

function addDepartment() {
    inquirer.prompt([
        {
            message: "Please input the name of the department you wish to add.",
            type: "input",
            name: "department"
        }
    ]).then(function (answer) {
        let newDepartment = answer.department;

        connection.query("INSERT INTO department (name) VALUES (?)", [newDepartment], function (err, res) {
            if (err) throw err;

            console.log(`${newDepartment} successfully added!`);
            promptUser();
        });
    });
};

function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([
            {
                message: "Please input the title of the new role.",
                type: "input",
                name: "title"
            },
            {
                message: "What salary will be assigned to this role?",
                type: "input",
                name: "salary"
            },
            {
                message: "Please input the appropriate department ID listed above.",
                type: "input",
                name: "department"
            }
        ]).then(function (answer) {
            let title = answer.title;
            let salary = answer.salary;
            let department = answer.department;

            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [title, salary, department], function (err, res) {
                if (err) throw err;

                console.log(`New role for ${title} successfully added!`);
                promptUser();
            });
        });
    });
};

function addEmployee() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);

        connection.query("SELECT * FROM role", function (err, res) {
            if (err) throw err;
            console.table(res);

            connection.query("SELECT * FROM employee", function (err, res) {
                if (err) throw err;
                console.table(res);

                inquirer.prompt([
                    {
                        message: "What is the employees first name?",
                        type: "input",
                        name: "firstname"
                    },
                    {
                        message: "What is the employees last name?",
                        type: "input",
                        name: "lastname"
                    },
                    {
                        message: "Input the employees role id.",
                        type: "input",
                        name: "role"
                    },
                    {
                        message: "Input the id of this employees manager or 0 if no manager applys.",
                        type: "input",
                        name: "manager"
                    },
                ]).then(function (answer) {
                    let firstname = answer.firstname;
                    let lastname = answer.lastname;
                    let role = answer.role;
                    let manager;
                    if (answer.manager === '') {
                        manager = null
                    } else {
                        manager = answer.manager;
                    }

                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstname, lastname, role, manager], function (err, res) {
                        if (err) throw err;

                        console.log(`${firstname} ${lastname} successfully added!`);
                        promptUser();
                    });
                });
            });
        });
    });
};

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
};

function updateRole() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);

        connection.query("SELECT * FROM role", function (err, res) {
            if (err) throw err;
            console.table(res);

            inquirer.prompt([
                {
                    message: "What is the id for the employee you wish to update?",
                    type: "input",
                    name: "id"
                },
                {
                    message: "What is the id of the new role you would like to assign?",
                    type: "input",
                    name: "role"
                }
            ]).then(function (answer) {
                let id = answer.id;
                let role = answer.role;

                connection.query("UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: role
                        },
                        {
                            id: id
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;

                        console.log("Employee has been updated!");
                        promptUser();
                    }
                );
            });
        });
    });
};

function updateManager() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);

        inquirer.prompt([
            {
                message: "What is the id for the employee you wish to update?",
                type: "input",
                name: "id"
            },
            {
                message: "What is the id of the new manager you would like to assign?",
                type: "input",
                name: "manager"
            }
        ]).then(function (answer) {
            let id = answer.id;
            let manager = answer.manager;

            connection.query("UPDATE employee SET ? WHERE ?",
                [
                    {
                        manager_id: manager
                    },
                    {
                        id: id
                    }
                ],
                function (err, res) {
                    if (err) throw err;

                    console.log("Employee has been updated!");
                    promptUser();
                }
            );
        });
    });
};
