import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../../services/apibase.service';

@Injectable()
export class ZMediaSharingService {
  constructor(private apiBaseService: ApiBaseService) {
  }

  getContacts(query: string = ''): any {
    let body: any;
    body = {'q': (query == undefined ? '' : "name:"+query)};
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
}
