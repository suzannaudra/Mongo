const db = require ("../")
const mainRouter = require('express').Router();


  //This route renders the homepage
 //// $(document).on("click","#scrapenew", function() {
  mainRouter.get("/", function(req,res){
    res.render("home");
  });
//});

  
  mainRouter.get("/articles", function(req,res) {
    db.Article.find({}).then(results => res.json (results.reverse()))
  });

  mainRouter.delete("/articles/:id", function (req,res){
    let query = {};
    query._id = req.params.id;
    db.Article.findByIdAndDelete(query, function(err, data) {
      res.json(data)
    })
  })

  module.exports  = mainRouter;

