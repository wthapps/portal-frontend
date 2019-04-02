import { Injectable } from '@angular/core';
import { ApiBaseService } from '@wth/shared/services';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';

declare let _: any;

@Injectable()
export class MAlbumsService {
  apiUrl = 'media/albums';

  data$: Observable<any[]>;
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

  constructor(private api: ApiBaseService,
              private datePipe: DatePipe) {
    this.data$ = this.dataSubject.asObservable().pipe(distinctUntilChanged());
    // this.getData().pipe(shareReplay(1)).subscribe();
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

  toggleFavorite(items?: any) {
    return this.api.post(`media/favorites/toggle`, {
      objects: items.map(v => {
        return { id: v.id, object_type: v.model };
      })
    }).pipe(
      tap((res: any) => {
        const newData = this.dataSubject.getValue();
        res.data.map((v: any) => {
          const index = _.findIndex(newData, { id: v.id });
          newData[index].favorite = v.favorite;
        });
        this.dataSubject.next(newData);
      })
    );
  }

  delete(items?: any) {
    return this.api.post(`${this.apiUrl}/delete`, { objects: items }).pipe(
      tap(() => {
        const newData = this.dataSubject.getValue();
        const filteredItems = newData.filter(item => !items.includes(item));
        this.dataSubject.next(filteredItems);
      })
    );
  }

  addToAlbum(albumID: number, photos: any[]) {
    return this.api.post(`${this.apiUrl}/${albumID}/photos`, { photos });
  }
}
