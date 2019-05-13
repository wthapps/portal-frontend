import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import DriveFile from '@shared/modules/drive/models/drive-file.model';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { BaseEntityService, ApiBaseService } from '@shared/services';
import DriveUtils from '../utils/drive-utils';


export type DriveType = DriveFolder | DriveFile;

@Injectable()
export class DriveApiService  extends BaseEntityService<any> {

  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'drive/drive';
  }

  deleteMany(payload?: DriveType[], path: string = ''): Observable<any> {
    const { fileIds, folderIds} = DriveUtils.parse(payload);
    return this.apiBaseService.post(`${this.url}/delete_many`, {folders: folderIds, files: fileIds});
  }
}
