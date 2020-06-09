var express = require("express");
var logger = require("morgan");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
const Handlebars = require('handlebars');
const mainRouter = require('./models/config/routes');
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

  
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main",
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(PROCESS.env.MONGODB_URI ||"mongodb://localhost/testdb" { useNewUrlParser: true });

// Routes
app.use(mainRouter);
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://rollingstone.com/").then(function(response,body) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h3")
        .text()||" "; 
      result.link = $(this)
        .children("a")
        .attr("href")||" ";
      result.summary = $(this)
        .find("p")
        .text()||" "; 
      // Create a new Article using the `result` object built from scraping
      console.log("result",result)
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("articles", { Article:Object});
      console.log({Article:Object})
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Displays specified saved articles
app.get("/saved", function(req, res) {
  db.Article.find({saved: true})
      .then(function(result){
        console.log(result.length)
      var hbsObject = { articles: result, noArticles: result.length === 0 };
        console.log(hbsObject);
      res.render("saved",hbsObject);
  }).catch(function(err){ 
    console.log(err)
    res.status(404).json({error: err.toString()}) });
});

// Posts saved articles 
app.put("/saved/:id", function(req, res) {
  db.Article.findOneAndUpdate({"_id": req.params.id}, {"$set": {"saved": true}})
  .then(function(result) {
      res.json(result);
  }).catch(function(err){ res.json(err) });
})

// Deletes specific articles from "Saved Articles" and puts them back on the homepage
app.post("/delete/:id", function(req, res){
  db.Article.findOneAndUpdate({"_id": req.params.id}, {"$set": {"saved": false}})
  .then(function(result){
      res.json(result);
  }).catch(function(err) { res.json(err) });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Deletes one note
app.post("/deleteNote/:id", function(req, res){
  db.Note.remove({"_id": req.params.id})
    .then(function(result){
      res.json(result);
    })
    .catch(function(err) { 
      res.json(err) 
    });
});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
