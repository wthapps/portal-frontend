import { Injectable } from '@angular/core';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Invitation } from './invitation.model';

declare var _: any;

@Injectable()
export class InvitationService extends BaseEntityService<Invitation> {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = 'my_account/invitations';
  }
}
