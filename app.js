const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine", "ejs");
let items = [];


app.get("/", function(req, res){
  const d = new Date();
  var options = {
      weekday: "long", 
      day : "2-digit", 
      month: "short",
  
  };
  const info = d.toLocaleString("en-IN", options);
  res.render("list", {day:info, temp:items})


})

app.post("/", (req, res)=>{
const item = req.body.item;
items.push(item);
res.redirect("/");
})

app.listen("3000", ()=> {console.log("Server is running and up")})