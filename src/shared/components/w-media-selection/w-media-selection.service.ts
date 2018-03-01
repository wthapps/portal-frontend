import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators/tap';

import { Media } from '@shared/shared/models/media.model';
import { ApiBaseService } from '@shared/services';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';

declare let _: any;

@Injectable()
export class WMediaSelectionService {
  medias$: any;
  private mediasSubject: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>(null);

  mediaParent$: any;
  private mediaParentSubject: BehaviorSubject<Media> = new BehaviorSubject<Media>(null);

  constructor(private apiBaseService: ApiBaseService,
              private datePipe: DatePipe) {
    this.medias$ = this.mediasSubject.asObservable();
    this.mediaParent$ = this.mediaParentSubject.asObservable();
  }

  getMedias(nextLink?: any) {
    const link = nextLink ? nextLink : 'media/photos';
    return this.apiBaseService.get(link).pipe(
      tap((res: ResponseMetaData) => {

        _.map(res.data, (v: any, k: any) => {
          res.data[k].group_by_day = this.datePipe.transform(v.created_at, 'yyyy-MM-dd');
          res.data[k].group_by_month = this.datePipe.transform(v.created_at, 'yyyy-MM');
          res.data[k].group_by_year = this.datePipe.transform(v.created_at, 'yyyy');
        });


        if (!this.mediasSubject.getValue()) {
          this.mediasSubject.next(res.data);
        } else {
          let medias = this.mediasSubject.getValue().concat(res.data);
          this.mediasSubject.next(medias);
        }
      })
    );
  }

  clear() {
    this.mediasSubject.next(null);
  }


  setMediaParent(media: Media) {
    this.mediaParentSubject.next(media);
  }

  clearMediaParent() {
    this.mediaParentSubject.next(null);
  }
}

