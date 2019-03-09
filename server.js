/** *******************************************************************************
*  WEB322 – Assignment02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: ___Tenzin Shedup__ Student ID: __120664180____ Date: ___03/08/19______
*
*  Online (Heroku) Link: _____https://quiet-mesa-75926.herokuapp.com/_______
*
******************************************************************************* */

const exphbs = require('express-handlebars');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();//* **Part 3 Step 3***
const path = require('path');
const dataService = require('./data-service');

const HTTP_PORT = process.env.PORT || 8080;

// Part 4: Getting express Handlebars & Updating your views
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    navLink(url, options) {
      return `<li${
        (url === app.locals.activeRoute) ? ' class="active" ' : ''
      }><a href="${url}">${options.fn(this)}</a></li>`;
    },
    equal(lvalue, rvalue, options) {
      if (arguments.length < 3) { throw new Error('Handlebars Helper equal needs 2 parameters'); }
      if (lvalue !== rvalue) {
        return options.inverse(this);
      }
      return options.fn(this);
    },
  },
}));
app.set('view engine', '.hbs');

// Part 3: Adding Routes/ middleware to support adding employees**********
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const route = req.baseUrl + req.path;
  app.locals.activeRoute = (route === '/') ? '/' : route.replace(/\/$/, '');
  next();
});

app.post('/employees/add', (req, res) => { // /step 2****
  const employeeToAdd = req.body;
  dataService.addEmployee(employeeToAdd)
    .then(() => res.redirect('/employees'));
});

app.get('/employee/:value', (req, res) => {
  dataService.getEmployeesByNum(req.params.value)
    .then(employees => res.render('employee', { employee: employees }))
    .catch(err => res.render('employee', { message: err }));
});

app.post('/employee/update', (req, res) => {
  dataService.updateEmployee(req.body)
    .then(() => res.redirect('/employees'))
    .catch(err => console.log(err));
});

app.get('/employees', (req, res) => {
  if (req.query.status) {
    dataService.getEmployeesByStatus(req.query.status)
      .then(employees => res.render('employees', { data: employees }))
      .catch(err => res.render({ message: err }));
  } else if (req.query.department) {
    dataService.getEmployeesByDepartment(req.query.department)
      .then(employees => res.render('employees', { data: employees }))
      .catch(err => res.render({ message: err }));
  } else if (req.query.manager) {
    dataService.getEmployeesByManager(req.query.manager)
      .then(employees => res.render('employees', { data: employees }))
      .catch(err => res.render({ message: err }));
  } else {
    dataService.getAllEmployees()
      .then(data => res.render('employees', { data }))
      .catch(err => res.render({ message: err }));
  }
});
// Part 2 Adding Routes/ Middleware to Support Image Uploads
const storage = multer.diskStorage({
  destination: '/public/images/uploaded',
  filename(req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage });

app.post('/images/add', upload.single('imageFile'), (req, res, next) => { // /step 2****
  res.redirect('/images');
});
// multer funciton added end******* Part 2 Step 1

app.get('/images', (req, res) => { //* ********/step 3***************
  fs.readdir('public/images/uploaded', (err, files) => {
    if (err) { throw err; } else { res.render('images', { data: files }); }
  });
});

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log(`Express http server listening on: ${HTTP_PORT}`);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get('/', (req, res) => {
  res.render('home');// step 2 double check this step
});

// setup another route to listen on /about
app.get('/about', (req, res) => { // step 3 updating html to hbs
  res.render('about');
});

// setup another route to listen on /views/addemployee***
app.get('/employees/add', (req, res) => {
  res.render('addEmployee');
});

// setup another route to listen on /addimage***
app.get('/images/add', (req, res) => {
  res.render('addImage');
});


app.get('/employees', (req, res) => {
  dataService.getEmployees()
    .then(data => res.render('employees', { data }))
    .catch(err => res.render({ message: err })); // employees
});


// app.get("/managers", function (req, res) {
//    dataService.getManagers()
//       .then(data => res.json(data))//Managers
//       .catch(err => res.json({ message: err }))
// });


app.get('/departments', (req, res) => {
  dataService.getDepartments()
    .then(data => res.render('departments', { data }))
    .catch(err => res.render({ message: err }));
});


app.get('*', (req, res) => {
  res.status(404).send('page not found');
});
// add response for no matching routes


// setup http server to listen on HTTP_PORT
dataService.initialize()
  .then(() => app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`)))
  .catch(err => console.log({ message: err }));
