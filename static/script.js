var files;

// (function(EmailsInput, random) {
//   'use strict'

//   document.addEventListener('DOMContentLoaded', function() {
//     const inputContainerNode = document.querySelector('#emails-input')
//     const emailsInput = EmailsInput(inputContainerNode)

//     // expose instance for quick access in playground
//     window.emailsInput = emailsInput

//     // document.querySelector('[data-action="add-email"]')
//     //   .addEventListener('click', function() { emailsInput.add(random.email()) })

//     // document.querySelector('[data-action="get-emails-count"]')
//     //   .addEventListener('click', function() {
//     //     const emails = emailsInput.getValue()
//     //     alert('there are ' + emails.length + ' valid email(s)')
//     //   })
//   })

// }(window.lib.EmailsInput, window.lib.utils.random))



$("#file-upload").on("submit", function (e) {
    e.preventDefault();
    $("#submit-button").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <div style="display:inline" id="progress">Uploading</div>');
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
      formData.append('email', $('#email-address').val());
      formData.append('time',$('#time-select').val());
      console.log(formData);
      $.ajax({
        url: "/uploadfile",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          console.log(data.path);
          $('#download-link-text').attr('href', window.location.origin+ '/files/' + data.path);
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
                // once the upload reaches 100%, return original state of the button
                $('#progress').html("Uploading "+percentComplete + "%");
                if (percentComplete === 100) {
                  $("#submit-button").html("Upload");
                  $("#submit-button").prop("disabled", null);
                  $('#download-link').show();
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