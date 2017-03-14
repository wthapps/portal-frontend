import { Injectable } from '@angular/core';

import { ApiBaseService } from './apibase.service';
import { Constants } from '../config/constants';
import { UUID } from 'angular2-uuid';
declare  let _: any;
declare  let AWS: any;
declare  let Promise: any;
/**
 * Created by phat on 18/11/2016.
 */


@Injectable()
export class PhotoUploadService {
  // albumBucketName: string = 'wthapps-test';
  // bucketRegion: string = 'us-west-2';
  // identityPoolId: string = 'us-west-2:4443ef08-5aac-4824-b1e9-46a875b2c20d';

  albumBucketName: string;
  bucketRegion: string;
  bucketSubFoler: string; // portal-frontend/photos
  identityPoolId: string;
  s3: any;

  readonly soPhotoUrl: string = Constants.urls.zoneSoPhotos;

  constructor(private apiService: ApiBaseService) {
    if (!this.albumBucketName)
      this.loadConfig();
  }

  loadConfig() {
    this.apiService.post(`${this.soPhotoUrl}/get_aws_config`).subscribe((data: any) => {
      this.albumBucketName = data.bucket;
      this.bucketRegion = data.region;
      this.bucketSubFoler = data.bucketSubFolder;
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
      params: {Bucket: this.albumBucketName}
    });
  }

  upload(file: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      var ext = file.name.split(".").reverse()[0];
      let fileName = UUID.UUID() + '.' + ext ; // cat.jpg => <uuid>.jpg
      let imageUrl: string = '';
      let imageName: string = '';
      let imageUrlThumbnail: string = '';
      let body: any = {};

      var photoKey = this.bucketSubFoler + "/" + fileName;
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
            imageUrl = data.Location;
            imageUrlThumbnail = this.getThumbnailUrl(imageUrl);
            body = {
              name: imageName,
              url: imageUrl,
              thumbnail_url: imageUrlThumbnail
            };
            resolve(body);
          }
        }
      );
    });
  }

  // TODO:
  remove(file: any) {

  }

  // Expected result:
  //    https://wthapps-test.s3-us-west-2.amazonaws.com/small.cat.jpg
  // => https://wthapps-test-thumbnail.s3-us-west-2.amazonaws.com/small.cat-thumb.jpg
  getThumbnailUrl(imageUrl: string) {
    let str = _.replace(imageUrl, this.albumBucketName, this.albumBucketName + '-thumbnail');
    return _.replace(str, new RegExp('.([a-zA-Z]*)*$'),'-thumb.$1'); // small.cat.jpg => small.cat-thumb.jpg
  }

  savePhotoInfo(body: any): any {
    return this.apiService.post(`${this.soPhotoUrl}/save_photo_info`, body);
  }


}
