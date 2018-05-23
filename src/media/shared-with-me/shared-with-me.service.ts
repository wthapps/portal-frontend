import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services';

@Injectable()
export class ZMediaSharedWithMeService {
  url = 'media/shared_with_me';

  constructor(private apiBaseService: ApiBaseService) {}

  list(shareUuid?: any): any {
    let body = shareUuid !== undefined ? { uuid: shareUuid } : {};
    return this.apiBaseService.get(this.url, body);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }
}
