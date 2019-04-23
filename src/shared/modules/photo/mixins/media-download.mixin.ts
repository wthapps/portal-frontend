import { ApiBaseService } from "@shared/services";
import { Observable } from "rxjs";
import { saveAs } from 'file-saver';

/* MediaDownloadMixin This is media download methods, to
custom method please overwirte any method*/
export class MediaDownloadMixin {
  constructor(public apiBaseService: ApiBaseService) {}
  downloadMedia(media: any, options: any = null) {
    if (media) {
      const result = [];
      media.forEach(file => {
        let params = { id: file.id, model: file.model };
        if (options) {
          params = { ...params, ...options };
        }
        this.apiBaseService.download('media/files/download', params).subscribe(res => {
          const blob = new Blob([res], { type: file.content_type });
          saveAs(blob, file.name + '.' + file.extension);
          result.push(res);
        },
          (error: any) => {
            return Observable.throw(error);
          });
      });
    }
  }

  // downloadPhotos(photos: Array<any> = [], options: any = null) {
  //   if (photos) {
  //     const result = [];
  //     photos.forEach(photo => {
  //       let params = { id: photo.id, model: photo.model };
  //       if (options) {
  //         params = { ...params, ...options };
  //       }
  //       this.apiBaseService.download('media/files/download', params).subscribe(res => {
  //           const blob = new Blob([res], { type: photo.content_type });
  //           saveAs(blob, photo.name + '.' + photo.extension);
  //           result.push(res);
  //         },
  //         (error: any) => {
  //           return Observable.throw(error);
  //         });
  //     });
  //   }
  // }
}
