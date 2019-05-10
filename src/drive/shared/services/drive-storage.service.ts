import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import DriveFile from '@shared/modules/drive/models/drive-file.model';
import DriveFileList, { DriveState, initDriveState } from '@shared/modules/drive/models/functions/drive-file-list';
import DriveFolder from '@shared/modules/drive/models/drive-folder.model';
import { driveConstants } from '../config/drive-constants';
import DriveUtils from '../utils/drive-utils';
import DriveLocalFile from '@shared/modules/drive/models/drive-local-file.model';

export type DriveTypes = DriveFolder | DriveFile;

@Injectable()
export class DriveStorageService {
  readonly OBJECT_TYPE = driveConstants.OBJECT_TYPE;

  data$: Observable<Array<DriveTypes>>;
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
    this.driveStateSubject.next(DriveUtils.parse(data));
  }

  appendData(data: any[]): void {
    const currentState: DriveState = this.driveStateSubject.getValue();
    const newState: DriveState = DriveUtils.parse(data);
    const mergedState = this.concatState(currentState, newState);
    this.driveStateSubject.next(mergedState);
  }

  prependData(data: Array<DriveTypes>): void {
    const currentState: DriveState = this.driveStateSubject.getValue();
    const newState: DriveState = DriveUtils.parse(data);
    const mergedState = this.concatState(newState, currentState);
    this.driveStateSubject.next(mergedState);
  }

  private concatState(currentState: DriveState, newState: DriveState): DriveState {
    const mergedState: DriveState = {...currentState};
    mergedState.fileIds = [...newState.fileIds, ...currentState.fileIds];
    mergedState.filesMap = {...newState.filesMap, ...currentState.filesMap};
    mergedState.folderIds = [...newState.folderIds, ...currentState.folderIds];
    mergedState.foldersMap = {...newState.foldersMap, ...currentState.foldersMap};
    return mergedState;
  }

}
