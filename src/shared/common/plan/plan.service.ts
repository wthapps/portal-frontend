import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '@wth/shared/services/apibase.service';

@Injectable()
export class PlanService {
  path = 'account/payment/plans';
  constructor(private apiBaseService: ApiBaseService) {}
  getAll(): Observable<any> {
    return this.apiBaseService.get(`${this.path}`);
  }

  getCurrent(): Observable<any> {
    return this.apiBaseService.get(`${this.path}/get_current`);
  }
}
