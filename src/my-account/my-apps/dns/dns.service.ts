import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services/apibase.service';

@Injectable()
export class MyDNSService {

  constructor(private apiBaseService: ApiBaseService) {
  }

  get(id: any) {
    return this.apiBaseService.get(`users/${id}/dns/records`);
  }

  getHost(id: any, idUser: any) {
    return this.apiBaseService.get(`users/${idUser}/dns/records/${id}`);
  }

  addNewHost(body: any, idUser: any) {
    return this.apiBaseService.post(`users/${idUser}/dns/records/`, body);
  }

  updateHost(id: any, body: any, idUser: any) {
    return this.apiBaseService.patch(`users/${idUser}/dns/records/${id}`, body);
  }

  delete(id: any, idUser: any) {
    return this.apiBaseService.delete(`users/${idUser}/dns/records/${id}`);
  }
}
