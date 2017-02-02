import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Injectable()
export class ACPlansService {

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(): any {
    return this.apiBaseService.get('apps/all'); // @TODO refactor with path /product; also refactor in API
  }

  get(): any {
    return this.apiBaseService.get('plans');
  }

}
