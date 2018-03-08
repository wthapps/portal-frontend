import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators/tap';

import { Media } from '@shared/shared/models/media.model';
import { ApiBaseService } from '@shared/services';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';

declare let _: any;

@Injectable()
export class WMediaSelectionService {
  medias$: any;
  private mediasSubject: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>(null);

  uploadingMedias$: any;
  private uploadingMediaSubject: Subject<any[]> = new Subject<any[]>();

  selectedMedias$: Observable<any[]>;
  private selectedMediasSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  mediaParent$: any;
  private mediaParentSubject: BehaviorSubject<Media> = new BehaviorSubject<Media>(null);

  open$: any;
  private openSubject: Subject<boolean> = new Subject<boolean>();

  multipleSelection$: any;
  private multipleSelectionSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private apiBaseService: ApiBaseService,
              private objectListService: WObjectListService,
              private datePipe: DatePipe) {
    this.medias$ = this.mediasSubject.asObservable();
    this.uploadingMedias$ = this.uploadingMediaSubject.asObservable();
    this.selectedMedias$ = this.selectedMediasSubject.asObservable();
    this.mediaParent$ = this.mediaParentSubject.asObservable();
    this.open$ = this.openSubject.asObservable();
    this.multipleSelection$ = this.multipleSelectionSubject.asObservable();
  }

  open() {
    this.openSubject.next(true);
  }

  close() {
    this.openSubject.next(false);
    this.clear();
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

  upload(medias: any[]) {
    this.uploadingMediaSubject.next(medias);
  }

  clear() {
    this.mediasSubject.next(null);
    this.selectedMediasSubject.next([]);
    this.mediaParentSubject.next(null);
    this.objectListService.clear();
  }

  setMediaParent(media: Media) {
    this.mediaParentSubject.next(media);
  }

  setMultipleSelection(active: boolean) {
    this.objectListService.setMultipleSelection(active);
  }

  setSelectedMedias(medias: Media[]) {
    let newMedias = this.mediasSubject.getValue().filter((media: any) => {
      return medias.some((m: any) => {
        return (media.id === m.id && media.object_type === m.object_type);
      });
    });
    this.selectedMediasSubject.next(newMedias);
  }

  clearSelectedMedias() {
    this.selectedMediasSubject.next([]);
    this.objectListService.clear();
  }

  clearMediaParent() {
    this.mediaParentSubject.next(null);
  }

}

