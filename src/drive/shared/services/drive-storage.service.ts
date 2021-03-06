import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import DriveFile from '@shared/modules/drive/models/drive-file.model';
import { DriveState, initDriveState } from '@shared/modules/drive/models/functions/drive-file-list';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { driveConstants, DriveType } from '../config/drive-constants';
import DriveUtils from '../utils/drive-utils';
import { _wu } from '@wth/shared/shared/utils/utils';


export interface SortOption {
  sortBy: string;
  orderBy: 'asc' | 'desc';
}
@Injectable()
export class DriveStorageService {
  readonly OBJECT_TYPE = driveConstants.OBJECT_TYPE;

  data$: Observable<Array<DriveType>>;
  currentFolder$: Observable<DriveFolder>;
  private driveStateSubject: BehaviorSubject<DriveState> = new BehaviorSubject(initDriveState);
  private _currentFolder: BehaviorSubject<DriveFolder> = new BehaviorSubject(null);
  private _sortOption: SortOption;

  constructor(
  ) {
    // this.data$ = this.dataSubject.asObservable().pipe(distinctUntilChanged());
    this.data$ = this.driveStateSubject.asObservable().pipe(
      map((state: DriveState) => {
        const folders = state.folderIds.reduce((acc, id) => acc.concat(state.foldersMap[id]), []);
        const files = state.fileIds.reduce((acc, id) => acc.concat(state.filesMap[id]), []);
        return folders.concat(files);
      }),
      distinctUntilChanged()
    );
    this.currentFolder$ = this._currentFolder.asObservable();
  }

  set data(data: Array<any>) {
    this.setState(DriveUtils.parse(data));
  }

  set currentFolder(folder: DriveFolder) {
    console.log('set current folder: ', folder);
    this._currentFolder.next(folder);
  }

  set sortOption(sort: SortOption) {
    this._sortOption = sort;
  }

  get sortOption() {
    return this._sortOption;
  }

  get currentFolder(): DriveFolder {
    return this._currentFolder.getValue();
  }

  appendData(data: any[]): void {
    this.setState(this.concatState(this.currentState, this.parsedDriveData(data)));
  }

  prependData(data: Array<DriveType>): void {
    this.setState(this.concatState(this.parsedDriveData(data), this.currentState));
  }

  // Add new files, folders; Remove duplicate items; sort by sort options
  addMany(data: DriveType[]): void {
    const {sortBy, orderBy} = this.sortOption;
    const newState = this.parsedDriveData(data);

    const filesMap = {...this.currentState.filesMap, ...newState.filesMap };
    const foldersMap = {...this.currentState.foldersMap, ...newState.foldersMap };

    const fileIds = Object.values(filesMap).sort((a,b) => _wu.compareBy(a, b, orderBy !== 'desc', sortBy)).map(f => f.id);
    const folderIds = Object.values(foldersMap).sort((a,b) => _wu.compareBy(a, b, orderBy !== 'desc', sortBy)).map(f => f.id);

    this.setState({fileIds, filesMap, folderIds, foldersMap });
  }

  addOne(data: DriveType): void {
    console.log(this.sortOption);
    const {sortBy, orderBy} = this.sortOption;
    const {fileIds, filesMap, folderIds, foldersMap } = this.currentState;
    let [newFileIds, newFolderIds] = [fileIds, folderIds];
    if (data.object_type === DriveFolder.model_const) {
      foldersMap[data.id] = data;
      const sortedArr = Object.values(foldersMap).sort((a,b) => _wu.compareBy(a, b, orderBy !== 'desc', sortBy));
      newFolderIds = sortedArr.map(f => f.id);
    } if (data.object_type === DriveFile.model_const) {
      filesMap[data.id] = data;
      const sortedArr = Object.values(filesMap).sort((a,b) => _wu.compareBy(a, b, orderBy !== 'desc', sortBy));
      newFileIds = sortedArr.map(f => f.id);
    } else {
      console.warn('unhandle object type: ', data.object_type);
    }
    this.setState({fileIds: newFileIds, filesMap, folderIds: newFolderIds, foldersMap });
  }

  updateMany(data: Array<DriveType>): void {
    this.setState(this.mergeState(this.currentState, this.parsedDriveData(data)));
  }

  updateOne(data: DriveType): void {
    const { filesMap, foldersMap } = this.currentState;
    const { id, object_type } = data;
    if (object_type === DriveFolder.model_const) {
      if (foldersMap[id]) {
        foldersMap[id] = data;
      } else {
        this.currentFolder = data;
      }
    }
    if (object_type === DriveFile.model_const && filesMap[id]) {
      filesMap[id] = data;
    }
    this.setState({ ...this.currentState, filesMap, foldersMap });
  }

  deleteData(data: Array<DriveType>): void {
    const { fileIds, folderIds } = this.parsedDriveData(data);
    const mergedState = { ...this.currentState };
    mergedState.fileIds = mergedState.fileIds.filter(f => !fileIds.includes(f));
    fileIds.forEach(id => delete mergedState.filesMap[id]);
    mergedState.folderIds = mergedState.folderIds.filter(f => !folderIds.includes(f));
    folderIds.forEach(id => delete mergedState.foldersMap[id]);
    this.setState(mergedState);
  }

  private parsedDriveData(data: Array<DriveType>): DriveState { return DriveUtils.parse(data); };
  private get currentState() { return this.driveStateSubject.getValue(); };

  private setState(state: DriveState) {
    this.driveStateSubject.next(state);
  }
  private concatState(currentState: DriveState, newState: DriveState): DriveState {
    const mergedState: DriveState = { ...currentState };
    mergedState.fileIds = [...newState.fileIds, ...currentState.fileIds];
    mergedState.filesMap = { ...newState.filesMap, ...currentState.filesMap };
    mergedState.folderIds = [...newState.folderIds, ...currentState.folderIds];
    mergedState.foldersMap = { ...newState.foldersMap, ...currentState.foldersMap };
    return mergedState;
  }

  private mergeState(currentState: DriveState, newState: DriveState): DriveState {
    const mergedState: DriveState = { ...currentState };
    mergedState.filesMap = { ...currentState.filesMap, ...newState.filesMap };
    mergedState.foldersMap = { ...currentState.foldersMap, ...newState.foldersMap };

    return mergedState;
  }
}
