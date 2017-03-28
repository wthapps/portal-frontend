import { Injectable } from '@angular/core';
import { ApiBaseService } from './apibase.service';
import { Constants } from '../config/constants';
import { UUID } from 'angular2-uuid';

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

  readonly soPhotoUrl: string = Constants.urls.zoneSoPhotos;

  constructor(private apiService: ApiBaseService) {
    if (!this.albumTempBucketName)
      this.loadConfig();
  }

  loadConfig() {
    this.apiService.post(`${this.soPhotoUrl}/get_aws_config`).subscribe((data: any) => {
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
  // Rename to uploadPhotos
  upload(file: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      var ext = file.name.split('.').reverse()[0];
      let fileName = UUID.UUID() + '.' + ext ; // cat.jpg => <uuid>.jpg
      let tempImageUrl : string = '';
      let imageUrl: string = '';
      let imageName: string = '';
      let imageUrlThumbnail: string = '';
      let body: any = {};

      var photoKey = this.bucketSubFolder + '/' + fileName;
      var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
      this.s3.upload({
          Key: photoKey,
          Body: file,
          ACL: 'public-read'
        }, options, (err: any, data: any) => {
          if (err)
            reject(err);
          else {
            console.log('Successfully uploaded photo.', data);

            imageName = data.key;
            tempImageUrl = data.Location;;
            imageUrl = this.getCompressUrl(tempImageUrl);
            imageUrlThumbnail = this.getThumbnailUrl(tempImageUrl);
            body = {
              name: imageName,
              url: imageUrl,
              thumbnail_url: imageUrlThumbnail
            };

            // Delay 4s waiting for image thumbnail to be created
            this.apiService.post(`${this.soPhotoUrl}/save_photo_info`, body)
              .subscribe((result: any) => {
                setTimeout(() => {
                  resolve(result['data']);
                }, 4000);
              },
                (err2: any) => { reject(err2); });
          }
        }
      );
    });
  }

  uploadPhotos(photo: any) {
    return this.upload(photo);
  }

  // TODO
  uploadFiles(files: any) {

  }


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
