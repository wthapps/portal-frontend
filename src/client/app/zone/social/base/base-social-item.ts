import { ApiBaseService } from '../../../shared/services/apibase.service';
import { PostComponent } from '../post/post.component';

export class BaseZoneSocialItem {
  item: any;

  apiBaseService: ApiBaseService;
  postItem?: PostComponent;

  loadItem(url: string) {
    return this.apiBaseService.get(url);
  }

  createComment(body: any) {
    return this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoComments}`, body);
  }

  updateComment(body: any) {
    return this.apiBaseService.put(`${this.apiBaseService.urls.zoneSoComments}/${body.uuid}`, body);
  }

  deleteComment(commentUuid: string) {
    return this.apiBaseService.delete(`${this.apiBaseService.urls.zoneSoComments}/${commentUuid}`);
  }

  createReply(body: any) {
    return this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoComments}`, body);
  }

  updateReply(body: any) {
    return this.apiBaseService.put(`${this.apiBaseService.urls.zoneSoComments}/${body.reply_uuid}`, body);
  }

  deleteReply(body: any) {
    return this.apiBaseService.delete(`${this.apiBaseService.urls.zoneSoComments}/${body.reply_uuid}`);
  }
}
