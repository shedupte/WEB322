/*********************************************************************************
*  WEB322 – Assignment02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Tenzin Shedup__ Student ID: __120664180____ Date: ___03/29/19______
*
*  Online (Heroku) Link: _____https://quiet-mesa-75926.herokuapp.com/_______
*
********************************************************************************/

const exphbs = require('express-handlebars');
var express = require("express");
var multer = require("multer");
var bodyParser = require("body-parser");
const fs = require('fs');
var app = express();//***Part 3 Step 3*** 
var path = require("path");
var data_Service = require("./data-service");

var PORT = process.env.PORT || 8080;

//Part 4: Getting express Handlebars & Updating your views
app.engine('.hbs', exphbs({
   defaultLayout: 'main',
   extname: '.hbs',
   helpers: {
      navLink: function (url, options) {
         return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      equal: function (lvalue, rvalue, options) {
         if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
         if (lvalue != rvalue) {
            return options.inverse(this);
         } else {
            return options.fn(this);
         }
      }
   }
}));
app.set('view engine', '.hbs');

//Part 3: Adding Routes/ middleware to support adding employees**********
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
   let route = req.baseUrl + req.path;
   app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
   next();
});
//*********MODIFY THIS FOR A5********/
app.post('/employees/add', (req, res) => { ///step 2****
   let employeeToAdd = req.body;
   data_Service.addEmployee(employeeToAdd)
      .then(() => res.redirect('/employees'));
});

//*********Double check if THIS FOR A5********/

app.get("/employee/:empNum", (req, res) => {
   // initialize an empty object to store the values
   let viewData = {};
   dataService.getEmployeeByNum(req.params.empNum)
      .then((data) => {
         viewData.data = data; //store employee data in the "viewData" object as "data"
      }).catch(() => {
         viewData.data = null; // set employee to null if there was an error
      }).then(dataService.getDepartments)
      .then((data) => {
         viewData.departments = data; // store department data in the "viewData" object as "departments"
         // loop through viewData.departments and once we have found the departmentId that matches
         // the employee's "department" value, add a "selected" property to the matching
         // viewData.departments object
         for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data.department) {
               viewData.departments[i].selected = true;
            }
         }
      }).catch(() => {
         viewData.departments = []; // set departments to empty if there was an error
      }).then(() => {
         if (viewData.data == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
         } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
         }
      });
});

app.post("/employee/update", (req, res) => {
   console.log(req.body);
   data_Service.updateEmployee(req.body)
      .then(() => res.redirect('/employees'))
      .catch(err => console.log(err))
});

app.get('/employees', (req, res) => {
   if (req.query.status)
      data_Service.getEmployeesByStatus(req.query.status)
         .then(employees => res.render('employees', { data: employees }))
         .catch(err => res.render({ message: err }));
   else if (req.query.department)
      data_Service.getEmployeesByDepartment(req.query.department)
         .then(employees => res.render('employees', { data: employees }))
   //   .catch(err => res.render({ message: err }));
   else if (req.query.manager)
      data_Service.getEmployeesByManager(req.query.manager)
         .then(employees => res.render('employees', { data: employees }))
         .catch(err => res.render({ message: err }));
   else
      data_Service.getAllEmployees()
         .then(data => res.render('employees', { data: data }))
         .catch(err => res.json({ message: err }))

});

app.get('/employees/delete/:empNum', (req, res) => {
   data_Service.deleteEmployeeByNum(req.params.empNum)
     .then(data => res.redirect('/employees'))
     .catch(err => {
         console.log(err)
         res.status(500).send(err)
     })
 })


//Part 2 Adding Routes/ Middleware to Support Image Uploads
const storage = multer.diskStorage({
   destination: "app/public/images/uploaded",
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

app.post('/images/add', upload.single('imageFile'), (req, res, next) => { ///step 2****
   res.redirect('/images');
});
//multer funciton added end******* Part 2 Step 1

app.get('/images', (req, res) => {//*********/step 3***************
   fs.readdir('public/images/uploaded', (err, files) => {
      if (err)
         throw err;
      else
         res.render('images', { data: files });
   });
});

// call this function after the http server starts listening for requests
function onHttpStart() {
   console.log("Express http server listening on: " + PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
   res.render("home");// step 2 double check this step
});

// setup another route to listen on /about
app.get("/about", function (req, res) { //step 3 updating html to hbs
   res.render("about");
});

// setup another route to listen on /views/addemployee***
app.get("/employees/add", function (req, res) {
   res.render("addEmployee");
});

// setup another route to listen on /addimage***
app.get("/images/add", function (req, res) {
   res.render("addImage");
});


app.get("/employees", function (req, res) {
   data_Service.getEmployees()
      .then(data => res.render('employees', { data: data }))
      .catch(err => res.render({ message: err })) // employees
});


// app.get("/managers", function (req, res) {
//    data_Service.getManagers()
//       .then(data => res.json(data))//Managers
//       .catch(err => res.json({ message: err }))
// });


app.get("/departments", function (req, res) {
   data_Service.getDepartments()
      .then(data => res.render('departmentList', { departments: data }))
      .catch(err => res.render({ message: err }))
});

// add response for no matching routes

app.get("/departments/add", function (req, res) {
   res.render("addDepartment");
});

app.post('/departments/add', (req, res) => { ///step 2****
   let departmentToAdd = req.body;
   data_Service.addDepartment(departmentToAdd)
      .then(() => res.redirect('/departments'));
});

app.post("/departments/update", (req, res) => {
   console.log(req.body);
   data_Service.updateDepartment(req.body)
      .then(() => res.redirect('/departments'))
      .catch(err => console.log(err))
});

//@@@@@@@@@@@ Double check this @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/departments/:departmentId', (req, res) => {
   data_Service.getEmployeesById(req.params.value)
      .then(departments => res.render('department', { department: departments }))
      .catch(err => res.render('department', { message: 'Department Not Found' }));
});
app.get('*', function (req, res) {
   res.status(404).send("page not found");
});

data_Service.initialize()
    .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
      .catch(err => res.json({ message: err}))