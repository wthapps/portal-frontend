import { Injectable } from '@angular/core';
import { BaseEntityService } from './base-entity-service';
import { GenericFile } from '../shared/models/generic-file.model';
import { ApiBaseService } from './apibase.service';

declare var _: any;

// DEPRECATED - Use WUploader instead
@Injectable()
export class GenericFileService extends BaseEntityService<GenericFile> {
  constructor(protected api: ApiBaseService) {
    super(api);
    this.url = 'common/files';
  }
}
