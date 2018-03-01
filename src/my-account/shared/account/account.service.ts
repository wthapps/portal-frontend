import { Injectable } from '@angular/core';

import { BaseEntityService } from '@wth/shared/services/base-entity-service';
import { ApiBaseService } from '@wth/shared/services/apibase.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountService extends BaseEntityService<any> {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = 'account/accounts';
  }

  getAccounts(payload: any): Observable<any> {

    return this.api.get(`account/accounts/${payload.id}/accounts`);

  }
}
