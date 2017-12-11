import { Injectable } from '@angular/core';
import { BaseEntityService } from '@shared/services/base-entity-service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { MixedEntity } from './mixed-entity.model';

@Injectable()
export class MixedEntityService extends BaseEntityService<MixedEntity> {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = 'note/mixed_entities';
  }
}
