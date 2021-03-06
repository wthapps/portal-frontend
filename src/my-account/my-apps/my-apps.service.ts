import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services/apibase.service';

@Injectable()
export class MyMyAppsService {
  constructor(private apiBaseService: ApiBaseService) {}

  list(idUser: any) {
    return this.apiBaseService.get(`users/${idUser}/my-apps`);
  }

  get(id: any) {
    return this.apiBaseService.get(`apps/${id}`);
  }

  checkAdded(id: any, idUser: any) {
    return this.apiBaseService.get(`users/${idUser}/apps/${id}/check_added`);
  }
}
