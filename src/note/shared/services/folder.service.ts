
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { BaseEntityService } from '@shared/services/base-entity-service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Response } from '@angular/http';

declare var _: any;

@Injectable()
export class ZFolderService extends BaseEntityService<any> {

  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'note/folders';

  }

  getRootFolders(): Observable<any> {
    return this.apiBaseService.post(`${this.url}/get_root`);
  }

  getFolderPath(params: any): Observable<any> {
    return this.apiBaseService.get(`${this.url}/get_folder_path/${params.id}`, params);
  }

  private handleError(error: Response) {
    console.error(error);
    return observableThrowError(error.json().error || 'Server error');
  }
}
