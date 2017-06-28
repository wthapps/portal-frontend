import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../../shared/services/apibase.service';

@Injectable()
export class ZMediaSharingService {
  constructor(private apiBaseService: ApiBaseService) {
  }

  getContacts(searchName: string = ''): any {
    let body: any;
    body = {'search_name': (searchName == undefined ? '' : searchName)};
    console.log('getContacts: ', body);
    return this.apiBaseService.get('zone/contacts', body);
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
