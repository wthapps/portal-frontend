import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiBaseService, BaseEntityService } from '@shared/services';

@Injectable()
export class DriveFolderService extends BaseEntityService<any> {
  url = 'drive/folders';

  constructor(
    protected apiBaseService: ApiBaseService) {
      super(apiBaseService);
  }

  getFolderPath(body): Observable<any> {
    return this.apiBaseService.post(`${this.url}/get_folder_path/`, body);
  }

  create_from_path_arr(paths: String[], parent_id?: any) {
    return this.apiBaseService.post(`${this.url}/create_from_path_array`, {paths, parent_id});
  }

}
