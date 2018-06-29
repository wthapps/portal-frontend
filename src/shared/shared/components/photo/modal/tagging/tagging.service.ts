import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiBaseService } from '@wth/shared/services';

@Injectable()
export class ZMediaTaggingService {
  readonly tagUrl: string = 'media/tags';
  constructor(private apiBaseService: ApiBaseService) {
  }

  getAll() {
    return this.apiBaseService.get(this.tagUrl);
  }

  getTags(keys: any): Observable<any> {
    return this.apiBaseService.get(this.tagUrl, {q: `name:${keys}`});
  }

  save(body: any) {
    return this.apiBaseService.put(`${this.tagUrl}/update`, body);
  }

  saveMultiple(body: any) {
    return this.apiBaseService.post(`${this.tagUrl}/update_multiple`, body);
  }
}
