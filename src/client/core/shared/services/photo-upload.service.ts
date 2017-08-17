import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';

import { ApiBaseService } from './apibase.service';
import { Constants } from '../config/constants';
import { UserService } from './user.service';

declare var AWS: any;
declare let _: any;
declare let Promise: any;
declare let window: any;

// export const EXT_LIST: any = ['jpeg', 'jpg', 'exif', 'tiff', 'gif', 'bmp', 'png', 'ppm', 'pgm', 'pbm', 'pnm', 'webp', 'hdr', 'heif', 'bat'];

@Injectable()
export class PhotoUploadService {
  albumTempBucketName: string;
  bucketRegion: string;
  bucketSubFolder: string; // portal-frontend/photos
  identityPoolId: string;
  s3: any;
  readonly SUFFIX: string = '-temp-upload';
  readonly TIMEOUT: number = 4000;
  readonly MAX_FILES: number = 4; // only process 4 files at a time

  readonly soPhotoUrl: string = Constants.urls.zoneSoPhotos;

  constructor(private apiService: ApiBaseService,
              private userService: UserService) {
    this.loadConfigOnce();
  }

  loadConfigOnce() {
    // if (!this.albumTempBucketName || !this.bucketRegion)
    //   this.loadConfig();
  }

  loadConfig() {
    // ONLY load config 1 time
    this.apiService.post(`${this.soPhotoUrl}/get_aws_config`)
      .filter(() => this.userService.loggedIn)
      .delay(3000) // Delay this action 3s to prevent slow loading at initial time
      .take(1).subscribe((data: any) => {
      this.albumTempBucketName = data.tempBucket;
      this.bucketRegion = data.region;
      this.bucketSubFolder = data.bucketSubFolder;
      this.identityPoolId = data.identityPoolId;

      this.init();
    }, (err: any) => {
      console.error('Error loading config', err);
    });
  }

  init(): void {

    AWS.config.update({
      region: this.bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.identityPoolId
      })
    });

    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: this.albumTempBucketName}
    });
  }

  getPhoto(photo: any): Promise<any> {
    return new Promise((resolve: any) => {
        let reader: FileReader = new FileReader();

        reader.onload = (data: any) => {
          resolve(data.target['result']);
        };
        reader.readAsDataURL(photo);
    });
  }

  getValidImages(files: Array<any>): Array<any> {
    return _.filter(files, (f: any) => {
      return f.type.indexOf('image') > -1;
    });
  }

   /**
   * Upload multiple photos to s3 and convert output streams to Observable
   * @param photos
   * @returns {any}
   */
  uploadPhotos(photos: Array<any>): Observable<any> {
    if (!( window.File && window.FileReader && window.FileList && window.Blob )) {
      let err_msg = 'The File APIs are not fully supported in this browser.';
      console.error(err_msg);
      return Observable.throw(err_msg);
    }

    // ONLY Process 4 photos at a time
    return Observable.from(photos)
      .mergeMap((photo: any) => this.readFile(photo),
        (photo: any, data: any) => {
          return {
            name: photo.name,
            type: photo.type,
            file: data
          };
        },
        this.MAX_FILES
      )
      .mergeMap((combinedData: any) => this.apiService.post('media/photos', combinedData),
        (combinedData: any, returnData: any) => {
          return {originPhoto: combinedData, data: returnData.data};
        }, this.MAX_FILES);
  }

  readFile(file: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      let reader: FileReader = new FileReader();

      reader.onload = (data: any) => {
        resolve(data.target['result']);
      };

      reader.onerror = (error: any) => {
        reject(error);
        console.error('File could not be read: ', file, error);
      };
      reader.readAsDataURL(file);
    });
  }

}
