import { Injectable } from '@angular/core';

import { ApiBaseService } from '../../../core/shared/services/apibase.service';

declare var _: any;

@Injectable()
export class ZMediaSharedWithMeService {

  url = 'zone/share_with_me';

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(): any {
    return this.apiBaseService.get(this.url);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }
}
