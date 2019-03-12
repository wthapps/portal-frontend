import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject ,  Observable ,  Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Media } from '@shared/shared/models/media.model';
import { ApiBaseService } from '@shared/services';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { map } from 'rxjs/operators/map';

declare let _: any;

const DEFAULT_OPTIONS = {
  selectedTab: 'photos',
  hiddenTabs: [],
  allowSelectMultiple: true,
  allowCancelUpload: false,
  allowedFileTypes: ['image/*', 'video/mp4', 'video/x-m4v', 'video/*'],
  uploadButtonText: 'Upload photos',
  dragdropText: 'Drag your photos here'
};
@Injectable()
export class WMediaSelectionService {
  medias$: Observable<any>;
  private mediasSubject: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>(null);

  uploadingMedias$: Observable<any>;
  private uploadingMediaSubject: Subject<any[]> = new Subject<any[]>();

  selectedMedias$: Observable<any[]>;
  private selectedMediasSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  mediaParent$: Observable<any>;
  private mediaParentSubject: BehaviorSubject<Media> = new BehaviorSubject<Media>(null);

  open$: Observable<any>;
  private openSubject: Subject<any> = new Subject<any>();

  multipleSelection$: Observable<any>;
  private multipleSelectionSubject: Subject<boolean> = new Subject<boolean>();

  private options = DEFAULT_OPTIONS;
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
   *
   * @param options
   */
  open(options: any = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.clear();
    this.objectListService.setMultipleSelection(this.options.allowSelectMultiple);
    this.objectListService.setGroupBy('');
    this.openSubject.next(this.options);
  }

  getOptions() {
    return this.options;
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
        }));


        if (!this.mediasSubject.getValue() || override) {
          this.mediasSubject.next(data);
        } else {
          const medias = this.mediasSubject.getValue().concat(data);
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

  upload(options: any) {
    this.uploadingMediaSubject.next(options);
  }

  clear() {
    this.mediasSubject.next([]);
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
    const newMedias = this.mediasSubject.getValue().filter((media: any) => {
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

