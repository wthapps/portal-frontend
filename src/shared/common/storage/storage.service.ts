import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '@wth/shared/services/apibase.service';

@Injectable()
export class StorageService {
  constructor(private apiBaseService: ApiBaseService) {}
  getAll(): Observable<any> {
    return this.apiBaseService.get(`admin/storages`);
  }

  getCurrent(): Observable<any> {
    return this.apiBaseService.get(`account/payment/storages/get_current`);
  }
}
