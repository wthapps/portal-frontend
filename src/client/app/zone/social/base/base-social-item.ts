import { BaseZoneSocial } from "./base-social";
import { ApiBaseServiceV2 } from "../../../shared/services/apibase.service.v2";

export class BaseZoneSocialItem extends BaseZoneSocial {
  item: any;

  apiBaseServiceV2: ApiBaseServiceV2;

  loadItem(url: string) {
    return this.apiBaseServiceV2.get(url);
  }

  createComment(content:string) {
    return this.apiBaseServiceV2.post(`${this.apiBaseServiceV2.urls.zoneSoPosts}/${this.item.uuid}/comments`, {content: content});
  }
}
