import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { PostComponent } from '../post/post.component';

export class BaseZoneSocialItem {
  item: any;

  apiBaseServiceV2: ApiBaseServiceV2;
  postItem?: PostComponent;

  loadItem(url: string) {
    return this.apiBaseServiceV2.get(url);
  }

  createComment(body: any) {
    return this.apiBaseServiceV2.post(`${this.apiBaseServiceV2.urls.zoneSoComments}`, body);
  }

  updateComment(body: any) {
    return this.apiBaseServiceV2.put(`${this.apiBaseServiceV2.urls.zoneSoComments}/${body.uuid}`, body);
  }

  deleteComment(commentUuid: string) {
    return this.apiBaseServiceV2.delete(`${this.apiBaseServiceV2.urls.zoneSoComments}/${commentUuid}`);
  }

  createReply(body: any) {
    return this.apiBaseServiceV2.post(`${this.apiBaseServiceV2.urls.zoneSoComments}`, body);
  }

  updateReply(body: any) {
    return this.apiBaseServiceV2.put(`${this.apiBaseServiceV2.urls.zoneSoComments}/${body.reply_uuid}`, body);
  }

  deleteReply(body: any) {
    return this.apiBaseServiceV2.delete(`${this.apiBaseServiceV2.urls.zoneSoComments}/${body.reply_uuid}`);
  }
}
