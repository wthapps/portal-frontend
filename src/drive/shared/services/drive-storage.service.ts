import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import DriveFile from '@shared/modules/drive/models/drive-file.model';
import DriveFileList, { DriveState, initDriveState } from '@shared/modules/drive/models/functions/drive-file-list';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { driveConstants } from '../config/drive-constants';
import DriveUtils from '../utils/drive-utils';
import DriveLocalFile from '@shared/modules/drive/models/drive-local-file.model';

export type DriveType = DriveFolder | DriveFile;

@Injectable()
export class DriveStorageService {
  readonly OBJECT_TYPE = driveConstants.OBJECT_TYPE;

  data$: Observable<Array<DriveType>>;
  private driveStateSubject: BehaviorSubject<DriveState> = new BehaviorSubject(initDriveState);

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
  }

  set data(data: Array<any>) {
    this.setState(DriveUtils.parse(data));
  }

  appendData(data: any[]): void {
    const newState: DriveState = DriveUtils.parse(data);
    this.setState(this.concatState(this.currentState, newState));
  }

  prependData(data: Array<DriveType>): void {
    const newState: DriveState = DriveUtils.parse(data);
    this.setState(this.concatState(newState, this.currentState));
  }

  updateData(data: Array<DriveType>): void {
    const newState: DriveState = DriveUtils.parse(data);
    this.setState(this.mergeState(newState, this.currentState));
  }

  private get currentState() { return this.driveStateSubject.getValue();};

  private setState(state: DriveState) {
    this.driveStateSubject.next(state);
  }
  private concatState(currentState: DriveState, newState: DriveState): DriveState {
    const mergedState: DriveState = {...currentState};
    mergedState.fileIds = [...newState.fileIds, ...currentState.fileIds];
    mergedState.filesMap = {...newState.filesMap, ...currentState.filesMap};
    mergedState.folderIds = [...newState.folderIds, ...currentState.folderIds];
    mergedState.foldersMap = {...newState.foldersMap, ...currentState.foldersMap};
    return mergedState;
  }

  private mergeState(currentState: DriveState, newState: DriveState): DriveState {
    const mergedState: DriveState = {...currentState};
    mergedState.filesMap = {...newState.filesMap, ...currentState.filesMap};
    mergedState.foldersMap = {...newState.foldersMap, ...currentState.foldersMap};
    return mergedState;
  }

}
