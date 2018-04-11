import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService {
  constructor(protected api: ApiBaseService) {
  }
  search(path: string, queryParams: any): Observable<any> {
    return this.api.get(path, queryParams);
  }
}
