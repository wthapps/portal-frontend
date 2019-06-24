import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseEntityService, ApiBaseService } from '@shared/services';
import DriveUtils from '../utils/drive-utils';
import { DriveType } from '../config/drive-constants';


@Injectable()
export class DriveApiService  extends BaseEntityService<any> {

  readonly trashUrl = 'drive/trashs';
  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'drive/drive';
  }

  deleteMany(payload?: DriveType[], path: string = ''): Observable<any> {
    const { fileIds, folderIds} = DriveUtils.parse(payload);
    return this.apiBaseService.post(`${this.url}/delete_many`, {folders: folderIds, files: fileIds});
  }

  permanentDelete(body): Observable<any> {
    return this.apiBaseService.post(`${this.trashUrl}/permanent_delete`, body);
  }

  restore(body): Observable<any> {
    return this.apiBaseService.post(`${this.trashUrl}/restore`, body);
  }

  emptyAll(): Observable<any> {
    return this.apiBaseService.post(`${this.trashUrl}/empty_all`);
  }
}
