import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';
import { DatePipe } from '@angular/common';
import { Media } from '@shared/shared/models/media.model';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { ApiBaseService } from '@shared/services';

@Injectable()
export class NoteService {
  viewMode$: Observable<string>;
  private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');


  apiUrl = 'note/mixed_entities';

  data$: Observable<Media[]>;
  private dataSubject: BehaviorSubject<Media[]> = new BehaviorSubject<Media[]>(null);

  constructor(public localStorageService: LocalStorageService,
              private datePipe: DatePipe,
              private api: ApiBaseService) {
    this.viewMode$ = this.viewModeSubject.asObservable().pipe(distinctUntilChanged());
    this.viewModeSubject.next(this.localStorageService.get('media_view_mode') || 'grid');

    this.data$ = this.dataSubject.asObservable().pipe(distinctUntilChanged());
  }

  changeView(view: string) {
    this.viewModeSubject.next(view);
    this.localStorageService.set('media_view_mode', view);
  }

  getData(nextLink?: any): Observable<any> {
    const link = nextLink ? nextLink : this.apiUrl;
    return this.api.get(link).pipe(
      map((res: ResponseMetaData) => {
        res.data.map((item) => ({
          ...item, group_by_day: this.datePipe.transform(item.created_at, 'yyyy-MM-dd'),
          group_by_month: this.datePipe.transform(item.created_at, 'yyyy-MM'),
          group_by_year: this.datePipe.transform(item.created_at, 'yyyy')
        }));
        return res;
      }),
      tap((res: any) => {
        if (!this.dataSubject.getValue()) {
          this.dataSubject.next(res.data);
        } else {
          const newData = this.dataSubject.getValue().concat(res.data);
          this.dataSubject.next(newData);
        }
      }),
      catchError(
        (err: any) => {
          console.warn('error: ', err);
          this.dataSubject.next([]);
          return from(null);
        }
      )
    );
  }


  sort(sort: any) {
    this.dataSubject.next(null);
    return this.getData(`${this.apiUrl}?sort=${sort.orderBy}&sort_name=${sort.sortBy}`);
  }
}
