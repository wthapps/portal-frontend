import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ApiBaseService } from '@shared/services';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';

import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';

declare let _: any;

@Injectable()
export class WNoteSelectionService {
  apiUrl = 'note/mixed_entities';

  viewMode$: Observable<string>;
  data$: Observable<any[]>;
  open$: Observable<any>;

  private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  private openSubject: Subject<any> = new Subject<any>();
  private destroy$: Subject<any> = new Subject<any>();

  constructor(public localStorageService: LocalStorageService,
              private datePipe: DatePipe,
              private api: ApiBaseService) {
    this.viewMode$ = this.viewModeSubject.asObservable().pipe(distinctUntilChanged());
    this.viewModeSubject.next(this.localStorageService.get('modal_note_view_mode') || 'grid');

    this.data$ = this.dataSubject.asObservable().pipe(distinctUntilChanged());
    this.open$ = this.openSubject.asObservable().pipe(distinctUntilChanged());
  }

  open() {
    this.openSubject.next(true);
  }

  close() {
    this.openSubject.next(null);
    this.clear();
  }

  clear() {
    this.dataSubject.next(null);
  }

  getView() {
    return this.viewModeSubject.getValue();
  }

  changeView(view: string) {
    this.viewModeSubject.next(view);
    this.localStorageService.set('media_view_mode', view);
  }

  getData(tab: string, id: number = null): Observable<any> {
    const link = id ? `${this.apiUrl}?parent_id=${id}` : `${this.apiUrl}?${tab}`;

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

  getParent(id: string) {
    const link = `/note/folders/get_folder_path/${id}?page=MY_NOTE`;
    return this.api.get(link);
  }

  sort(sort: any) {
    // console.log(sort); // orderBy: "asc" sortBy: "created_at"
    const data = this.dataSubject.getValue();
    const dataSorted = _.orderBy(data, ['object_type', sort.sortBy.toLocaleLowerCase()], ['asc', sort.orderBy]);
    this.dataSubject.next(dataSorted);
  }

  search(keyword: string) {
    const link = `note/search?q=${keyword}`;
    this.api.get(link).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.dataSubject.next(this.mapToView(res.data));
    });
  }

  getByParams(queryParams: string) {
    const link = `${this.apiUrl}?${queryParams}`;
    this.api.get(link).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.dataSubject.next(this.mapToView(res.data));
    });
  }

  private mapToView(items: Array<any>) {
    return items.map((item) => ({
      ...item, group_by_day: this.datePipe.transform(item.created_at, 'yyyy-MM-dd'),
      group_by_month: this.datePipe.transform(item.created_at, 'yyyy-MM'),
      group_by_year: this.datePipe.transform(item.created_at, 'yyyy')
    }));
  }
}

