import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators/tap';

import { Media } from '@shared/shared/models/media.model';
import { ApiBaseService } from '@shared/services';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';

declare let _: any;

@Injectable()
export class PlaylistListService {
  medias$: any;
  private mediasSubject: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>(null);

  constructor(private apiBaseService: ApiBaseService) {
    this.medias$ = this.mediasSubject.asObservable();
  }

  getMedias() {
    return this.apiBaseService.get('media/playlists').pipe(
      tap((res: ResponseMetaData) => {
        this.mediasSubject.next(res.data);
      })
    );
  }

  favourites(objects: any) {
    return this.apiBaseService
      .post(`media/favorites/toggle`, {objects: objects})
      .pipe(
        tap((res: ResponseMetaData) => {
          console.log(res);

          let medias: any = this.mediasSubject.getValue();

          _.map(res.data, (v: any) => {
            let itemIndex = _.findIndex(medias, ['id', v.id]);
            medias.splice(itemIndex, 1, v);
          });

          console.log('medias:', medias);

          this.mediasSubject.next(medias);
        })
      );
  }
}
