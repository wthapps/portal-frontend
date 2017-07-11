import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { Label } from './label.model';
import { BaseEntityService } from '../../core/shared/services/base-entity-service';

@Injectable()
export class LabelService extends BaseEntityService<Label> {

  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'contact/labels';
  }
}
