import { Injectable } from '@angular/core';
import { throwError, Observable, from } from 'rxjs';
import { filter, delay, take, mergeMap } from 'rxjs/operators';






import { ApiBaseService } from './apibase.service';
import { Constants } from '../constant/config/constants';
import { UserService } from './user.service';

declare var AWS: any;
declare let _: any;
declare let Promise: any;
declare let window: any;

// export const EXT_LIST: any = ['jpeg', 'jpg', 'exif', 'tiff', 'gif', 'bmp',
// 'png', 'ppm', 'pgm', 'pbm', 'pnm', 'webp', 'hdr', 'heif', 'bat'];

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

  constructor(
    private apiService: ApiBaseService,
    private userService: UserService
  ) {
  }

  getPhoto(photo: any): Promise<any> {
    return new Promise((resolve: any) => {
      const reader: FileReader = new FileReader();

      reader.onload = (data: any) => {
        resolve(data.target['result']);
      };
      reader.readAsDataURL(photo);
    });
  }

  getValidImages(files: Array<any>): Array<any> {
    return files.filter(this.isValidImage);
  }

  isValidImage(file: any): boolean {
    return file.type.indexOf('image') > -1;
  }

  /**
   * Upload multiple photos to s3 and convert output streams to Observable
   * @param photos
   * @returns {any}
   */
  uploadPhotos(photos: Array<any>): Observable<any> {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      const err_msg = 'The File APIs are not fully supported in this browser.';
      return throwError(err_msg);
    }

    // ONLY Process 4 photos at a time
    return from(photos).pipe(mergeMap(
        (photo: any) => this.readFile(photo),
        (photo: any, data: any) => {
          // below code handles rename when pasting on Notes
          // worked around for this case
          let name = photo.name;
          if ('image' === photo.name.split('.')[0]) {
            name = name.replace('image', `image_${new Date().getTime()}`);
          }
          return {
            name: name,
            type: photo.type,
            file: data
          };
        },
        this.MAX_FILES
      ),
      mergeMap((combinedData: any) =>
          this.apiService.post('media/photos', combinedData),
        (combinedData: any, returnData: any) => {
          return { originPhoto: combinedData, data: returnData.data };
        },
        this.MAX_FILES
      ));
  }

  readFile(file: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      const reader: FileReader = new FileReader();

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
