import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';
import { ApiBaseService } from '@shared/services';
import DriveFile from '@shared/modules/drive/models/drive-file.model';
import DriveFileList from '@shared/modules/drive/models/functions/drive-file-list';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { DriveStorageService } from './drive-storage.service';

@Injectable()
export class DriveService {
  viewMode$: Observable<string>;
  private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  readonly apiUrl = 'drive/drive';

  data$: Observable<Array<DriveFolder | DriveFile>>;

  private nextUrl = '';

  constructor(public localStorageService: LocalStorageService,
    private dataStorage: DriveStorageService,
    private apiBaseService: ApiBaseService) {
    this.viewMode$ = this.viewModeSubject.asObservable().pipe(distinctUntilChanged());
    this.viewModeSubject.next(this.localStorageService.get('media_view_mode') || 'grid');

    this.data$ = this.dataStorage.data$;
  }

  changeView(view: string) {
    this.viewModeSubject.next(view);
    this.localStorageService.set('media_view_mode', view);
  }

  set data(data: Array<DriveFolder | DriveFile>) {
    this.dataStorage.data = data;
  }

  appendData(data: Array<DriveFolder | DriveFile>): void {
    this.dataStorage.appendData(data);
  }

  prependData(data: Array<DriveFolder | DriveFile>): void {
    this.dataStorage.prependData(data);
  }

  loadObjects(url: string) {
    this.apiBaseService.get(url).toPromise().then(res => {
      this.dataStorage.data = res.data;
      this.nextUrl = res.meta.links.next;
    });
  }

  loadMoreObjects() {
    if (this.nextUrl) {
      this.apiBaseService.get(this.nextUrl).toPromise().then(res => {
        this.prependData(res.data);
        this.nextUrl = res.meta.links.next;
      });
    }
  }
}
