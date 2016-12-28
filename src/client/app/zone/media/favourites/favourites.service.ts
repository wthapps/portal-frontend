import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;

@Injectable()
export class ZMediaFavoriteService {

  url = 'zone/favorites';

  constructor(private apiBaseService: ApiBaseService) {
  }

  list(): any {
    return this.apiBaseService.get(this.url);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }
}
