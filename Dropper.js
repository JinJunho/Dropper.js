/*
 * @author      Jin Junho | https://github.com/jinjunho
 * @version     1.0.0
 *
 * Description  Pure JavaScript Super-Lightweight Drag-and-Drop File Upload Plugin 
 *
 * Example
 * 
 *    DROPPER({
 *        multi : false,          // If false, 'onload' is called for each file. Otherwise, 'onload' takes array of files.
 *        target: "dropzone",     // drag-and-drop DIV Id
 *        select: "fileupload",   // alternative file Input Id
 *        onload: function(file, onerror) {
 *            // Do whatever you want when file uploads succeed
 *            // if (multi == false)
 *            //      Call onload for each file. In this case, since multi is false, 'file' argument is a single file.
 *            // else
 *            //      Call onload for array of files (iterate 'file' argument to use each file)
 *
 *            alert("You uploaded " + file.filename);
 *
 *            // Use DROPPER error function below if using Ajax
 *            $.ajax({
 *                url: "ajax_url",
 *                type: "POST",
 *                data: file,
 *                success: function(data, status) {
 *                    console.log("Upload success.");
 *                },
 *                error: onerror
 *            });
 *        },
 *        error: function(data, status, error) {
 *            // This function is designed to be called on Ajax Error
 *            // But you can use anywhere when upload failed
 *            if (error) {  // jQuery.ajax error callback
 *                console.log("code: "    + data.status +"\n"+ 
 *                            "error: "   + error       +"\n"+,
 *                            "status: "  + status      +"\n"+,
 *                            "message: " + data.responseText);
 *            } else alert(data); // Otherwise
 *        }
 *    });
 *
 */

(function() {
  window.DROPPER = function() {
    var dropzone, selector, target, select, multi;
    var attach, prefix;
    var onload, error;
    target = arguments[0].target;
    select = arguments[0].select;
    onload = arguments[0].onload || function() {};
    error  = arguments[0].error || function() {};
    multi  = arguments[0].multi;  // false if not set
    dropzone = document.getElementById(target);
    selector = document.getElementById(select);
    attach = (document.addEventListener ? "addEventListener" : "attachEvent");
    prefix = (document.addEventListener ? "" : "on");

    // Warn user if arguments are wrong. 
    if (!dropzone || typeof onload != "function") {
      console.log("Check your arguments to DROPPER again, please!");
      return false;
    }

    // dropzone event
    var dragOverHandler = function(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    };
    var fileDropHandler = function(e) {
      e.stopPropagation();
      e.preventDefault();
      var i, files = e.dataTransfer.files;
      if (multi) {
        onload(files, error);
      } else {
        for (i = 0; i < files.length; i++) {
          onload(files[i], error);
        }
      }
    };

    // file selector event
    var fileSelectHandler = function(e) {
      var i, files = e.target.files;
      if (multi) onload(files, error);
      else for (i = 0; i < files.length; i++) onload(files[i], error);
    };
    // Attach event handler
    dropzone[attach](prefix + "drop", fileDropHandler, false);
    dropzone[attach](prefix + "dragover", dragOverHandler, false);
    selector[attach](prefix + "change", fileSelectHandler, false);
  };
})();
