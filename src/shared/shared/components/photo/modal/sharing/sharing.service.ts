import { Injectable } from '@angular/core';

import { ApiBaseService, BaseEntityService } from '@wth/shared/services';

@Injectable()
export class SharingService extends BaseEntityService<any> {
  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'media/sharings';
  }

  getContacts(query: string = ''): any {
    let body: any;
    body = {'q': (query === 'undefined' ? '' : 'name:' + query)};
    return this.apiBaseService.get('contact/contacts', body);
  }

  getContactGroups(): any {
    return this.apiBaseService.get('zone/contactgroups');
  }

  getShared(body: any): any {
    return this.apiBaseService.post('media/sharings/get_sharing_info', body);
  }

  update(body: any): any {
    return this.apiBaseService.put('media/sharings/update', body);
  }

  add(body: any): any {
    return this.apiBaseService.post(`media/sharings`, body);
  }

  addObjects(payload): any {
    return this.apiBaseService.post(`${this.url}/${payload.sharing.id}/objects`, {objects: payload.objects});
  }

  removeObjects(payload: any): any {
    return this.apiBaseService.post(`${this.url}/${payload.sharing.id}/objects/delete_many`, {objects: payload.objects});
  }
}
