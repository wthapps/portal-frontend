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
import { map } from 'rxjs/operators/map';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators/catchError';

declare let _: any;

@Injectable()
export class WMediaSelectionService {
  medias$: any;
  private mediasSubject: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>([]);

  uploadingMedias$: any;
  private uploadingMediaSubject: Subject<any[]> = new Subject<any[]>();

  selectedMedias$: Observable<any[]>;
  private selectedMediasSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  mediaParent$: any;
  private mediaParentSubject: BehaviorSubject<Media> = new BehaviorSubject<Media>(null);

  open$: any;
  private openSubject: Subject<any> = new Subject<any>();

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

  /**
   * upload, photos, albums, favourites, shared_with_me
   * @param {string} currentTab
   */
  open(currentTab: string = 'upload') {
    this.openSubject.next({currentTab: currentTab});
  }

  close() {
    this.openSubject.next(null);
    this.clear();
  }

  getMedias(nextLink?: any, override?: boolean): Observable<any> {
    const link = nextLink ? nextLink : 'media/photos';
    return this.apiBaseService.get(link).pipe(
      map((res: ResponseMetaData) => {
        const data = res.data.map((item) => ({...item, group_by_day: this.datePipe.transform(item.created_at, 'yyyy-MM-dd'),
          group_by_month: this.datePipe.transform(item.created_at, 'yyyy-MM'),
          group_by_year: this.datePipe.transform(item.created_at, 'yyyy')
        }))


        if (!this.mediasSubject.getValue() || override) {
          this.mediasSubject.next(data);
        } else {
          let medias = this.mediasSubject.getValue().concat(data);
          this.mediasSubject.next(medias);
        }
        return res;
      }),
      catchError((err: any) => {
        console.warn('error: ', err);
        this.mediasSubject.next([]);
        return Observable.throw(err);
      })
    );
  }

  upload(medias: any[]) {
    this.uploadingMediaSubject.next(medias);
  }

  clear() {
    // this.mediasSubject.next([]);
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

