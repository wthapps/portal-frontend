import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/shared/services/apibase.service';

@Injectable()
export class MyPlansService {

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(): any {
    return this.apiBaseService.get('apps/all'); // @TODO refactor with path /product; also refactor in API
  }

  get(): any {
    return this.apiBaseService.get('plans');
  }

}
