import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';

import { BaseEntityService } from '../../../core/shared/services/base-entity-service';
import { Note } from '../../../core/shared/models/note.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Folder } from '../reducers/folder';

declare var _: any;

@Injectable()
export class ZFolderService extends BaseEntityService<any> {

  constructor(protected apiBaseService: ApiBaseService,
              private http: Http) {
    super(apiBaseService);
    this.url = 'note/folders';

  }

  getRootFolders(): Observable<any> {
    return this.apiBaseService.post(`${this.url}/get_root`);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
