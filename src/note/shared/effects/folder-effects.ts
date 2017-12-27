import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { ApiBaseService } from '@shared/services/apibase.service';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { ZNoteService } from '../services/note.service';
import { defer } from 'rxjs/observable/defer';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';


import * as folder from '../actions/folder';
import { ZFolderService } from '../services/folder.service';


@Injectable()
export class FolderEffects {
  constructor(private actions: Actions, public folderService: ZFolderService, private store: Store<any>) {
  }

  @Effect({ dispatch: false }) addFolder = this.actions
    .ofType(folder.ADD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
    return this.folderService.create(payload)
      .withLatestFrom(this.store, (res: any, state: any) => {
        if(state.context.permissions.edit) {
          return ({type: folder.FolderAdded, payload: [res['data']]});
        } else {
          return empty();
        }
      })
      .catch(() => empty());
    });

  @Effect() init$: Observable<any> = defer(() => {
    console.debug('init load folders: ');
    return this.folderService.getRootFolders();
  })
    .switchMap((res: any) => {
    return [
      new folder.LoadSuccess(res.data),
      // new folder.LoadAll(),
    ];})
    .catch(() => empty());

  @Effect() loadAll = this.actions
    .ofType(folder.LOAD_ALL)
    .switchMap(() => {
      console.debug('Load ALL folders: ');
      return this.folderService.getAll()
        .map((res: any) => new folder.LoadSuccess(res['data']))
        .catch(() => empty())
        ;
    });

  @Effect() setCurrentFolder = this.actions
    .ofType(folder.SET_CURRENT_FOLDER)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.folderService.getFolderPath(payload)
        .map((res: any) => new folder.SetCurrentFolderPath(res['data']))
        .catch(() => empty());
    });
}
