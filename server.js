var express = require("express");
var app = express();
var path = require("path");
var data_Service= require("./data-service");

var HTTP_PORT = process.env.PORT || 8080;

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