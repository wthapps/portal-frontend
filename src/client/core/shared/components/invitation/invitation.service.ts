import { Injectable } from '@angular/core';
import { BaseEntityService } from '../../services/base-entity-service';
import { ApiBaseService } from '../../services/apibase.service';
import { Invitation } from './invitation.model';
import { Observable } from 'rxjs/Observable';

declare var _: any;

@Injectable()
export class InvitationService extends BaseEntityService<Invitation> {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = 'my_account/invitations';
  }

  resend(body: any): Observable<any> {
    return this.api.put(this.url + '/resend', body);
  }
}
