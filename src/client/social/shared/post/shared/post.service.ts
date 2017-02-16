import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
// import { ApiBaseService } from '../../../../shared/services/apibase.service';

@Injectable()
export class PostService {

  url = 'zone/social_network/posts';

  constructor(private api: ApiBaseService) {
  }

  list(queryParams: any = null): any {
    if (typeof queryParams == 'object') {
      if (queryParams['uuid'] == undefined) {
        return this.api.get(this.url);
      } else {
        return this.api.get(`zone/social_network/user_posts/${queryParams['uuid']}`, {type: queryParams['type']});
      }
    }
  }

  get(item: any) {

  }

  search(query: any) {

  }

  add(item: any): any {
    let body: any = JSON.stringify(item);
    return this.api.post(this.url, body);
  }

  update(item: any): any {
    console.log('updateing .............', item);
    let body: any = JSON.stringify(item);
    return this.api.put(`${this.url}/${item.uuid}`, body);
  }

  delete(item: any) {

  }

  loadItem(url: string) {
    return this.api.get(url);
  }

  createComment(body: any) {
    return this.api.post(`${this.api.urls.zoneSoComments}`, body);
  }

  updateComment(body: any) {
    return this.api.put(`${this.api.urls.zoneSoComments}/${body.uuid}`, body);
  }

  deleteComment(commentUuid: string) {
    return this.api.delete(`${this.api.urls.zoneSoComments}/${commentUuid}`);
  }

  createReply(body: any) {
    return this.api.post(`${this.api.urls.zoneSoComments}`, body);
  }

  updateReply(body: any) {
    return this.api.put(`${this.api.urls.zoneSoComments}/${body.reply_uuid}`, body);
  }

  deleteReply(body: any) {
    return this.api.delete(`${this.api.urls.zoneSoComments}/${body.reply_uuid}`);
  }

}



