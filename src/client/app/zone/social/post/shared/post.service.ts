import { Injectable } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { Observable } from 'rxjs';


@Injectable()
export class PostService {

  url = 'zone/social_network/posts';

  constructor(private api: ApiBaseServiceV2
              ) {
  }

  list(queryParams: any = null) {
    if (typeof queryParams == 'object') {
      this.url += '?' + this.api.paramsToString(queryParams);
    }
    return this.api.get(this.url);
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
    console.log("updateing .............", item);
    let body: any = JSON.stringify(item);
    return this.api.put(`${this.url}/${item.uuid}`, body);
  }

  delete(item: any) {

  }

}



