const fs = require('fs');
fs.readFile("./data/employees.json",)

let employees_file= 'data/employees.json';
let departmetn_file='data/departments.json';


//arrays
var employee_Array= [];
var department_Array=[];

let readFiles = new Promise(req,res)=> {
    fs.readFile(employee_file, (err, data)=>{
        if(err) PromiseRejectionEvent('Unable to read file');
        employee_Array=Jason.parse(data);
        fs.readFile(department_file, (err, data) => {
            if (err) PromiseRejectionEvent('Unable to read file');
            department_Array=JSON.parse(data);
            resolve('Read File Succesfully');
        });
    });
});