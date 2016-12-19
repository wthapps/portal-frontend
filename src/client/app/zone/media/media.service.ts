import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../shared/services/apibase.service';

@Injectable()
export class ZMediaService {

  url = 'zone/photos';

  constructor(private apiBaseService: ApiBaseService) {
  }

  listPhoto(): any {
    return this.apiBaseService.get(this.url);
  }

  actionOneFavourite(type: string, item: any) {

    let body = JSON.stringify({
      ids: [item.id],
      setFavourite: (item.favorite) ? false : true
    });

    return this.apiBaseService.post('zone/photos/favourite', body);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }
}
