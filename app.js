const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine", "ejs");
let items = [];
let workItems = [];


app.get("/", function(req, res){
  
 let day = date.getDate();
  res.render("list", {heading:day, newListItems:items})


})

app.get("/work", (req, res)=> {
  let heading = "Work";
  res.render("list", {heading: heading, newListItems: workItems})
})

app.post("/", (req, res)=>{
let item = req.body.item;
if(req.body.list === "Work"){
  workItems.push(item);
  res.redirect("/work");
}else{
  items.push(item);
  res.redirect("/")
}
})

app.get("/about", (req, res)=>{
  res.render("about");
})

app.listen("3000", ()=> {console.log("Server is running and up")})