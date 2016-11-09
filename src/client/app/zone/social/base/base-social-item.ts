import { BaseZoneSocial } from "./base-social";
import { ApiBaseServiceV2 } from "../../../shared/services/apibase.service.v2";

export class BaseZoneSocialItem extends BaseZoneSocial {
  item: any;

  apiBaseServiceV2: ApiBaseServiceV2;

  loadItem(url: string) {
    return this.apiBaseServiceV2.get(url);
  }

  createComment(body:any) {
    return this.apiBaseServiceV2.post(`${this.apiBaseServiceV2.urls.zoneSoPosts}/${this.item.uuid}/comments`, body);
  }

  updateComment(body:any) {
    return this.apiBaseServiceV2.put(`${this.apiBaseServiceV2.urls.zoneSoPosts}/${this.item.uuid}/comments/${body.uuid}`, body);
  }

  deleteComment(commentUuid:string) {
    return this.apiBaseServiceV2.delete(`${this.apiBaseServiceV2.urls.zoneSoPosts}/${this.item.uuid}/comments/${commentUuid}`);
  }

  createReply(body:any) {
    return this.apiBaseServiceV2.post(`${this.apiBaseServiceV2.urls.zoneSoPosts}/${this.item.uuid}/comments/${body.comment_uuid}/replies`, body);
  }
}
