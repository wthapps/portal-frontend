import { Injectable } from '@angular/core';
import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

@Injectable()
export class NoteService extends BaseEntityService {

  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = '/notes'
  }
}
