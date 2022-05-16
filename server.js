const inquirer = require("inquirer");
const dbUtil = require("./db/util.js");
const dbQueryUtil = require("./db/util.js");

init();

function init() {
  inquirer
    .prompt({
      type: "list",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Role",
        "Delete Employee",
        "Delete Role",
        "Delete Department",
        "Quit",
      ],
      message: "What would you like to do?",
      name: "option",
    })
    .then((answer) => {
      console.log(answer);
      switch (answer.option) {
        case "View Employees":
          return viewAllEmployees();
        case "View Roles":
          return viewAllRoles();
        case "View Departments":
          return viewAllDepartments();
        case "Add Employee":
          return addEmployee();
        case "Add Role":
          return addRole();
        case "Add Department":
          return addDepartment();
        case "Update Employee Role":
          return updateEmployee();
        case "Delete Employee":
          return deleteEmployee();
        case "Delete Role":
          return deleteRole();
        case "Delete Department":
          return deleteDepartment();
        case "Quit":
          return quit();
      }
    });
}

async function viewAllEmployees() {
  const employees = await dbQueryUtil.getAllEmployees();
  console.table(employees);
  init();
}
async function viewAllRoles() {
  const role = await dbQueryUtil.viewAllRoles();
  console.table(role);
  init();
}
async function viewAllDepartments() {
  const departments = await dbQueryUtil.viewAllDepartments();
  console.table(departments);
  init();
}
async function addDepartment() {
  const department = await inquirer.prompt({
    type: "input",
    message: "What is the name of the department?",
    name: "name",
  });
  await dbQueryUtil.createDepartment(department);
  init();
}
async function addEmployee() {
  const rolesOptions = await dbUtil.viewAllRoles();
  const managerOptions = await dbUtil.getAllEmployees();

  const employeeToAdd = await inquirer.prompt([
    {
      type: "input",
      message: "What's the first name of the employee?",
      name: "first_name",
    },
    {
      type: "input",
      message: "What's the last name of the employee?",
      name: "last_name",
    },
  ]);

  var roleChoicesList = rolesOptions.map(({ id, title }) => ({ name: title, value: id }));
  //console.log("role choicesList", rolesOptions)

  const  {roleId}  = await inquirer.prompt({
    type: "list",
    name: "roleId",
    message: "What is this new employees role?",
    choices: roleChoicesList,
  });

  const managerChoicesList = managerOptions.map(({ first_name, last_name, id }) => ({ name: first_name + last_name, value: id }));
  if (managerChoicesList && managerChoicesList.length > 0){
  const { managerId } = await inquirer.prompt({
    
    type: "list",
    name: "managerId",
    message: "Please select this new employees manager:",
    choices: managerChoicesList,
      
  });
  employeeToAdd.manager_id = managerId;
  }
  
  employeeToAdd.role_id = roleId;
  //employeeToAdd.manager_id = mana÷erId;

  await dbUtil.createEmployee(employeeToAdd);

  init();
}
async function addRole() {
  const departments = await dbQueryUtil.viewAllDepartments();
  const departmentsList = departments.map(({ id, name }) => ({ name: name, value: id }));

  const roleToAdd = await inquirer.prompt([
    {
      type: "input",
      message: "What's the name of the role?",
      name: "title",
    },
    {
      type: "input",
      message: "What is the salary for this role?",
      name: "salary",
    },
    {
      type: "list",
      message: "What is the department id number?",
      name: "department_id",
      choices: departmentsList,
    },
  ]);

  await dbQueryUtil.addRole(roleToAdd);
  init();
}
async function updateEmployee() {
  const employeeOptions = await dbUtil.getAllEmployees();

  const rolesOptions = await dbUtil.viewAllRoles();
  console.log(rolesOptions);

  const employeeOptionsToChooseFrom = employeeOptions.map(({ id, first_name, last_name }) => ({
    name: first_name + last_name,
    value: id,
  }));

  const rolesOptionsToChooseFrom = rolesOptions.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { employeeId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Select the employee whose role you wish to change:",
      choices: employeeOptionsToChooseFrom,
    },
  ]);

  const { roleId } = await inquirer.prompt([
    {
      type: "list",
      name: "roleId",
      message: "What new role would you like to assign to this employee?",
      choices: rolesOptionsToChooseFrom,
    },
  ]);

  await dbUtil.updateEmployeeRole(employeeId, roleId);
  init();
}
async function deleteEmployee() {
  const employeeOptions = await dbUtil.getAllEmployees();

  const employeeOptionsToChooseFrom = employeeOptions.map(({ id, first_name, last_name }) => ({
    name: first_name + last_name,
    value: id,
  }));

  const { employeeId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to delete?",
      choices: employeeOptionsToChooseFrom,
    },
  ]);
  await dbUtil.removeEmployee(employeeId);
  init();
}

async function deleteRole() {
  const rolesOptions = await dbUtil.viewAllRoles();

  const rolesOptionsToChooseFrom = rolesOptions.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await inquirer.prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role would you like to delete?",
      choices: rolesOptionsToChooseFrom,
    },
  ]);

  await dbUtil.removeRole(roleId);
  init();
}

async function deleteDepartment() {
  const departmentOptions = await dbUtil.viewAllDepartments();

  const departmentOptionsToChooseFrom = departmentOptions.map(({ id, name }) => ({ name: name, value: id }));

  const { departmentId } = await inquirer.prompt({
    type: "list",
    name: "departmentId",
    message: "Which department would you like to delete?",
    choices: departmentOptionsToChooseFrom,
  });
  await dbUtil.removeDepartment(departmentId);
  init();
}
function quit() {
  process.exit();
}
