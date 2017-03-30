import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Injectable()
export class ZMediaSharedWithMeService {

  url = 'zone/share_with_me';

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(shareUuid?: any): any {
    let body = shareUuid !== undefined ? {uuid: shareUuid} : {};
    return this.apiBaseService.get(this.url, body);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }

}
