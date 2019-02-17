const fs = require('fs');
var exports = module.exports = {};

let employees_file= 'data/employees.json';
let department_file='data/departments.json';


//arrays
var employee_Array= [];
var department_Array=[];
//********************Part3 Adding Employee********************
exports.addEmployee=(employeeData) =>{
    return new Promise((resolve,reject) => {
    if (!employeeData.isManager){
        employeeData.isManager=false;
    }
    else{
        employeeData.isManager=true;
    }
    employeeData.employeeNum= employee_Array.length + 1;
    employee_Array.push(employeeData);

    resolve('New Employee Added');
});
}
//*****PART 5 Updating "data- service.js" to support the new Employee routes */
exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        console.log('getEmployeesByStatus: ${status}');
        let emp = employee_Array.filter(employee=>{
            if(status.localCompare(employee.status)==0)
            return employee;
        });
        if (emp.length>0) resolve(emp);
        else reject('No results returned');
    });
}

exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        console.log('getEmployeesByDepartmetn: ${department}');
        let emp = employee_Array.filter(employee=>{
            if(department.localCompare(employee.department)==0)
            return employee;
        });
        if (emp.length>0) resolve(emp);
        else reject('No results returned');
    });
}

exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        console.log('getEmployeesByManager: ${Manager}');
        let emp = employee_Array.filter(employee=>{
            if(manager.localCompare(employee.Manager)==0)
            return employee;
        });
        if (emp.length>0) resolve(emp);
        else reject('No results returned');
    });
}

exports.getEmployeesByNum = (num) => {
    return new Promise((resolve, reject) => {
        console.log('getEmployeesByNum: ${num}');
        let emp = employee_Array.filter(employee=> employee.employeeNum == num);
        if (emp.length>0) resolve(emp);
        else reject('No results returned');
    });
}

exports.getEmployees = () => {
    return new Promise((resolve, reject) => {
        if (employee_Array.length==0) reject ('No results returned');
        resolve(employee_Array);
    });
}

exports.getManagers= () => {
    return new Promise((resolve, reject) => {
        let managers = employee_Array.filter(employee => employee.isManager == true);
        if (managers == 0) reject('No results returned')
        resolve(managers);
    });
} 

exports.getDepartments = () => {
    return new Promise((resolve,reject)=>{
        if(department_Array.length==0) reject('No results returned');
        resolve(department_Array);
    });
}

let readFiles = new Promise((resolve,reject) => {
    fs.readFile(employees_file, (err, data) => {
        if(err) reject('Unable to read file');
        employee_Array=JSON.parse(data);
        fs.readFile(department_file, (err, data) => {
            if (err) reject('Unable to read file');
            department_Array=JSON.parse(data);
            resolve('Read File Succesfully');
        });
    });
});

exports.initialize = () => {
    return readFiles;
} 