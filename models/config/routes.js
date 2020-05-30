const db = require ("../")
const mainRouter = require('express').Router();


  //This route renders the homepage
 //// $(document).on("click","#scrapenew", function() {
  mainRouter.get("/", function(req,res){
    res.render("home");
  });
//});
  //This route renders the handlebars page
  mainRouter.get("/saved", function(req,res) {
    res.render("saved");
  });
  
  mainRouter.get("/articles", function(req,res) {
    db.Article.find({}).then(results => res.json (results.reverse()))
  });

  module.exports  = mainRouter;

