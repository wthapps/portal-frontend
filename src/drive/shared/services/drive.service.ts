import { DriveApiService } from './drive-api.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';
import { ApiBaseService, CommonEventService } from '@shared/services';
import DriveFile from '@shared/modules/drive/models/drive-file.model';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { DriveStorageService } from './drive-storage.service';
import { DriveModalService } from './drive-modal.service';
import { DriveFolderService } from './drive-folder.service';


export type DriveType = DriveFile | DriveFolder;
@Injectable()
export class DriveService {
  viewMode$: Observable<string>;
  private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  readonly apiUrl = 'drive/drive';

  data$: Observable<Array<DriveType>>;

  private nextUrl = '';

  constructor(public localStorageService: LocalStorageService,
    private dataStorage: DriveStorageService,
    private modalService: DriveModalService,
    private folderService: DriveFolderService,
    private commonEventService: CommonEventService,
    private driveApi: DriveApiService,
    private apiBaseService: ApiBaseService) {
    this.viewMode$ = this.viewModeSubject.asObservable().pipe(distinctUntilChanged());
    this.viewModeSubject.next(this.localStorageService.get('media_view_mode') || 'grid');

    this.data$ = this.dataStorage.data$;
  }

  changeView(view: string) {
    this.viewModeSubject.next(view);
    this.localStorageService.set('media_view_mode', view);
  }

  set data(data: Array<DriveType>) {
    this.dataStorage.data = data;
  }

  set currentFolder(folder) {
    this.dataStorage.currentFolder = folder;
  }

  resetCurrentFolder() {
    this.currentFolder = null;
  }

  appendData(data: Array<DriveType>): void {
    this.dataStorage.appendData(data);
  }

  prependData(data: Array<DriveType>): void {
    this.dataStorage.prependData(data);
  }

  updateMany(data: Array<DriveType>): void {
    this.dataStorage.updateMany(data);
  }

  updateOne(data: DriveType): void {
    this.dataStorage.updateOne(data);
  }

  modalEvent(event) {
    this.modalService.next(event);
  }

  async deleteMany(payload: DriveType[]) {
    const res = await this.driveApi.deleteMany(payload).toPromise();
    this.dataStorage.deleteData(payload);
    this.commonEventService.broadcast({
      action: 'destroy',
      channel: 'driveLeftMenu',
      payload: res.data
    });
  }

  async loadObjects(url: string) {
    const res = await this.apiBaseService.get(url).toPromise();
    this.dataStorage.data = res.data;
    this.nextUrl = res.meta.links.next;
  }

  async createFolder(payload) {
    const parent = this.dataStorage.currentFolder ? {parent_id: this.dataStorage.currentFolder.id} : {};
    const res = await this.folderService.create({...payload, ...parent}).toPromise();
    this.prependData([res.data]);
  }

  async updateFolder(payload) {
    const res = await this.folderService.update(payload).toPromise();
    this.updateOne(res.data);
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
