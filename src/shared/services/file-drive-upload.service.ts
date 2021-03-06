import { Injectable, Output, EventEmitter } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { Constants } from "@shared/constant";
import { ApiBaseService } from "./apibase.service";
import { environment } from "@env/environment";
import { FileUtil } from "@shared/shared/utils/file/file.util";
import { SizePolicy } from "@shared/policies/size-policy";
import { CommonEventService } from "./common-event/common-event.service";
import { AuthService } from "./auth.service";
import { DriveFolderService } from "drive/shared/services/drive-folder.service";

const uuidv1 = require("uuid/v1");
const uuidv3 = require("uuid/v3");
const AWS = require("aws-sdk");

@Injectable()
export class FileDriveUploadService {
  input: any;
  s3: any;
  config: any = {
    url: "drive/files/upload"
  };
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onStart: EventEmitter<any> = new EventEmitter();
  @Output() onDone: EventEmitter<any> = new EventEmitter();
  @Output() onProgress: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();

  constructor(
    private cookieService: CookieService,
    private commonEventService: CommonEventService,
    private driveFolder: DriveFolderService,
    private authService: AuthService,
    private apiBaseService: ApiBaseService
  ) { }

  open(
    options: { folderOnly: boolean; accept?: string } = {
      folderOnly: false,
      accept: "*"
    }
  ) {
    // if (!this.input) {
    //   this.input = document.createElement('input');
    //   this.input.type = "file";
    //   this.input.multiple = true;
    //   this.input.addEventListener('change', (event) => {
    //     this.onChange.emit(event);
    //   });
    // }
    const { folderOnly, accept } = options;
    if (folderOnly) {
      this.input = document.createElement("input");
      this.input.type = "file";
      this.input.webkitdirectory = "webkitdirectory";
      this.input.mozdirectory = "mozdirectory";
    } else {
      this.input = document.createElement("input");
      this.input.type = "file";
      this.input.multiple = true;
    }

    this.input.addEventListener("change", event => {
      // this.onChange.emit(event);
      this.onChange.emit(Object.assign(event, { folderOnly }));
    });
    this.input.click();
  }

  async uploadFolder(fileList: FileList, options: any = {}) {
    const folderSet = new Set<String>();
    const parent_id = options.parent_id;
    const filePathFolderPathMap = {};
    Object.values(fileList).forEach(file => {
      const {name} = file;
      const webkitRelativePath = file['webkitRelativePath'];
      const path = webkitRelativePath.slice(0, - name.length - 1);

      // TODO: Remove redundant paths: 'test', 'test/inside test'
      filePathFolderPathMap[webkitRelativePath] = path;
      folderSet.add(path);
    });


    const res = await this.driveFolder.create_from_path_arr(Array.from(folderSet), parent_id).toPromise();
    const folders = res.data;
    const name_id_map = res.name_id_map;

    // Display visible folders
    folders.forEach(folder => {
      if ((!folder.parent_id && !parent_id) || folder.parent_id == parent_id)
        this.onDone.emit(folder);
    });

    const files: Array<File> = Object.values(fileList).map(file => {
      const webkitRelativePath = file['webkitRelativePath'];
      const folderPath = filePathFolderPathMap[webkitRelativePath];
      const folder_id = name_id_map[folderPath];
      return Object.assign(file, {parent_id: folder_id});
    });

    console.log('files: ', files);

    // Create metadata for drive files
    const files2 = this.beforeUpload(files);

    // Upload to S3
    this.validateAndUpload(files2);

    return Promise.resolve(null);
  }


  upload(files: any, options: any = {}) {
    const files2 =  this.beforeUpload(files, options);
    this.validateAndUpload(files2);
  }


  retry(file: any, options: any) {
    this.beforeUpload([file], options);
    if (Constants.env === "PROD") {
      this.uploadS3(file);
    } else {
      this.uploadS3(file);
      // this.uploadLocal(file);
    }
  }

  abortMultipartUploadS3(file) {
    this.onError.emit(file);
    this.removeMetadata(file);
    const params = {
      Bucket: file.Bucket,
      Key: file.id,
      UploadId: file.UploadId
    };
    this.s3.abortMultipartUpload(params, (err, data) => {
      if (err) console.log(err, err.stack);
      else {
        // an error occurred
        console.log(data);
      }
    });
  }

  removeMetadata(file: any) {
    this.apiBaseService
      .post("drive/files/remove_metadata", { id: file.key })
      .subscribe(res => { });
  }

