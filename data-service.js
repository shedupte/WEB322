//const fs = require('fs');
var exports = module.exports = {};
const Sequelize = require('sequelize');
var sequelize = new Sequelize('dbdaomepskjg5s', 'kpglrjcqgsdvcf', 'ee286f6f3abd58d8e46367227dbfe95c74b041bbbef874bfe6d96e5b5ef6334d', {
  host: 'ec2-54-225-129-101.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: true
  }
});

var Employee = sequelize.define('Employee', {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  last_name: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  martialStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});


//let employees_file = 'data/employees.json';
//let department_file = 'data/departments.json';


//arrays
//var employee_Array = [];
//var department_Array = [];
//********************Part3 Adding Employee********************
exports.addEmployee = (employeeData) => {
  return new Promise(function (resolve, reject) {
    employeeData.isManager(employeeData.isManager) ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    Employee.create({ where: { employeeData: employeeNum } })//********************* */
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))

  });
}

exports.getAllEmployees = () => {
  return new Promise(function (resolve, reject) {
    Employee.findAll()
      .then(() => resolve(employees))
      .catch(() => reject("no results returned"))
  });
}

//*****PART 5 Updating "data- service.js" to support the new Employee routes */
exports.getEmployeesByStatus = (status) => {
  return new Promise(function (resolve, reject) {
    Employee.findAll({ where: { status: status } })
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))

  });
}

exports.getEmployeesByDepartment = (department) => {
  return new Promise(function (resolve, reject) {
    Employee.findAll({ where: { department: department } })
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))
  });
}

exports.getEmployeesByManager = (manager) => {
  return new Promise(function (resolve, reject) {
    Employee.findAll({ where: { employeeManagerNum: manager } })
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))
  });
}

exports.getEmployeesByNum = (num) => {
  return new Promise(function (resolve, reject) {
    Employee.findAll({ where: { employeeNum: num } })
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))
  });
}

exports.getEmployees = () => {/////************************************* */
  return new Promise(function (resolve, reject) {
    Employee.findAll({ where: { status: status } })
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))
  });
}

exports.updateEmployee = (employeeData) => {
  return new Promise(function (resolve, reject) {
    employeeData.isManager(employeeData.isManager) ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    Employee.update({ where: { employeeData: employeeNum } })//**********************/
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))

  });
}

exports.deleteEmployeeByNum = employeeNum => {
  return new Promise((resolve, reject) => {
    Employee.destory({ where: { employeeNum: employeeNum } })
      .then(data => resolve("Deleted"))
      .catch(err => reject(err))
  });
}

exports.getManagers = () => {
  return new Promise(function (resolve, reject) {
    Employee.findAll({ where: { isManager: true } })
      .then((employees) => resolve(employees))
      .catch(() => reject("no results returned"))
  });
}

exports.getDepartments = () => {
  return new Promise(function (resolve, reject) {
    Department.findAll()
      .then(data => {
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

// let readFiles = new Promise((resolve, reject) => {
//   fs.readFile(employees_file, (err, data) => {
//     if (err) reject('Unable to read file');
//     employee_Array = JSON.parse(data);
//     fs.readFile(department_file, (err, data) => {
//       if (err) reject('Unable to read file');
//       department_Array = JSON.parse(data);
//       resolve('Read File Succesfully');
//     });
//   });
// });

exports.addDepartment = (departmentData) => {
  return new Promise(function (resolve, reject) {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    department.create({ where: { departmentData: departmentID } })//********************* */
      .then((department) => resolve(department))
      .catch(() => reject("Unable to create department"))

  });
}

exports.updateDepartment = (departmentData) => {
  return new Promise(function (resolve, reject) {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    department.update({ departmentName: departmentDate.departmentName },
      { where: { departmentId: deaprtmentDate.departmentID } })//********************* */
      .then((department) => resolve(department))
      .catch(() => reject("Unable to update department"))

  });
}

exports.getDepartmentById = (id) => {
  return new Promise(function (resolve, reject) {
    department.findAll({ where: { departmentId: id } })
      .then((department) => resolve(department))
      .catch(() => reject("no results returned"))
  });
}

exports.initialize = () => {
  return new Promise(function (resolve, reject) {
    sequelize.sync()
      .then(() => resolve("success")
        .catch(() => reject("unable to sync the database")))
  });
}