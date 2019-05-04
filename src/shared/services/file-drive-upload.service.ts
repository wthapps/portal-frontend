import { Injectable, Output, EventEmitter } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { Constants } from "@shared/constant";
import { ApiBaseService } from "./apibase.service";
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

@Injectable()
export class FileDriveUploadService {
  files = [];
  input: any;
  s3: any;
  config: any = {
    url: "drive/files/upload",
  };
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onStart: EventEmitter<any> = new EventEmitter();
  @Output() onDone: EventEmitter<any> = new EventEmitter();
  @Output() onProgress: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();

  constructor(private cookieService: CookieService, private apiBaseService: ApiBaseService) {

  }

  open() {
    if (!this.input) {
      this.input = document.createElement('input');
      this.input.type = "file";
      this.input.multiple = true;
      this.input.addEventListener('change', (event) => {
        this.onChange.emit(event);
      });
    }

    this.input.click();
  }

  upload(files: any) {
    this.beforeUpload(files);
    this.onStart.emit(this.files);
    // this.uploadLocal();
    this.files.forEach(f => {
      if (Constants.env === 'PROD') {
        this.uploadS3(f);
      } else {
        this.uploadLocal(f);
      }
    });
  }

  retry(file: any) {
    if (Constants.env === 'PROD') {
      this.uploadS3(file);
    } else {
      this.uploadLocal(file);
    }
  }

  abortMultipartUploadS3(bucket, key, uploadId) {
    const params = {
      Bucket: bucket,
      Key: key,
      UploadId: uploadId
    };
    this.s3.abortMultipartUpload(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  }

  createS3instane(res: any) {
    if (!this.s3) {
      AWS.config.update({
        region: res.data.region,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: res.data.pool_id,
        })
      });
      this.s3 = new AWS.S3({
        apiVersion: res.data.version,
        params: { Bucket: res.data.bucket_name }
      });
    }
  }

  uploadS3(file: any) {
    this.apiBaseService.post('drive/files/create_metadata',
      { name: file.name, file_upload_id: file.id, type: file.type }).subscribe(res => {
        this.createS3instane(res);
        const reader = new FileReader();
        let partNum = 0;
        const uploadParts = [];
        reader.addEventListener("load", (event: any) => {
          const step = 5 * 1000 * 1000; // 5MB
          // const step = 32428800;
          // Single uploading
          if (event.total < step) {
            const params = {
              Bucket: res.data.bucket, /* required */
              Key: file.id, /* required */
              Body: file.data,
              Metadata: {
                file_upload_id: file.id,
                name: file.name
              },
            };
            this.s3.putObject(params, (err, data) => {
              if (err) this.onError.emit(err); // an error occurred
              else this.onDone.emit(file);           // successful response
            });
          } else {
            // Multiple uploading
            const params = {
              Bucket: res.data.bucket, /* required */
              Key: file.id, /* required */
              Metadata: {
                file_upload_id: file.id,
                name: file.name
              },
            };

            this.s3.createMultipartUpload(params, (err, data) => {
              if (err) {
                file.error = err;
                this.onError.emit(file);
                return;
              }
              file.Bucket = res.data.bucket;
              file.UploadId = data.UploadId;
              this.onProgress.emit(file);
              // const step = 5242880;
              for (let start = 0; start < event.total; start = start + step) {
                partNum = partNum + 1;
                const end = Math.min(start + step, event.total);
                const params1 = {
                  Body: file.data.slice(start, end),
                  Bucket: data.Bucket,
                  Key: data.Key,
                  PartNumber: partNum,
                  UploadId: data.UploadId
                };
                this.s3.uploadPart(params1, (err1: any, data1: any) => {
                  // if (err) console.log(err1, err1.stack); // an error occurred
                  // else console.log(data1);           // successful response
                  if (err1) {
                    file.error = err1;
                    this.onError.emit(file);
                  } else {
                    uploadParts.push({ ETag: data1.ETag, PartNumber: params1.PartNumber });
                    if (uploadParts.length === partNum) {
                      uploadParts.sort((a: any, b: any) => {
                        return a.PartNumber - b.PartNumber;
                      });
                      const params2: any = {
                        Bucket: params.Bucket,
                        Key: params.Key,
                        MultipartUpload: {
                          Parts: uploadParts.map(part => ({ ETag: "\"" + part.ETag + "\"", PartNumber: part.PartNumber }))
                        },
                        UploadId: data.UploadId
                      };
                      this.s3.completeMultipartUpload(params2, (err2, data2) => {
                        if (err2) {
                          file.error = err2;
                          this.onError.emit(file);
                        } else this.onDone.emit(file);           // successful response
                      });
                    }
                  }
                });
              }
            });
          }
        }, false);
        reader.readAsBinaryString(file.data);
      });
  }


  uploadLocal(file: any) {
    const request = new XMLHttpRequest();
    request.upload.addEventListener('progress', (e) => {
      this.onProgress.emit(file);
    });
    request.upload.addEventListener('error', (e) => {
      file.error = e;
      this.onError.emit(file);
    });
    request.addEventListener('error', (e) => {
      file.error = e;
      this.onError.emit(file);
    });

    // Send POST request to the server side script
    request.open('post', Constants.baseUrls.apiUrl + this.config.url);
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader("ACCEPT", "application/json");
    const jwt = this.cookieService.get(Constants.cookieKeys.jwt);
    request.setRequestHeader("Authorization", 'Bearer ' + jwt);

    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        // end uploading
        this.onDone.emit(file);
      }
    };

    const form = new FormData();
    form.append('name', file.name);
    form.append('type', file.type);
    form.append('file', file.data);
    form.append('file_upload_id', file.id);
    request.send(form);
  }

  beforeUpload(files: Array<File>) {
    this.files = Object.keys(files).map((key, index) => (
      {
        id: uuidv1() + files[key].name,
        data: files[key],
        name: files[key].name,
        type: files[key].type,
        percent: 0, index: index, full_name: files[key].name
      }
    ));
  }
}
