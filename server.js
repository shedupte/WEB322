var express = require("express");
var app = express();
var path = require("path");
//var data_service= require("data-service");

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

// setup another route to listen on /about
app.get("/employees", function(req,res){
   res.send("this string for emp"); // employees
});

// setup another route to listen on /about
app.get("/managers", function(req,res){
   res.send("this strin for manager");// managers
});

// setup another route to listen on /about
app.get("/departments", function(req,res){
   res.send("this is a deparment string");//departments
});

// add response for no matching routes


// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);