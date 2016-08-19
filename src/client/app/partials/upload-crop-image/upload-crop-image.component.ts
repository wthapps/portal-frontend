import {Component, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Constants} from '../../shared/index';

declare var $: any;
declare var dropzone: any;

@Component({
  moduleId: module.id,
  selector: 'wth-upload-image',
  templateUrl: 'upload-crop-image.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  styleUrls: ['upload-crop-image.component.css']
})

export class UploadCropImageComponent implements AfterViewInit {
  @Output() imageClicked: EventEmitter<string> = new EventEmitter<string>();

  ngAfterViewInit(): void {
    // Define variables
    var _this = this;

    var elModal = $('#modalUploadImage');
    var elDropzone = $('#dropzone-wrap');
    var elDropzonePreviews = $('#dropzone-previews');
    var myDropzone = null;
    var elCrop = $('#cropper-wrap');
    var $image = $('<img />');
    //var $download = $('#dropzone-download');
    var $cropperRotateLeft = $('#cropper-rotate-left');
    var $cropperRotateRigth = $('#cropper-rotate-right');
    var $remove = $('#cropper-remove');
    var $uploadCrop = $('#cropper-upload');

    var myDropzoneOptions = {
      // CONFIGURATION,
      url: Constants.baseUrls.apiBaseService + 'users/1',
      paramName: 'file', // The name that will be used to transfer the file
      maxFilesize: 2, // MB
      maxFiles: 1,
      //method: 'patch',
      dictDefaultMessage: '<p>Drag and drop a photo</p> ' +
      '<p><span>or</span></p> <button class="btn btn-default">Upload from your computer</button>',
      autoProcessQueue: false,
      previewsContainer: '#dropzone-previews',

      init: function () {
        myDropzone = this;
        /*$download.click(function () {
         // Post to server
         myDropzone.processQueue();
         });*/
        $remove.click(function (e) {
          elDropzonePreviews.html('');
          elCrop.html('');
          elDropzone.parent().removeClass('dropzonecrop-onThumbnail');
        });
      }
    };

    var myCropOptions = {
      //, movable: false
      //, cropBoxResizable: true
      //, minContainerWidth: 150

      viewMode: 3
      , aspectRatio: 1 / 1
      , dragMode: 'move'
      , autoCropArea: 0.8
      , restore: false
      //, modal: false
      , guides: false
      , highlight: false
      //, cropBoxMovable: false
      //, cropBoxResizable: false

    };

    var cachedFilename = 'default';


    //http://codepen.io/anon/pen/PZxWez
    //https://gist.github.com/maria-p/8633b51f629ea8dbd27e
    // transform cropper dataURI output to a Blob which Dropzone accepts
    function dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {type: 'image/jpeg'});
    }

    // initialize dropzone
    elDropzone.dropzone(myDropzoneOptions);
    // listen to thumbnail event
    myDropzone.on('thumbnail', function (file) {
      // ignore files which were already cropped and re-rendered
      // to prevent infinite loop
      if (file.cropped) {
        return;
      }
      if (file.width < 100) {
        // validate width to prevent too small files to be uploaded
        // .. add some error message here
        return;
      }
      // cache filename to re-assign it to cropped file
      cachedFilename = file.name;
      // remove not cropped file from dropzone (we will replace it later)
      //myDropzone.removeFile(file);


      // AddClass to parent
      elDropzone.parent().addClass('dropzonecrop-onThumbnail');


      // initialize FileReader which reads uploaded file
      var reader = new FileReader();
      reader.onloadend = function () {
        // add uploaded and read image to modal
        elCrop.html($image);
        $image.attr('src', reader.result);

        // initialize cropper for uploaded image
        $image.cropper(myCropOptions);
      };

      // read uploaded file (triggers code above)
      reader.readAsDataURL(file);
    });
    // END listen to thumbnail event


    // listener for 'Rotate' button in modal
    $cropperRotateLeft.on('click', function () {
      $image.cropper('rotate', -90);
    });

    // listener for 'Rotate' button in modal
    $cropperRotateRigth.on('click', function () {
      $image.cropper('rotate', 90);
    });

    // listener for 'Crop and Upload' button in modal
    $uploadCrop.on('click', function () {
      // get cropped image data
      var blob = $image.cropper('getCroppedCanvas').toDataURL();

      // transform it to Blob object
      var newFile: any = dataURItoBlob(blob);
      // set 'cropped to true' (so that we don't get to that listener again)
      newFile.cropped = true;
      // assign original filename
      newFile.name = cachedFilename;

      // add cropped file to dropzone
      myDropzone.addFile(newFile);


      // upload cropped file with dropzone
      //myDropzone.processQueue();
      elModal.modal('hide');


      // reinit
      //console.log(newFile, $image);
      elDropzonePreviews.html('');
      elCrop.html('');
      elDropzone.parent().removeClass('dropzonecrop-onThumbnail');


      //send to component
      _this.imageClicked.emit(blob);

    });
  }
}
