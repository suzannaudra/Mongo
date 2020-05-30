// Exporting an object containing all of our models
//$(document).ready(function(){
//   let articlecontainer = $("#articles")
//   $(document).on("click", "#savebtn", handleArticleSave)
//   $(document).on("click", ".scrapenew", handleArticleScrape)
// //})

module.exports = {
  Article: require("./Article"),
  Note: require("./Note")
};