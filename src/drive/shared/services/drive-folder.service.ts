import { Injectable } from '@angular/core';
import { ApiBaseService, BaseEntityService } from '@shared/services';

@Injectable()
export class DriveFolderService extends BaseEntityService<any> {
  url = 'drive/folders';

  constructor(
    protected apiBaseService: ApiBaseService) {
      super(apiBaseService);
      // this.url = 'drive/folders';
  }


}
