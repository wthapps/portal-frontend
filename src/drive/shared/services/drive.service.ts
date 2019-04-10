import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { tap, map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';
import { DatePipe } from '@angular/common';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { ApiBaseService } from '@shared/services';
import DriveFile from '@shared/modules/drive/models/drive-file.model';
import DriveFileList from '@shared/modules/drive/models/functions/drive-file-list';

@Injectable()
export class DriveService {
  viewMode$: Observable<string>;
  private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');


  apiUrl = 'note/mixed_entities';

  data$: Observable<any[]>;
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

  constructor(public localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private apiBaseService: ApiBaseService) {
    this.viewMode$ = this.viewModeSubject.asObservable().pipe(distinctUntilChanged());
    this.viewModeSubject.next(this.localStorageService.get('media_view_mode') || 'grid');

    this.data$ = this.dataSubject.asObservable().pipe(distinctUntilChanged());
  }

  changeView(view: string) {
    this.viewModeSubject.next(view);
    this.localStorageService.set('media_view_mode', view);
  }

  getData(link?: any): Observable<any> {
    console.log(link);

    return this.apiBaseService.get(link).pipe(
      map((res: ResponseMetaData) => {

        let data = DriveFileList.map(res.data);
        this.dataSubject.next(data);
        return data;
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
}
