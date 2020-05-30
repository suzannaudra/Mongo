var Headline = require("../models/Headline");

module.exports = {
  fetch: function(cb) {
    scrape(function(data){
      var articles = data;
      for (var i=0; i <articles.length; i++) {
        articles[i].saved =false;
      }
    })
  },
  delete: function(query,cb) {
    Headline.remove(query,cb);
  },
  update: function(query,cb) {
    Headline.update({_id: query.id}, {
      $set: query
    }, {}, cb);
  }
}
