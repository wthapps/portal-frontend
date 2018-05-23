import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services';

@Injectable()
export class PostService {

  readonly  url: string = 'zone/social_network/posts';

  constructor(private api: ApiBaseService) {
  }

  list(queryParams: any = null): any {
    if (typeof queryParams == 'object') {
      if (queryParams['uuid'] == undefined) {
        return this.api.get(this.url, {page_index: queryParams['page_index'], limit: queryParams['limit']});
      } else {
        return this.api.get(`zone/social_network/user_posts/${queryParams['uuid']}`, {type: queryParams['type'], page_index: queryParams['page_index'], limit: queryParams['limit']});
      }
    }
  }

  get(item: any) {
  //
  }

  search(query: any) {
  //
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
  //
  }

  loadItem(url: string) {
    return this.api.get(url);
  }

  loadComments(body: any) {
    return this.api.get(`${this.api.urls.zoneSoComments}`, body);
  }


}
