var files;
$("#form").on("submit", function (e) {
      e.preventDefault();
      $(".progress-bar").text("0%");
      $("#button").html('<i class="fa fa-circle-o-notch fa-spin"></i> Uploading File');
      $("#button").prop("disabled", "true");
      $(".progress-bar").width("0%");
      convertFile();
    }); 

$("#upload-input").on("change", function () {
  files = $(this).get(0).files;
});

function convertFile() {
  if (files.length > 0) {
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();
    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      // add the files to formData object for the data payload
      formData.append("file", file, file.name);
    }
    console.log(formData);
    $.ajax({
      url: "/uploadfile",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data.path);
        $("#button").text("Share Files");
        $("#button").prop("disabled", null);
        $(".progress-bar").width("0%");
        $("#upload-input").val("");
        $("#section").show();
        $("#result").show()
        $(".copy-input").val("http://localhost:3000/files/" + data.path);
      },
      xhr: function () {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();
        // listen to the 'progress' event
        xhr.upload.addEventListener(
          "progress",
          function (evt) {
            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
              // update the Bootstrap progress bar with the new percentage
              $(".progress-bar").text(percentComplete + "%");
              $(".progress-bar").width(percentComplete + "%");
              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $(".progress-bar").html("Done");
              }
            }
          },
          false
        );
        return xhr;
      },
    });
  }
}

function copy() {
      var copyText = document.getElementById("url");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");

      $("#copied-success").fadeIn(800);
      $("#copied-success").fadeOut(800);
}