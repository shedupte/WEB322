/************************************************************************
*********
*  WEB322 
–Assignment02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Tenzin Shedup__ Student ID: __120664180____ Date: ___02/02/19______
*
*  Online (Heroku) Link: _____https://quiet-mesa-75926.herokuapp.com/_______
*
********************************************************************************/ 


var express = require("express");
var multer= require("multer");
var bodyParser = require("body-parser");
const fs = require('fs');
var app = express();//***Part 3 Step 3*** 
var path = require("path");
var data_Service= require("./data-service");

var HTTP_PORT = process.env.PORT || 8080;

//Part 3: Adding Routes/ middleware to support adding employees**********
app.use(bodyParser.urlencoded({extended: true}));

app.post('/employees/add', (req, res) => { ///step 2****
   let employeeToAdd= req.body;
   data_Service.addEmployee(employeeToAdd)
      .then(()=> res.redirect('/employees'));
 });

app.get('/employee/:value', (req,res)=>{
   data_Service.getEmployeesByNum(req.params.value)
   .then(employees=> res.json(employees))
   .catch(err => console.log(err));
});

app.get('.employee', (req,res)=>{
   
   if(req.query.status){
      data_Service.getEmployeeByStatus(req.query.status)
     .then(employees => res.json(employees))
     .catch(err => console.log(err));
   }
   else if(req.query.department){
      data_Service.getEmployeeByDepartment(req.query.department)
     .then(employees => res.json(employees))
     .catch(err => console.log(err));
   }
   else if(req.query.manager){
      data_Service.getEmployeeByManager(req.query.manager)
     .then(employees => res.json(employees))
     .catch(err => console.log(err));
   }
   else{
      data_Service.getAllEmployees()
      .then(data => res.json(data))
      .catch(err => res.log({message: err}))
   }

});
//Part 2 Adding Routes/ Middleware to Support Image Uploads
const storage = multer.diskStorage({
   destination: "./public/images/uploaded",
   filename: function (req, file, cb) {
     // we write the filename as the current date down to the millisecond
     // in a large web service this would possibly cause a problem if two people
     // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
     // this is a simple example.
     cb(null, Date.now() + path.extname(file.originalname));
   }
 });
 
 // tell multer to use the diskStorage function for naming files instead of the default.
 const upload = multer({ storage: storage });

 app.post('/images/add',upload.single("imageFile"), (req, res,next) => { ///step 2****
   res.redirect('/images');
 });
//multer funciton added end******* Part 2 Step 1

app.get('/images',(req,res)=> {//*********/step 3***************
   fs.readdir('../public/images/uploaded', (err, files)=> {
      res.json({
         images: files
      });
   });
});

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
   res.sendFile(path.join(__dirname, "views/home.html"));
});



// setup another route to listen on /about
app.get("/about", function(req,res){
   res.sendFile(path.join(__dirname, "views/about.html"));
});

// setup another route to listen on /views/addemployee***
app.get("/employees/add", function(req,res){
   res.sendFile(path.join(__dirname, "views/addEmployee.html"));
});

// setup another route to listen on /addimage***
app.get("/images/add", function(req,res){
   res.sendFile(path.join(__dirname, "views/addImage.html"));
});


app.get("/employees", function(req,res){
   data_Service.getEmployees()
   .then(data => res.json(data))
   .catch(err => res.json({message: err})) // employees
});


app.get("/managers", function(req,res){
   data_Service.getManagers()
   .then(data => res.json(data))//Managers
   .catch(err => res.json({message: err}))
});


app.get("/departments", function(req,res){
   data_Service.getDepartments()
   .then(data => res.json(data))//departments
   .catch(err => res.json({message: err}))
});


app.get('*', function(req, res){
   res.send('Page not found 404', 404);
});
// add response for no matching routes


// setup http server to listen on HTTP_PORT
data_Service.initialize()
.then(() => app.listen(HTTP_PORT, () => console.log (`Listening on port ${HTTP_PORT}`)))
.catch(err => console.log ({message: err}))