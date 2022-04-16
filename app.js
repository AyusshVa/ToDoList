const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"))
app.set("view engine", "ejs");

// starting a mongoose connection.
mongoose.connect("mongodb+srv://admin-ayussh:test123@cluster0.t3mdo.mongodb.net/toDoListDB");

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

// parameters for the custom List.

// schema
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

// model.
const listModel = mongoose.model("list", listSchema );




// home route, containing the code to display the contents present in the database. *****************************************************
app.get("/", function (req, res) {

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
        heading: "Today",
        newListItems: data
      })
  })

})



// ***************************dynamic routes********************

app.get('/:customListName',  (req,res)=>{
const customListName =  _.capitalize(req.params.customListName);
if(customListName === "About"){
  res.render("about");
}

else{
  if(customListName !== 'Favicon.ico'){
    listModel.findOne({name: customListName}, (err,data)=>{
      if(err) console.log("there is an error which is" + err);
      else{
        if(!data){
          // make the list doc
          var list1 = new listModel({
            name: customListName,
            items: [item1,item3]
          })
          list1.save();
          res.redirect("/" + customListName)
        }
    
        else{
    
          res.render("list", {
            heading: customListName,
            newListItems: data.items
    
            // **Note: after rendering any route, I don't know why its console.loging the favicon.ico in the terminal.
          })
         
        }
      }
    });
  }
  
}

})

// posting through home route. -> for addition to the list by adding to the database.

app.post("/", async (req, res) => {
  // store the item to store in var
  let item_var = req.body.item;
  let customListName = req.body.list;
 
  var   newItem =   new itemModel({
    name: item_var
  });

  if(customListName === 'Today'){
    await newItem.save();
    res.redirect("/")
  }
else{
  listModel.findOne({name: customListName}, async (err,data)=>{
    data.items.push(newItem);
    await data.save();
    res.redirect("/" + customListName);
  });

}

});



// post for deletion 
app.post("/delete", async (req, res) => {

  let DeleItemId = req.body.checkbox;
  let listName = req.body.listName;

  if(listName === "Today"){
    itemModel.deleteOne({
      _id: DeleItemId
    }, (err) => {
      if (err) console.log(err);
      else console.log("Successfully deleted")
      // ****************big bug resolved, the res.redirect was outside the deleteOne function therefore it was causing the issue of async.
      res.redirect("/")
    });
  }
// deletion of items other than the today home list.
  else{

    // ***************************** using js splice in loops ****************************
    //   listModel.findOne({name: listName}, (err,data)=>{
    //   if(!err){
    //     console.log("id: "+ DeleItemId);
    //     console.log(data.items[0]._id);
    //     for(let i=0; i<data.items.length ; i++){
    //       if(data.items[i]._id == DeleItemId){
    //         data.items.splice(i,1);
    //       }
    //     }
    //     data.save();
    //     res.redirect("/" + listName)
    //   }
    // });

    // ********** using the $pull operator*****************
    listModel.findOneAndUpdate({name: listName} , {$pull: {items: {_id: DeleItemId}}}, (err, foundList)=>{  // this line deleted the items from the array

      if(!err){
        res.redirect("/" + listName);
      }
    });
  }

})


app.listen("3000", () => {
  console.log("Server is running and up")
})