  createS3instane(res: any) {
    if (!this.s3) {
      AWS.config.update({
        region: res.data.region,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: res.data.pool_id
        })
      });
      this.s3 = new AWS.S3({
        apiVersion: res.data.version,
        params: { Bucket: res.data.bucket_name }
      });
    }
  }

  uploadS3(file: any) {
    this.apiBaseService
      .post("drive/files/create_metadata", {
        name: file.name,
        file_upload_id: file.id,
        type: file.type,
        size: file.data.size,
        parent_id: file.parent_id
      })
      .subscribe(
        res => {
          this.createS3instane(res);
          const reader = new FileReader();
          let partNum = 0;
          const uploadParts = [];
          file.key = res.data.key;
          file.owner = res.data.owner;
          reader.addEventListener(
            "load",
            (event: any) => {
              let mb = 50;
              if (event.total < 50 * 1000 * 1000) mb = 10;
              if (
                event.total >= 50 * 1000 * 1000 &&
                event.total < 150 * 1000 * 1000
              )
                mb = 30;
              const step = mb * 1000 * 1000;
              // Single uploading
              if (event.total < step) {
                const params = {
                  Bucket: res.data.bucket /* required */,
                  Key: file.id /* required */,
                  Body: file.data
                };
                this.s3.putObject(params, (err, data) => {
                  if (err) {
                    this.onError.emit(err);
                    this.removeMetadata(file);
                  } else {
                    this.onDone.emit({ ...file, ...res.data.file });
                  } // successful response
                });
              } else {
                // Multiple uploading
                const params = {
                  Bucket: res.data.bucket /* required */,
                  Key: file.id /* required */
                };

                this.s3.createMultipartUpload(params, (err, data) => {
                  if (err) {
                    file.error = err;
                    this.onError.emit(file);
                    this.removeMetadata(file);
                    return;
                  }
                  file.Bucket = res.data.bucket;
                  file.UploadId = data.UploadId;
                  this.onProgress.emit(file);
                  for (
                    let start = 0;
                    start < event.total;
                    start = start + step
                  ) {
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
                      if (err1) {
                        file.error = err1;
                        this.onError.emit(file);
                        this.removeMetadata(file);
                      } else {
                        uploadParts.push({
                          ETag: data1.ETag,
                          PartNumber: params1.PartNumber
                        });
                        if (uploadParts.length === partNum) {
                          uploadParts.sort((a: any, b: any) => {
                            return a.PartNumber - b.PartNumber;
                          });
                          const params2: any = {
                            Bucket: params.Bucket,
                            Key: params.Key,
                            MultipartUpload: {
                              Parts: uploadParts.map(part => ({
                                ETag: '"' + part.ETag + '"',
                                PartNumber: part.PartNumber
                              }))
                            },
                            UploadId: data.UploadId
                          };
                          this.s3.completeMultipartUpload(
                            params2,
                            (err2, data2) => {
                              if (err2) {
                                file.error = err2;
                                this.onError.emit(file);
                                this.removeMetadata(file);
                              } else
                                this.onDone.emit({ ...file, ...res.data.file }); // successful response
                            }
                          );
                        }
                      }
                    });
                  }
                });
              }
            },
            false
          );
          reader.readAsBinaryString(file.data);
        },
        err => {
          this.onError.emit(file);
        }
      );
  }

  uploadLocal(file: any) {
    const request = new XMLHttpRequest();
    request.upload.addEventListener("progress", e => {
      this.onProgress.emit(file);
    });
    request.upload.addEventListener("error", e => {
      file.error = e;
      this.onError.emit(file);
    });
    request.addEventListener("error", e => {
      file.error = e;
      this.onError.emit(file);
    });

    // Send POST request to the server side script
    request.open("post", Constants.baseUrls.apiUrl + this.config.url);
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader("ACCEPT", "application/json");
    const jwt = this.cookieService.get(Constants.cookieKeys.jwt);
    request.setRequestHeader("Authorization", "Bearer " + jwt);

    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        // end uploading
        this.onDone.emit(file);
      }
    };

    const form = new FormData();
    form.append("name", file.name);
    form.append("type", file.type);
    form.append("file", file.data);
    form.append("file_upload_id", file.id);
    request.send(form);
  }

  beforeUpload(files: Array<File>, options: any = {}): Array<any> {
    return Object.keys(files).map((key, index) => {
      const parent_id = files[key].parent_id || options.parent_id ;
      const id =
        uuidv1() +
        uuidv3(files[key].name, uuidv1()) +
        "." +
        FileUtil.getExtension(files[key]);
      const file_upload_id =
        "portal-frontend/users/" + this.authService.user.uuid + "/drive/" + id;
      return {
        id: id,
        data: files[key],
        name: files[key].name,
        type: files[key].type,
        file_upload_id: file_upload_id,
        parent_id: parent_id,
        percent: 0,
        index: index,
        full_name: files[key].name
      };
    });
  }

  download(file: any) {
    const doDownload = (s3Params: any) => {
      this.s3.getObject(s3Params, function (err, data) {
        if (err)
          console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
        const blob = new Blob([new Uint8Array(data.Body)], {
          type: file.content_type
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.full_name;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    };
    const params = {
      Bucket: Constants.s3Bucket,
      Key: file.file_upload_id
    };
    if (!this.s3) {
      this.apiBaseService.get("drive/s3/info").subscribe(res => {
        this.createS3instane(res);
        doDownload(params);
      });
    } else {
      doDownload(params);
    }
  }

  private validateAndUpload(files: any[]): void {
    files.forEach(f => {
          const sizePolicy = new SizePolicy(500);
          sizePolicy.validate(f.data);
        });
        const filesNotAllow = files.map(f => f.data).filter(f => {
          if (f.allow === false) {
            return true;
          }
          return false;
        });
        if (filesNotAllow && filesNotAllow.length > 0) {
          this.commonEventService.broadcast({
            channel: "LockMessage",
            payload: filesNotAllow
          });
        } else {
          this.onStart.emit(files);
          const filesAllow = files.filter(f => {
            if (f.allow === false) {
              return false;
            }
            return true;
          });
          filesAllow.forEach(f => {
            if (environment.production) {
              this.uploadS3(f);
            } else {
              this.uploadS3(f);
              // this.uploadLocal(f);
            }
          });
        }
  }
}
