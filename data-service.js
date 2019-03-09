const fs = require('fs');

const { exports } = module;

const employeesJSON = 'data/employees.json';
const departmentsJSON = 'data/departments.json';


// arrays
const employeesArr = [];
const departmentsArr = [];
//* *******************Part3 Adding Employee********************
exports.addEmployee = employeeData => new Promise((resolve, reject) => {
  if (!employeeData.isManager) {
    employeeData.isManager = false;
  } else {
    employeeData.isManager = true;
  }
  employeeData.employeeNum = employeesArr.length + 1;
  employeesArr.push(employeeData);

  resolve('New Employee Added');
});

exports.getAllEmployees = () => {new Promise((resolve, reject) => {
  if (employeesArr.length === 0) 
    reject(new Error('No results returned'))
  resolve(employeesArr);
});

//* ****PART 5 Updating "data- service.js" to support the new Employee routes */
exports.getEmployeesByStatus = (status) => {
  return new Promise((resolve, reject) => {
    console.log(`getEmployeesByStatus: ${status}`);
    const emp = employeesArr.filter((employee) => {
      if (status.localeCompare(employee.status) == 0) 
        return employee
    });
    if (emp.length > 0) resolve(emp);
    else reject('No results returned');
  });
};

exports.getEmployeesByDepartment = department => new Promise((resolve, reject) => {
  console.log(`getEmployeesByDepartment: ${department}`);
  const emp = employeesArr.filter((employee) => {
    if (department.localeCompare(employee.department) == 0) { return employee; }
  });
  if (emp.length > 0) { resolve(emp); } else { reject('No results returned'); }
});

exports.getEmployeesByManager = manager => new Promise((resolve, reject) => {
  console.log('getEmployeesByManager: ${Manager}');
  const emp = employeesArr.filter((employee) => {
    if (manager.localeCompare(employee.Manager) == 0) { return employee; }
  });
  if (emp.length > 0) resolve(emp);
  else reject('No results returned');
});

exports.getEmployeesByNum = num => new Promise((resolve, reject) => {
  console.log('getEmployeesByNum: ${num}');
  const emp = employeesArr.filter(employee => employee.employeeNum == num);
  if (emp.length > 0) resolve(emp[0]);
  else reject('No results returned');
});

exports.getEmployees = () => new Promise((resolve, reject) => {
  if (employeesArr.length == 0) reject('No results returned');
  resolve(employeesArr);
});

exports.updateEmployee = employeeData => new Promise((resolve, reject) => {
  for (let i = 0; i < employeesArr.length; i++) {
    if (employeesArr[i].SSN == employeeData.SSN) {
      employeeData.employeeNum = employeesArr[i].employeeNum;
      employeesArr[i] = employeeData;
      resolve('Updated');
      break;
    }
  }
});

exports.getManagers = () => new Promise((resolve, reject) => {
  const managers = employeesArr.filter(employee => employee.isManager == true);
  if (managers == 0) reject('No results returned');
  resolve(managers);
});

exports.getDepartments = () => new Promise((resolve, reject) => {
  if (department_Array.length == 0) reject('No results returned');
  resolve(department_Array);
});

const readFiles = new Promise((resolve, reject) => {
  fs.readFile(employees_file, (err, data) => {
    if (err) reject('Unable to read file');
    employeesArr = JSON.parse(data);
    fs.readFile(department_file, (err, data) => {
      if (err) reject('Unable to read file');
      department_Array = JSON.parse(data);
      resolve('Read File Succesfully');
    });
  });
});

exports.initialize = () => readFiles;
