import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Injectable()
export class ACAppsService {

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(): any {
    return this.apiBaseService.get('apps');
  }

  listFeatured() {
    return this.apiBaseService.get('apps?featured=featured');
  }

  listTop() {
    return this.apiBaseService.get('apps?featured=top');
  }

  listNew() {
    return this.apiBaseService.get('apps?featured=new');
  }

  detail(id: any) {
    return this.apiBaseService.get(`apps/${id}`);
  }

  checkAdded(id: any, idUser: any) {
    return this.apiBaseService.get(`users/${idUser}/apps/${id}/check_added`);
  }

  add(id: any, idUser: any) {
    return this.apiBaseService.post(`users/${idUser}/apps/${id}`, '');
  }
}
