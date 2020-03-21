const mysql = require("mysql");
const inquirer = require("inquirer");

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
    ]).then(function(answer) {
        let newDepartment = answer.department;

        connection.query("INSERT INTO department (name) VALUES (?)", [newDepartment], function (err, res) {
            if (err) throw err;

            console.log(`${newDepartment} successfully added!`);
            promptUser();
        });
    });
};
