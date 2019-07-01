import { DriveApiService } from './drive-api.service';
import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';


import { ApiBaseService, CommonEventService } from '@shared/services';
import { DriveStorageService } from './drive-storage.service';
import { DriveModalService } from './drive-modal.service';
import { DriveFolderService } from './drive-folder.service';
import { DriveType, DEFAULT_CONTEXT, IDriveContext } from '../config/drive-constants';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';

const VIEW_MODE = 'drive_view_mode';

@Injectable()
export class DriveService {
  viewMode$: Observable<string>;
  private viewModeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('grid');

  readonly apiUrl = 'drive/drive';

  data$: Observable<Array<DriveType>>;

  private nextUrl = '';
  private _context: IDriveContext =  DEFAULT_CONTEXT;

  constructor(public localStorageService: LocalStorageService,
    private dataStorage: DriveStorageService,
    private modalService: DriveModalService,
    private folderService: DriveFolderService,
    private commonEventService: CommonEventService,
    private driveApi: DriveApiService,
    private apiBaseService: ApiBaseService) {
    this.viewMode$ = this.viewModeSubject.asObservable().pipe(distinctUntilChanged());
    this.viewModeSubject.next(this.localStorageService.get(VIEW_MODE) || 'grid');

    this.data$ = this.dataStorage.data$;
  }

  changeView(view: string) {
    this.viewModeSubject.next(view);
    this.localStorageService.set(VIEW_MODE, view);
  }

  set data(data: Array<DriveType>) {
    this.dataStorage.data = data;
  }

  set currentFolder(folder) {
    this.dataStorage.currentFolder = folder;
  }

  set context(context: IDriveContext) {
    this._context = Object.assign({}, DEFAULT_CONTEXT, context);
  }

  resetCurrentFolder() {
    this.currentFolder = null;
  }

  notifyFoldersUpdate(item): void {
    if (DriveFolder.isFolder(item))
      this.commonEventService.broadcast({action: 'update', channel: 'driveLeftMenu', payload: [item]});
  }

  appendData(data: Array<DriveType>): void {
    this.dataStorage.appendData(data);
  }

  prependData(data: Array<DriveType>): void {
    this.dataStorage.prependData(data);
  }

  addOne(data: DriveType): void {
    this.dataStorage.addOne(data);
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
    this.nextUrl = _.get(res.meta, 'links.next');
  }

  async createFolder(payload): Promise<DriveFolder> {
    const parent = this.dataStorage.currentFolder ? { parent_id: this.dataStorage.currentFolder.id } : {};
    const res = await this.folderService.create({ ...payload, ...parent }).toPromise();
    if ( this._context.permission.edit) {
      this.addOne(res.data);
    }
    return <DriveFolder> res.data;
  }

  async updateFolder(payload): Promise<DriveFolder> {
    const res = await this.folderService.update(payload).toPromise();
    if ( this._context.permission.edit) {
      this.updateOne(res.data);
    }
    return <DriveFolder> (res.data);
  }

  async moveFolder(payload) {
    try {
      const res = await this.driveApi.update(payload).toPromise();
      console.log('res: ', res);
      this.dataStorage.deleteData(res.data);
    } catch (err) {
      console.warn('Encounter err: ', err);
    }
  }

  async permanentDelete(body): Promise<void> {
    try {
      const res = await this.driveApi.permanentDelete(body).toPromise();
      this.dataStorage.deleteData(res.data);
    } catch (err) {
      console.warn('Encounter err: ', err);
    }
  }

  async restore(body) {
    try {
      const res = await this.driveApi.restore(body).toPromise();
      this.dataStorage.deleteData(res.data);
    } catch (err) {
      console.warn('Encounter err: ', err);
    }
  }

  async emptyAll() {
   try {
      const res = await this.driveApi.emptyAll().toPromise();
      this.dataStorage.data = [];
    } catch (err) {
      console.warn('Encounter err: ', err);
    }
  }

  loadMoreObjects() {
    if (this.nextUrl) {
      this.apiBaseService.get(this.nextUrl).toPromise().then(res => {
        this.prependData(res.data);
        this.nextUrl = _.get(res.meta, 'links.next');
      });
    }
  }

  toggleFavorite(objects) {
    return this.apiBaseService.post('drive/favorites/toggle', { objects: objects });
  }
}
