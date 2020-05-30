$(document).on("click",".deletebtn", function() {
  $.ajax({
        method: "UPDATE",
        url: "/saved"+ $(this).attr("data-id")
    }).then(function(data) {
        console.log(data)
        window.location = "/"
      })
  });

$.getJSON("/saved", function(data) {
  // Display the information on the page
  for (var i = 0; i < data.length; i++) {
  const savedarticle = $('<div>')
  savedarticle.remove("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
  savedarticle.remove(('<button type="button" class="deletebtn" class="btn btn-success save" data-id="' + data[i]._id + '">Delete Article</button>'))
  $("#articles").remove(savedarticle)
}
);