import { Injectable, Output, EventEmitter } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { Constants } from "@shared/constant";
import { ApiBaseService } from "./apibase.service";
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

@Injectable()
export class FileUploadService {
  files = [];
  input: any;
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
      if (Constants.env == 'PROD') {
        this.uploadS3(f);
      } else {
        this.uploadLocal(f);
      }
    })
  }

  uploadS3(file: any) {
    this.apiBaseService.post('drive/files/create_metadata',
      { name: file.name, file_upload_id: file.id, type: file.type }).subscribe(res => {
        let albumBucketName = res.data.bucket_name;
        let bucketRegion = res.data.region;

        AWS.config.update({
          region: bucketRegion,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: res.data.pool_id,
          })
        });

        let s3 = new AWS.S3({
          apiVersion: res.data.version,
          params: { Bucket: albumBucketName }
        });

        let params = {
          Bucket: res.data.bucket, /* required */
          Key: file.id, /* required */
          Metadata: {
            file_upload_id: file.id,
            name: file.name
          },
        };
        s3.createMultipartUpload(params, (err, data) => {
          if (err) console.log(err, err.stack);
          console.log(data);
          let params = {
            Body: file.data,
            Bucket: data.Bucket,
            Key: data.Key,
            PartNumber: 1,
            UploadId: data.UploadId
          };
          s3.uploadPart(params, (err, data) => {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
            if (err) this.onError.emit(err); // an error occurred
            else this.onDone.emit(file);           // successful response

            // *** completeMultipartUpload
            // s3.abortMultipartUpload(params2, (err, data) => {
            //   if (err) console.log(err, err.stack); // an error occurred
            //   else console.log("abortMultipartUpload");           // successful response
            // });
          });
        });
        // let params = {
        //   Bucket: res.data.bucket, /* required */
        //   Key: file.id, /* required */
        //   Body: file.data,
        //   Metadata: {
        //     file_upload_id: file.id,
        //     name: file.name
        //   },
        // };
        // s3.putObject(params, (err, data) => {
        //   if (err) this.onError.emit(err); // an error occurred
        //   else this.onDone.emit(file);           // successful response
        // });
      });
  }


  uploadLocal(file: any) {
    let request = new XMLHttpRequest();
    request.upload.addEventListener('progress', (e) => {
      file.percent = (e.loaded / e.total) * 100;
      this.onProgress.emit(file);
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
    }

    let form = new FormData();
    form.append('name', file.name);
    form.append('type', file.type);
    form.append('file', file.data);
    form.append('file_upload_id', file.id);
    request.send(form);
  }

  beforeUpload(files: Array<File>) {
    this.files = Object.keys(files).map((key, index) => {
      return { id: uuidv1() + files[key].name, data: files[key], name: files[key].name, type: files[key].type, percent: 0, index: index, full_name: files[key].name };
    })
  }
}
