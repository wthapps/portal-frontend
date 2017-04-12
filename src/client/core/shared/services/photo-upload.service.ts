import { Injectable } from '@angular/core';
import { ApiBaseService } from './apibase.service';
import { Constants } from '../config/constants';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

declare var AWS: any;
declare let _: any;
declare let Promise: any;



@Injectable()
export class PhotoUploadService {
  albumTempBucketName: string;
  bucketRegion: string;
  bucketSubFolder: string; // portal-frontend/photos
  identityPoolId: string;
  s3: any;
  readonly SUFFIX: string = '-temp-upload';
  readonly TIMEOUT : number =  4000;

  readonly soPhotoUrl: string = Constants.urls.zoneSoPhotos;

  constructor(private apiService: ApiBaseService) {
    this.loadConfigOnce();
  }

  loadConfigOnce() {
    if (!this.albumTempBucketName || !this.bucketRegion)
      this.loadConfig();
  }

  loadConfig() {
    // ONLY load config 1 time
    this.apiService.post(`${this.soPhotoUrl}/get_aws_config`).take(1).subscribe((data: any) => {
      this.albumTempBucketName = data.tempBucket;
      this.bucketRegion = data.region;
      this.bucketSubFolder = data.bucketSubFolder;
      this.identityPoolId = data.identityPoolId;

      this.init();
    },(err: any) => {
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

  // TODO: Convert this function to be a Observable
  // Deprecated
  // upload(file: any): Promise<any> {
  //
  //   return new Promise((resolve: any, reject: any) => {
  //     var ext = file.name.split('.').reverse()[0];
  //     let fileName = UUID.UUID() + '.' + ext ; // cat.jpg => <uuid>.jpg
  //     let tempImageUrl : string = '';
  //     let imageUrl: string = '';
  //     let imageName: string = '';
  //     let imageUrlThumbnail: string = '';
  //     let body: any = {};
  //
  //     var photoKey = this.bucketSubFolder + '/' + fileName;
  //     var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
  //     this.s3.upload({
  //         Key: photoKey,
  //         Body: file,
  //         ACL: 'public-read'
  //       }, options, (err: any, data: any) => {
  //         if (err)
  //           reject(err);
  //         else {
  //           console.log('Successfully uploaded photo.', data);
  //
  //           imageName = data.key;
  //           tempImageUrl = data.Location;;
  //           imageUrl = this.getCompressUrl(tempImageUrl);
  //           imageUrlThumbnail = this.getThumbnailUrl(tempImageUrl);
  //           body = {
  //             name: imageName,
  //             url: imageUrl,
  //             thumbnail_url: imageUrlThumbnail
  //           };
  //
  //           // Delay 4s waiting for image thumbnail to be created
  //           this.apiService.post(`${this.soPhotoUrl}/save_photo_info`, body)
  //             .subscribe((result: any) => {
  //               setTimeout(() => {
  //                 resolve(result['data']);
  //               }, 4000);
  //             },
  //               (err2: any) => { reject(err2); });
  //         }
  //       }
  //     );
  //   });
  // }

  getPhoto(photo: any): Observable<any> {
    return Observable.create((observer: any) => {
        let reader: FileReader = new FileReader();

        reader.onload = (data: any) => {
          observer.next(data.target['result']);
          observer.complete();
        };
        reader.readAsDataURL(photo);
      });
  }

  /**
   * Upload multiple photos to s3 and convert output streams to Observable
   * @param photos
   * @returns {any}
   */
  uploadPhotos(photos: Array<any>): Observable<any> {
    return Observable.create((observer: any) => {
      for (let i = 0; i < photos.length; i++) {
        let file = photos[i];
        let reader: FileReader = new FileReader();

        reader.onload = (data: any) => {
          let currentPhoto = data.target['result'];
          console.log('photos data: ', data, ' file name: ', file.name);

          let ext = file.name.split('.').reverse()[0];
          let fileName = file.name;
          let encodedFileName = UUID.UUID() + '.' + ext ; // cat.jpg => <uuid>.jpg
          let photoKey = this.bucketSubFolder + '/' + encodedFileName;
          let options = {partSize: 10 * 1024 * 1024, queueSize: 1};
          this.s3.upload({
            Key: photoKey,
            Body: file,
            ACL: 'public-read'
          }, options, (err: any, data: any) => {
            if (err)
              observer.error(err);
            else {
              console.log('Successfully uploaded photo.', data);

              // let imageName = data.key;
              let tempImageUrl = data.Location;;
              let imageUrl = this.getCompressUrl(tempImageUrl);
              let imageUrlThumbnail = this.getThumbnailUrl(tempImageUrl);
              let body = {
                name: fileName,
                image: currentPhoto,
                url: imageUrl,
                thumbnail_url: imageUrlThumbnail
              };

              // TODO: Implement polling to reduce delay time
              // Delay 4s waiting for image thumbnail to be created
              this.apiService.post(`${this.soPhotoUrl}/save_photo_info`, body)
                .subscribe((result: any) => {
                    setTimeout(() => {
                      let wrapperRes = { data: result['data'], current_photo: currentPhoto};
                      // observer.next(result['data']);
                      observer.next(wrapperRes);
                    }, this.TIMEOUT);
                  },
                  (err2: any) => { observer.error(err2); });
            }
          });
        };
        reader.readAsDataURL(file);
      };
    });
  }



  // uploadPhotos(photo: any) {
  //   return this.upload(photo);
  // }


  // TODO:
  remove(file: any) {

  }

  // Expected result:
  //    https://env-staging-oregon-temp-upload.s3-us-west-2.amazonaws.com/small.cat.jpg
  // => https://env-staging-oregon.s3-us-west-2.amazonaws.com/small.cat-thumb.jpg
  getThumbnailUrl(tempUrl: string) {
    let str = tempUrl.replace(this.SUFFIX, '');
    return str.replace(new RegExp('.([a-zA-Z]*)*$'),'-thumb.$1'); // small.cat.jpg => small.cat-thumb.jpg
  }


  // Expected result:
  //    https://env-staging-oregon-temp-upload.s3-us-west-2.amazonaws.com/small.cat.jpg
  // => https://env-staging-oregon.s3-us-west-2.amazonaws.com/small.cat-compress.jpg
  private getCompressUrl(tempUrl: string) {
    let str = tempUrl.replace(this.SUFFIX, '');
    return str.replace(new RegExp('.([a-zA-Z]*)*$'),'-compress.$1'); // small.cat.jpg => small.cat-compress.jpg
  }
}
