import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services';

@Injectable()
export class ZMediaFavoriteService {
  url = 'media/favorites';

  constructor(private apiBaseService: ApiBaseService) {}

  list(body: any = {}): any {
    return this.apiBaseService.get(this.url, body);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }
}
