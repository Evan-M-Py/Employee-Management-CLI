const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "empTrackerDB"
});

  let welcome = `
  .%%%%%%..%%...%%..%%%%%...%%.......%%%%...%%..%%..%%%%%%..%%%%%%..........%%...%%...%%%%...%%..%%...%%%%....%%%%...%%%%%%..%%...%%..%%%%%%..%%..%%..%%%%%%.
  .%%......%%%.%%%..%%..%%..%%......%%..%%...%%%%...%%......%%..............%%%.%%%..%%..%%..%%%.%%..%%..%%..%%......%%......%%%.%%%..%%......%%%.%%....%%...
  .%%%%....%%.%.%%..%%%%%...%%......%%..%%....%%....%%%%....%%%%....%%%%%%..%%.%.%%..%%%%%%..%%.%%%..%%%%%%..%%.%%%..%%%%....%%.%.%%..%%%%....%%.%%%....%%...
  .%%......%%...%%..%%......%%......%%..%%....%%....%%......%%..............%%...%%..%%..%%..%%..%%..%%..%%..%%..%%..%%......%%...%%..%%......%%..%%....%%...
  .%%%%%%..%%...%%..%%......%%%%%%...%%%%.....%%....%%%%%%..%%%%%%..........%%...%%..%%..%%..%%..%%..%%..%%...%%%%...%%%%%%..%%...%%..%%%%%%..%%..%%....%%...
  ...........................................................................................................................................................
  ..%%%%...%%..%%..%%%%%............%%%%...%%%%%....%%%%....%%%%...%%..%%..%%%%%%..%%%%%%..%%%%%%..%%%%%..                                                   
  .%%..%%..%%%.%%..%%..%%..........%%..%%..%%..%%..%%......%%..%%..%%%.%%....%%.......%%...%%......%%..%%.                                                   
  .%%%%%%..%%.%%%..%%..%%..........%%..%%..%%%%%...%%.%%%..%%%%%%..%%.%%%....%%......%%....%%%%....%%%%%..                                                   
  .%%..%%..%%..%%..%%..%%..........%%..%%..%%..%%..%%..%%..%%..%%..%%..%%....%%.....%%.....%%......%%..%%.                                                   
  .%%..%%..%%..%%..%%%%%............%%%%...%%..%%...%%%%...%%..%%..%%..%%..%%%%%%..%%%%%%..%%%%%%..%%..%%.                                                   
  ........................................................................................................                                                   
  ..%%%%...%%......%%%%%%.                                                                                                                                   
  .%%..%%..%%........%%...                                                                                                                                   
  .%%......%%........%%...                                                                                                                                   
  .%%..%%..%%........%%...                                                                                                                                   
  ..%%%%...%%%%%%..%%%%%%.                                                                                                                                   
  ........................ 
    `
connection.connect(function(err) {
    if (err) throw err;
    initApp();
    console.log('your connected!')
  });

// -------------------------------------INITIALIZE APP----------------------------------------------------------------

function initApp() {

    console.log(welcome);

    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add departments, roles, employees",
        "View departments, roles, employee",
        "Update employee roles",
        "View All",
        "exit"
      ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "Add departments, roles, employees":
                addThing();
                break;
        
              case "View departments, roles, employee":
                viewThing();
                break;
        
              case "Update employee roles":
                updateEmployee();
                break;
        
              case "view All":
                viewAll();
                break;
        
              case "exit":
                connection.end();
                break;          
        }
    });
};

// -----------------------------------ADDING STUFF------------------------------------------------------

