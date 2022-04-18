var files;

$("#file-upload").on("submit", function (e) {
    e.preventDefault();
    $("#submit-button").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading File');
    $("#submit-button").prop("disabled", "true");
    convertFile();
});

$("#formFile").on("change", function () {
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
                // $(".progress-bar").text(percentComplete + "%");
                // $(".progress-bar").width(percentComplete + "%");
                // once the upload reaches 100%, set the progress bar text to done
                if (percentComplete === 100) {
                  $("#submit-button").html("Upload");
                  $("#submit-button").prop("disabled", null);
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