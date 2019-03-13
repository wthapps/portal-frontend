import { Injectable } from '@angular/core';
import { Core, FileInput, DragDrop, Dashboard, XHRUpload, Tus, StatusBar, ProgressBar } from 'uppy';
import { AuthService } from '@shared/services/auth.service';
import { Constants } from '@shared/constant';
import { Subject } from 'rxjs/Subject';
import { ApiBaseService } from '@shared/services/apibase.service';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import { FileInputCustom } from '@core/third-parties/uppy/file-input';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { BlackListPolicy } from '@shared/policies/black-list-policy';
import { SizePolicy } from '@shared/policies/size-policy';

@Injectable()
export class WUploader {

  apiUrl = Constants.baseUrls.apiUrl;
  cdnUrl = Constants.baseUrls.cdn;

  uploadPath = 'common/files/upload';
  select$ = new Subject<any>();
  start$ = new Subject<any>();
  event$ = new Subject<any>();
  uppy: any;


  constructor(private authService: AuthService, private api: ApiBaseService, private commonEventService: CommonEventService) {}

  /**
   *
   * @param {string} selector
   * @param {{}} options
   */
  initialize(mode: string = 'FileInput', selector: string = '.w-uploader-file-input-container', options: any = {
    allowedFileTypes: null,
    preventedFileTypes: null,
    maxNumberOfFiles: null,
    afterCallBackUrl: null,
    beforeCallBackUrl: null,
    onBeforeUpload: null,
    maxFileSize: null,
    module: 'chat' || 'social' || 'notes' || 'contacts' || 'media'
  }) {
    let onBeforeUpload = options.onBeforeUpload;
    if (!onBeforeUpload) {
    onBeforeUpload = (files) => this.event$.next({ action: 'before-upload', payload: { files: files}});
    }

    const onAfterUploaded = options.onAfterUploaded;

    const opts: any = {
      autoProceed: true,
      restrictions: {
        allowedFileTypes: options.allowedFileTypes,
        maxNumberOfFiles: options.maxNumberOfFiles,
        maxFileSize: options.maxFileSize
      },
      onBeforeFileAdded: (currentFile, files) => this.event$.next({ action: 'before-file-added', payload: { file: currentFile, files } }),
      onBeforeUpload,
    };

    this.uppy = Core(opts);

    if (mode === 'FileInput') {
      const policies: any = [new BlackListPolicy(), new SizePolicy(35)];
      this.uppy.use(FileInputCustom, {
        target: selector,
        replaceTargetContent: true,
        inputName: 'file',
        pretty: true,
        commonEventService: this.commonEventService,
        locale: {
          strings: {
            chooseFiles: 'upload'
          },
        },
        policies: policies
      });
    } else if (mode === 'DragDrop') {
      this.uppy.use(DragDrop, {target: selector});
    }

    this.uppy.use(XHRUpload, {
      endpoint: `${this.apiUrl}${this.uploadPath}`,
      headers: {
       'Authorization': `Bearer ${this.authService.jwt}`
      },
      formData: true,
      fieldName: 'file'
    });

    this.uppy.on('file-added', (file) => {
      // data: File(7775842) { allow: true, validateErrors: Array(0), name: "400.pdf", lastModified: 1538536306875, lastModifiedDate: Wed Oct 03 2018 10: 11: 46 GMT + 0700(Indochina Time), … }
      // extension: "pdf"
      // id: "uppy-400pdf-application/pdf-7775842-1538536306875"
      // isRemote: false
      // meta: { name: "400.pdf", type: "application/pdf", file_upload_id: "uppy-400pdf-application/pdf-7775842-1538536306875-1548046078282" }
      // name: "400.pdf"
      // preview: "http://localhost:4000/assets/thumbnails/generic_file_default.png"
      // progress: { percentage: 0, bytesUploaded: 0, bytesTotal: 7775842, uploadComplete: false, uploadStarted: false }
      // remote: ""
      // size: 7775842
      // source: "FileInput"
      // type: "application/pdf"
      // add more files that you need to pass to server here
      file.meta = {
        ...file.meta,
        file_upload_id: file.id + '-' + new Date().getTime(),
        after_callback_url: options.afterCallBackUrl,
        before_callback_url: options.beforeCallBackUrl,
        payload: JSON.stringify({ ...options.payload, ...file.progress})
      };
      this.event$.next({action: 'file-added', payload: {file: file}});
    });

    this.uppy.on('file-removed', (file) => {
      this.event$.next({action: 'file-removed', payload: {file: file}});
    });


    this.uppy.on('upload', (data) => {
     this.event$.next({action: 'start', payload: data});
    });

    this.uppy.on('upload-progress', (file, progress) => {
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
      this.event$.next({action: 'success', payload: {file, resp, uploadURL}});

      if (onAfterUploaded) {
        onAfterUploaded({file, resp, uploadURL});
      }
    });

    this.uppy.on('complete', (result) => {
      this.event$.next({action: 'complete', payload: result});
    });


    this.uppy.on('upload-error', (file, error) => {
      this.event$.next({action: 'error', payload: {file: file, error: error}});
    });

    this.uppy.on('info-visible', () => {
      const info = this.uppy.getState().info;
      this.event$.next({action: 'info-visible', payload: {info: info}});
    });
  }

  retryUpload(fileId) {
    this.uppy.retryUpload(fileId);
  }

  addFile(file) {
    this.uppy.addFile(file);
  }

  /**
   * Cancel upload a specific file
   * @param file
   */
  cancel(file: any) {
    if (!file) {
      return;
    }
    try {
      const canceledFiles = [];

      if (!file.progress.uploadComplete) {
        canceledFiles.push({id: file.id, name: file.name, file_upload_id: `${file.id}-${file.meta.current_date}`});
        this.uppy.removeFile(file.id);
      }
      if (canceledFiles.length > 0) {
        this.api.post('common/files/cancel_upload', {files: canceledFiles}).subscribe(response => {
          // console.log('cancel upload successful:::', response);
        });
      }
    } catch (ex) {
      console.error('Cancel error: ', ex);
    }
  }

  /**
   * Cancel uploading or uploaded files
   * @param {boolean} cancelAll - Specific true if you want to delete all files
   */
  cancelAll(cancelAll: boolean = false) {
    if (!this.uppy) {
      return;
    }
    const files = this.uppy.getFiles();
    let canceledFiles = [];

    if (cancelAll) {
      canceledFiles = files;
    } else {
      files.forEach(file => {
        if (!file.progress.uploadComplete) {
          canceledFiles.push({id: file.id, name: file.name, file_upload_id: `${file.id}-${file.meta.current_date}`});
          this.uppy.removeFile(file.id);
        }
      });
    }

    if (canceledFiles.length > 0) {
      this.api.post('common/files/cancel_upload', {files: canceledFiles}).subscribe(response => {
        this.event$.next({action: 'cancel-success', payload: {response: response}});
      });
    }
  }

  fileUpload(fileInput: any, onUploadedCallback?) {

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


      if (onUploadedCallback) {
        onUploadedCallback({file, resp: data});
      }
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

  getFiles() {
    return this.uppy.getFiles();
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
