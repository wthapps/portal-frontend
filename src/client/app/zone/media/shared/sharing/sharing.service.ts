import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../../shared/services/apibase.service';

@Injectable()
export class ZMediaSharingService {
  constructor(private apiBaseService: ApiBaseService) {
  }

  getContacts(): any {
    return this.apiBaseService.get('zone/contacts');
  }

  getContactGroups(): any {
    return this.apiBaseService.get('zone/contactgroups');
  }

  getShared(body: any): any {
    return this.apiBaseService.post('zone/sharings/get_sharing_info', body);
  }

  update(body: any): any {
    return this.apiBaseService.put('zone/sharings/update', body);
  }

  add(body: any): any {
    return this.apiBaseService.post(`zone/sharings`, body);
  }
}
