const fs = require('fs');

var exports = modules.exports = {}

let employees_file= 'data/employees.json';
let departmetn_file='data/departments.json';


//arrays
var employee_Array= [];
var department_Array=[];


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
    fs.readFile(employee_file, (err, data) => {
        if(err) reject('Unable to read file');
        employee_Array=Jason.parse(data);
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