import { Injectable } from '@angular/core';
import { BaseEntityService } from '@wth/shared/services/base-entity-service';
import { ApiBaseService } from '@wth/shared/services/apibase.service';



@Injectable()
export class SubscriptionService extends BaseEntityService<any> {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = 'account/subscriptions';
  }
}
