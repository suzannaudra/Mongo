var Note = require("../Note");

//Find notes associated with the Headline ID
module.exports = {
  get: function(data, cb){
    Note.find({
      _headlineId: data._id 
    }, cb);
    },
//Save the Notes from the user, by the ID
  save: function(data, cb) {
    let newNote = {
      _headlineId: data._id,
      noteText: data.noteText
    };
  }, 
delete: function(data, cb) {
  Note.remove({
    _id: data._id
  }, cb);
}
};
