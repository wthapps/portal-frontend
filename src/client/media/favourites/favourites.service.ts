import { Injectable } from '@angular/core';

import { ApiBaseService } from '../../core/shared/services/apibase.service';

declare var _: any;

@Injectable()
export class ZMediaFavoriteService {

  url = 'zone/favorites';

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(body:any = {}): any {
    return this.apiBaseService.get(this.url, body);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }
}