function addThing() {
  inquirer
    .prompt({
      name: "addAction",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add departments",
        "Add roles",
        "Add employee",
        "exit"
      ]
    })
    .then(function(answer) {
        switch (answer.addAction) {
          case "Add departments":
            addDepartment();
            break;
        
          case "Add roles":
            addRoles();
            break;
        
          case "Add employee":
            addEmployee();
            break;

          case "exit":
            connection.end();
            break;          
        }
    });


  function addEmployee() {

      inquirer
          .prompt([
              {
                  name: "firstName",
                  type: "input",
                  message: "Enter your first name:"
              },
              {
                  name: "lastName",
                  type: "input",
                  message: "Enter your last name:"
              },
              {
                  name: "roleId",
                  type: "number",
                  message: "Enter your 'Role ID'':"
              },
              {
                  name: "managerId",
                  type: "number",
                  message: "Enter your 'Manager ID'':"
              }])
          .then(function (data) {
              if ((data.roleID && data.managerId) === NaN) {
                  return ("err 'Role ID'  & 'Manager ID' must be a number")
              } else {
                  console.log("Inserting a new employee...\n");
                  const query = connection.query(
                      "INSERT INTO employee SET ?",
                      {
                          first_name: data.firstName,
                          last_name: data.lastName,
                          role_id: data.roleId,
                          manager_id: data.managerId
                      },
                      function (err, res) {
                          if (err) throw err;
                          console.log(res.affectedRows + " Employee added to the team!\n");
                          initApp();
                          // Call updateProduct AFTER the INSERT completes
                          // updateProduct();
                      });
              }
          });
  };

  function addRoles() {
      inquirer
          .prompt([
              {
                  name: 'roleTitle',
                  type: 'input',
                  message: 'Enter new role:'
              },
              {
                  name: 'salary',
                  type: 'number',
                  message: 'Enter salary amount:'
              },
              {
                  name: 'department',
                  type: 'input',
                  message: 'Enter depertment'
              }
          ]).then(function (data) {
              if (data.salary === NaN) {
                  return ('salary must be a number!')
              } else {
                  console.log("Inserting a new role...\n");
                  const query = connection.query(
                      "INSERT INTO role SET ?",
                      {
                          title: data.roleTitle,
                          salary: data.salary,
                          department: data.department
                      },
                      function (err, res) {
                          if (err) throw err;
                          console.log(res.affectedRows + " Role added to the Team!\n");
                          initApp();
                          // Call updateProduct AFTER the INSERT completes
                          // updateProduct();
                      })
              }
          })
  };

  function addDepartment() {
      inquirer
          .prompt([
              {
                  name: 'department',
                  type: 'input',
                  message: 'Enter new department:'
              }
          ]).then(function (data) {
              if (data.department === NaN) {
                  return ('Department cant be a number or symbol!')
              } else {
                  console.log("Inserting a new department...\n");
                  const query = connection.query(
                      "INSERT INTO department SET ?",
                      {
                          name: data.department
                      },
                      function (err, res) {
                          if (err) throw err;
                          console.log(res.affectedRows + " department added to the list!\n");
                          initApp();
                          // Call updateProduct AFTER the INSERT completes
                          // updateProduct();
                      })
              };
          })
  };
};

// ------------------------------------VIEWING STUFF----------------------------------------------
function viewThing() {


  inquirer
    .prompt({
      name: "viewAction",
      type: "list",
      message: "What would you like View?",
      choices: [
        "View departments", "View roles", "View employees",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.viewAction) {
        case "View departments":
          viewDepartments();
          break;
      
        case "View roles":
          viewRoles();
          break;
      
        case "View employees":
          viewEmployee();
          break;

        case "exit":
          connection.end();
          break;          
      }
  });

  function viewDepartments() {
    connection.query("SELECT name FROM department", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.table(res);
      initApp();
    });
  };

  function viewRoles() {
    connection.query("SELECT title FROM role", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.table(res);
      initApp();
    });

  };

  function viewEmployee() {
    inquirer
    .prompt({
      name: "employeeChoice",
      type: "list",
      message: "Please choose from the following:",
      choices: [
        "View all employees", "View specific employee",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.employeeChoice) {
        case "View all employees":
          viewAllEmp();
          break;
      
        case "View specific employee":
          viewSingleEmp();
          break;
    
        case "exit":
          connection.end();
          break;          
      };
    });
      
function viewAllEmp() {
    connection.query("SELECT * FROM employee ", function(err, res) {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.table(res);
      initApp();
    });
  };

function viewSingleEmp() {
  connection.query("SELECT first_name,last_name FROM employee ", function(err, res) {
    if (err) throw err;
    inquirer
    .prompt({
      name: "employeeChoice",
      type: "list",
      message: "Which Employee would you like to chose??",
      choices: () => {
        const empArray = [];
        for (let i = 0; i < res.length; i++) {
          empArray.push(`${res[i].first_name} ${res[i].last_name}`);
        }
        return empArray;
      }
    }).then(function(answer) {
      string_to_array = function (str) {
        return str.trim().split(" ");
      };
      const nameArray = string_to_array(answer.employeeChoice);
      connection.query("SELECT * FROM employee WHERE ?", {first_Name: nameArray[0].trim()}, function(err, res) {
        if (err) throw err;
        console.table(res);
        initApp()
      });
      
      });
    })
  };
};
};


// ---------------------------------------UPDATING EMPLOYEES-----------------------------------------------------------------
function updateEmployee() {
  connection.query("SELECT first_name,last_name FROM employee ", function(err, res) {
    if (err) throw err;
  inquirer
    .prompt([
      {
        name: "employeeChoice",
        type: "list",
        message: "Which Employee would you like to update?",
        choices: () => {
          const empArray = [];
          for (let i = 0; i < res.length; i++) {
            empArray.push(`${res[i].first_name} ${res[i].last_name}`);
          }
          return empArray;
        }
      },
      {
        name: "roleUpdate",
        type: "input",
        message: "Please enter this employees new role ID!" 
      }
    ]).then(function (answer) {
      string_to_array = function (str) {
        return str.trim().split(" ");
      };
      const nameArray = string_to_array(answer.employeeChoice);
      const query = connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: answer.roleUpdate
          },
          {
            first_name: nameArray[0]
          }
        ],
        function (err, res) {
          if (err) throw err;
          console.table(res.affectedRows + 'has been updated!');
          initApp()
        });
    });
});
};






