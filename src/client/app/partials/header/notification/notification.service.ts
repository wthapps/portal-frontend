import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../shared/index';

/**
 * Created by phat on 18/11/2016.
 */
@Injectable()
export class NotificationService {

  constructor(private api: ApiBaseService) {
  }

  get() {
    return this.api.get(`zone/social_network/notifications`);
  }
}




