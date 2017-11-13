import { Injectable } from '@angular/core';

import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

@Injectable()
export class AccountService extends BaseEntityService<any> {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = 'account/accounts';
  }
}
