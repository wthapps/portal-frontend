import { Injectable } from '@angular/core';
import { Observable ,  of ,  EMPTY,  defer } from 'rxjs';
import { map, concatMap, withLatestFrom, catchError, mergeMap } from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';


import * as folder from '../actions/folder';
import * as context from '../reducers/context';
import { ZFolderService } from '../services/folder.service';


@Injectable()
export class FolderEffects {
  constructor(private actions: Actions, public folderService: ZFolderService, private store: Store<any>) {
  }

  @Effect({ dispatch: false }) addFolder = this.actions
    .ofType(folder.ADD)
    .pipe(
      map((action: any) => action['payload']),
      concatMap((payload: any) => this.folderService.create(payload)),
      withLatestFrom(this.store, (res: any, state: any) => {
        if (state.context.permissions.edit) {
          return ({type: folder.FolderAdded, payload: [res['data']]});
        } else {
          return EMPTY;
        }
      }),
      catchError(() => EMPTY));

  @Effect() init$: Observable<any> = defer(() => {
      return this.folderService.getRootFolders();
    })
    .pipe(
      concatMap((res: any) => {
        return [
          new folder.LoadSuccess(res.data),
        ];}),
      catchError(() => EMPTY));

  @Effect() loadAll = this.actions
    .ofType(folder.LOAD_ALL)
    .pipe(
      concatMap(() => this.folderService.getAll()),
      map((res: any) => new folder.LoadSuccess(res['data'])),
      catchError(() => EMPTY)
    );

  @Effect() setCurrentFolder = this.actions
    .ofType(folder.SET_CURRENT_FOLDER)
    .pipe(
      map((action: any) => action['payload']),
      concatMap((payload: any) => this.folderService.getFolderPath(payload)
      ),
      concatMap((res: any) => { return [
        new folder.SetCurrentFolderPathAndUpdateCurrent(res['data']),
        {type: context.SET_CONTEXT_BY_FOLDER_PATHS, payload : res.data}
      ]}),
      catchError(() => empty()));
}
