import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
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
  @Effect({ dispatch: false }) addFolder = this.actions
    .ofType(folder.ADD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
    console.debug('folder effects - add: ', payload);
    return this.folderService.create(payload)
      .map((res: any) => new folder.FolderAdded(res['data']))
      .catch(() => empty())
      ;
    });

  @Effect() init$: Observable<any> = defer(() => {
    console.debug('init load folders: ')
    return this.folderService.getRootFolders();
  })
    .map((res: any) => new folder.LoadSuccess(res.data))
    .catch(() => empty());

  @Effect() loadAll = this.actions
    .ofType(folder.LOAD_ALL)
    .switchMap(() => {
      console.debug('Load ALL folders: ')
      return this.folderService.getAll()
        .map((res: any) => new folder.FolderAdded(res['data']))
        .catch(() => empty())
        ;
    });

  constructor(private actions: Actions, public folderService: ZFolderService) {
  }
}
