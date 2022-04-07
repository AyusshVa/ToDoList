const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

// starting a mongoose connection.
mongoose.connect("mongodb://localhost:27017/toDoListDB");

// creating an items schema.

const itemSchema = new mongoose.Schema({
  name: String
})

// creating a mongoose model:

const itemModel = mongoose.model("item", itemSchema);

// creating new default documents/items:
const item1 = new itemModel({
  name: "Welcome to the todoList v-1"
})
const item2 = new itemModel({
  name: "Click the + button to insert the new item in the list"
})
const item3 = new itemModel({
  name: "<- click here to delete the newly added item."
})

// inserting the documents in the model.
const defaultItems = [item1, item2, item3];


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"))
app.set("view engine", "ejs");


// home route, containing the code to display the contents present in the database.
app.get("/", function (req, res) {
  let day = date.getDate(); // for creating a heading based on today's date.

  // to read the data from the database.
  itemModel.find({}, (err, data) => {
    // if db is empty only then add the default items in the list.
    if (data.length === 0) {
      itemModel.insertMany(defaultItems, (err) => {
        if (err) console.log(err)
        else console.log("added successfully");
      })
      res.redirect("/") // after adding the default, it will to the else part
    } else  // render the list.ejs page with the heading of date and data of db.
      res.render("list", {
        heading: day,
        newListItems: data
      })
  })
})

// work route for work list. (not available currently)
app.get("/work", (req, res) => {
  let heading = "Work";
  res.render("list", {
    heading: heading,
    newListItems: workItems
  })
})

// posting through home route. -> for addition to the list by adding to the database.

app.post("/", (req, res) => {
  // store the item to store in var
  let item_var = req.body.item;
  // in the ejs file, req.body.list is set according to from where it is being called.
  if (req.body.list === "Work") {
    workItems.push(item_var);
    res.redirect("/work");
  } else { // else create a new doc with item.
    var itemDoc = new itemModel({
      name: item_var
    })
    itemDoc.save();    // add to db.
    res.redirect("/")  // redirect to the home as there it will display the updated db data.
  }
})

// post for deletion 
app.post("/delete", (req, res) => {
  let DeleItemId = req.body.checkbox;

  itemModel.deleteOne({
    _id: DeleItemId
  }, (err) => {
    if (err) console.log(err);
    else console.log("Successfully deleted")
  });
  res.redirect("/")
})

app.get("/about", (req, res) => {
  res.render("about");
})

app.listen("3000", () => {
  console.log("Server is running and up")
})