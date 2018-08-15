import { Injectable } from '@angular/core';
import { Core, FileInput, DragDrop, Dashboard, XHRUpload, Tus, StatusBar, ProgressBar } from 'uppy';
import { AuthService } from '@shared/services/auth.service';
import { Constants } from '@shared/constant';
import { Subject } from 'rxjs/Subject';
import { ApiBaseService } from '@shared/services/apibase.service';

@Injectable()
export class WUploader {


  // subjects



  apiUrl = Constants.baseUrls.apiBaseService;
  cdnUrl = Constants.baseUrls.cdn;

  uploadPath = 'common/files/upload';

  select$ = new Subject<any>();
  start$ = new Subject<any>();
  event$ = new Subject<any>();
  uppy: any;


  constructor(private authService: AuthService, private api: ApiBaseService) {}

  /**
   *
   * @param {string} selector
   * @param {{}} options
   */
  initialize(mode: string = 'FileInput', selector: string = '.w-uploader-file-input-container', options: any = {
    allowedFileTypes: null,
    willCreateMessage: false,
    willCreatePost: false,
    willCreateNote: false,
    module: 'chat' || 'social' || 'notes' || 'contacts' || 'media'
  }) {

    const opts: any = {
      autoProceed: true,
      restrictions: {
        allowedFileTypes: options.allowedFileTypes
      }
    };


    this.uppy = Core(opts);

    if (mode === 'FileInput') {
      this.uppy.use(FileInput, {
        target: selector,
        replaceTargetContent: true,
        inputName: 'file',
        pretty: true,
        locale: {
          strings: {
            chooseFiles: 'upload'
          },
        }
      });
    } else if (mode === 'DragDrop') {
      this.uppy.use(DragDrop, {target: selector});
    }

    // enable status bar
    // this.uppy.use(StatusBar, {
    //   target: '#w-uploader-statusbar',
    //   hideUploadButton: false,
    //   showProgressDetails: true,
    //   hideAfterFinish: false,
    //   locale: {}
    // });


    this.uppy.use(XHRUpload, {
      endpoint: `${this.apiUrl}${this.uploadPath}`,
      headers: {
       'Authorization': `Bearer ${this.authService.jwt}`
      },
      formData: true,
      fieldName: 'file'
    });


    this.uppy.on('file-added', (file) => {
      // add more files that you need to pass to server here
      file.meta = {...file.meta, file_upload_id: file.id, current_date: + new Date()};
      this.event$.next({action: 'file-added', payload: {file: file}});
    });

    this.uppy.on('file-removed', (file) => {
      this.event$.next({action: 'file-removed', payload: {file: file}});
    });


    this.uppy.on('upload', (data) => {
     this.event$.next({action: 'start', payload: data});

     // data object consists of `id` with upload ID and `fileIDs` array
     // with file IDs in current upload
     // data: { id, fileIDs }
    });

    this.uppy.on('upload-progress', (file, progress) => {
    // file: { id, name, type, ... }
    // progress: { uploader, bytesUploaded, bytesTotal }
    // just read


      let url = '';
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        file.preview = reader.result;
        this.event$.next({action: 'progress', payload: {file: file, progress: progress}});
      });

      if (this.isImage(file.type)) {
        if (file.data) {
          reader.readAsDataURL(file.data);
        }
      } else if (this.isVideo(file.type)) {
          file.preview = `${this.cdnUrl}/thumbnails/video_default.png`;
          this.event$.next({action: 'progress', payload: {file: file, progress: progress}});
      } else if (this.isGenericFile(file.type)) {
        file.preview = `${this.cdnUrl}/thumbnails/generic_file_default.png`;
        this.event$.next({action: 'progress', payload: {file: file, progress: progress}});
      }
    });

    this.uppy.on('upload-success', (file, resp, uploadURL) => {
      // upload uploaded value
      this.uppy.setFileMeta(file.id);
      this.event$.next({action: 'success', payload: {file: file, resp: resp, uploadURL: uploadURL}});
    });

    this.uppy.on('complete', (result) => {
      this.event$.next({action: 'complete', payload: result});
    });


    this.uppy.on('upload-error', (file, error) => {
      this.event$.next({action: 'error', payload: {file: file, error: error}});
    });

    this.uppy.on('info-visible', () => {
      const info = this.uppy.getState().info;
      // info: {
      //  isHidden: false,
      //  type: 'error',
      //  message: 'Failed to upload',
      //  details: 'Error description'
      // }
      this.event$.next({action: 'info-visible', payload: {info: info}});
    });
    // this.uppy.use(ProgressBar, {
    //   target: 'body',
    //   fixed: true,
    //   hideAfterFinish: false
    // });
    // this.upload();
  }

  /**
   * Cancel upload a specific file
   * @param file
   */
  cancel(file: any) {
    const canceledFiles = [];

    if (!file.progress.uploadComplete) {
      canceledFiles.push({id: file.id, name: file.name, file_upload_id: `${file.id}-${file.meta.current_date}`});
      this.uppy.removeFile(file.id);
    }

    if (canceledFiles.length > 0) {
      this.api.post('common/files/cancel_upload', {files: canceledFiles}).subscribe(response => {
        console.log('cancel upload successful:::', response);
      });
    }
  }

  /**
   *
   * @param {Array<any>} files
   */
  cancelAll(uploadingFiles?: Array<any>) {
    const files = uploadingFiles || this.uppy.getFiles();
    const canceledFiles = [];

    files.forEach(file => {
      if (!file.progress.uploadComplete) {
        canceledFiles.push({id: file.id, name: file.name, file_upload_id: `${file.id}-${file.meta.current_date}`});
        this.uppy.removeFile(file.id);
      }
    });

    if (canceledFiles.length > 0) {
      this.api.post('common/files/cancel_upload', {files: canceledFiles}).subscribe(response => {
        this.event$.next({action: 'cancel-success', payload: {response: response}});
      });
    }
  }

  fileUpload(fileInput: any) {
    // const imagePreview = document.querySelector('.upload-preview')

    fileInput.style.display = 'none'; // uppy will add its own file input

    this.uppy = Core({
      id: fileInput.id,
    })
      .use(FileInput, {
        target: fileInput.parentNode,
      });


    this.uppy.use(XHRUpload, {
      endpoint: '/images/upload', // Shrine's upload endpoint
      fieldName: 'file',
    });

    this.uppy.on('upload-success', function (file, data) {
      // show image preview

      // read uploaded file data from the upload endpoint response
      const uploadedFileData = JSON.stringify(data);
      console.log('uploaded file data:::', uploadedFileData);

      // set hidden field value to the uploaded file data so that it's submitted with the form as the attachment
      // var hiddenInput = fileInput.parentNode.querySelector('.upload-hidden');
      // hiddenInput.value = uploadedFileData;
    });
  }

  /**
   *
   * @param {string} mode
   * @param {string} target
   * @param {{}} options
   */

  open(mode: string, target: string, options: {}) {
    if (mode !== 'FileInput' && mode !== 'Dashboard' && mode !== 'DragDrop') {
     console.log('mode is not supported:', mode);
     return;
    }
    if (mode === 'FileInput') {
      this.initialize('FileInput', target, options);
     (document.getElementsByClassName('uppy-FileInput-btn')[0] as HTMLElement).click();
    }

    if (mode === 'DragDrop') {
      console.log('DragDrop target', target);
      this.initialize('DragDrop', target, options);
    }
  }

  upload() {
    this.uppy.upload();
  }

  private isImage(type: string) {
    return type.startsWith('image');
  }

  private isVideo(type: string) {
    return type.startsWith('video');
  }

  private isGenericFile(type: string) {
    return !this.isImage(type) && !this.isVideo(type);
  }

}
