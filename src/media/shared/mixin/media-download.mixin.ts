import { ApiBaseService } from "@shared/services";
import { Observable } from "rxjs";
import { saveAs } from 'file-saver';

/* MediaDownloadMixin This is media download methods, to
custom method please overwirte any method*/
export class MediaDownloadMixin {
  constructor(public apiBaseService: ApiBaseService) {}
  downloadMedia(media: any) {
    if (media) {
      const result = [];
      media.forEach(file => {
        this.apiBaseService.download('media/files/download', { id: file.id, model: file.model }).subscribe(res => {
          const blob = new Blob([res], { type: file.content_type });
          saveAs(blob, file.name + '.' + file.extension);
          result.push(res);
        },
          (error: any) => {
            return Observable.throw(error);
          })
      })
    }
  }
}
