const db = require ("../")
const mainRouter = require('express').Router();


  //This route renders the homepage
  mainRouter.get("/", function(req,res){
    res.render("home");
  });
  mainRouter.get("/articles", function(req,res) {
    db.Article.find({}).then(results => res.json (results))
  });

  module.exports  = mainRouter;

