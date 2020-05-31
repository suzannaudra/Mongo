//Not working on front end
$(document).on("click",".deletebtn", function() {
  $.ajax({
        method: "DELETE",
        url: "/articles"+ $(this).attr("data-id")
    }).then(function(data) {
        console.log(data)
        window.location = "/"
      })
  });

$.getJSON("/articles", function(data) {
  // Remove the information on the page
  //not working
  const deletearticle = $('<div>')
  deletearticle.remove("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
  deletearticle.remove(('<button type="button" class="deletebtn" class="btn btn-success save" data-id="' + data[i]._id + '">Delete Article</button>'))
  $("#articles").remove(deletearticle)
}
);

$.ajax({
  method: "GET",
  url: "/articles/" + thisId
})
  // With that done, add the note information to the page
  .then(function(data) {
    
    // The title of the article
    $("#notes").append("<h2>" + data.title + "</h2>");
    // An input to enter a new title
    $("#notes").append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
  })