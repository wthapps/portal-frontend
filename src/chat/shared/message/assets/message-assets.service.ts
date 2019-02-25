import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Media } from '@shared/shared/models/media.model';
import { map } from 'rxjs/operators/map';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { catchError } from 'rxjs/operators/catchError';
import { ApiBaseService } from '@shared/services';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { DatePipe } from '@angular/common';

@Injectable()
export class MessageAssetsService {
  medias$: Observable<Media[]>;
  open$: Observable<boolean>;
  private mediasSubject: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>(null);
  private openSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private apiBaseService: ApiBaseService,
              private objectListService: WObjectListService,
              private datePipe: DatePipe) {
    this.medias$ = this.mediasSubject.asObservable().pipe(distinctUntilChanged());
    this.open$ = this.openSubject.asObservable().pipe(distinctUntilChanged());
    // this.openSubject.next(false);
  }

  open() {
    this.openSubject.next(true);
  }

  close() {
    this.openSubject.next(false);
  }

  clear() {
    this.objectListService.clear();
    this.mediasSubject.next([]);
  }

  getMedias(nextLink?: any, override?: boolean): Observable<any> {
    const link = nextLink ? nextLink : 'media/photos';
    return this.apiBaseService.get(link).pipe(
      map((res: ResponseMetaData) => {
        const data = res.data.map((item) => ({
          ...item, group_by_day: this.datePipe.transform(item.created_at, 'yyyy-MM-dd'),
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

  /**
   *
   * @param messageList
   * Merge message assets data with latest message list in current conversation: insert or delete assets.
   */
  mergeData(messageList) {
    const inactiveIds = messageList.reduce((arr, item) => item.deleted ? [...arr, item.id] : arr, []);
    const medias = this.mediasSubject.getValue();
    if (medias && medias.length > 0) {
      const withRemovedData = medias.filter(md => !inactiveIds.includes(md.id));
      const reverseList = messageList.reverse().filter(msg => !msg.deleted);
      const totalData = [...reverseList , ...withRemovedData ];
      const updatedData = _.uniqBy(totalData, 'id');
      this.mediasSubject.next(updatedData);
    }
  }

  removeMedia(item) {
    const medias = this.mediasSubject.getValue().filter(m => m.uuid !== item.uuid);
    this.mediasSubject.next(medias);
  }
}
