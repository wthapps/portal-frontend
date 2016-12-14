import { Injectable } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';

@Injectable()
export class PostService {

  url = 'zone/social_network/posts';

  constructor(private api: ApiBaseServiceV2) {
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

}



