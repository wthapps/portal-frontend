import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { empty } from 'rxjs/observable/empty';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { ApiBaseService } from '@shared/services/apibase.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';


import * as fromRoot from '../reducers/index';
import { SoShortcutService } from '../services/shortcut.service';
import { of } from 'rxjs/observable/of';


@Injectable()
export class ShortcutEffects {

  constructor(private actions: Actions,
              private toastsService: ToastsService,
              private shortcutService: SoShortcutService,
              private store: Store<fromRoot.State>) {
  }

  @Effect() loadShortcuts = this.actions
    .ofType(fromRoot.SHORTCUT_LOAD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.shortcutService.getAll()
        .map((res: any) => {
          return ({type: fromRoot.SHORTCUT_LOAD_DONE, payload: res['data']});
        })
        .catch(() => {
          this.toastsService.danger('Shortcuts loading FAIL, something\'s wrong happened');
          return of({type: fromRoot.SHORTCUT_LOAD_FAILED });
        });
    });

  // @Effect() updateShortcut = this.actions
  //   .ofType(fromRoot.SHORTCUT_UPDATE)
  //   .map((action: any) => action['payload'])
  //   .switchMap((payload: any) => {
  //     return this.shortcutService.update(payload)
  //       .map((res: any) => {
  //         return ({type: fromRoot.SHORTCUT_UPDATE_DONE, payload: res['data']});
  //       })
  //       .catch(() => {
  //         this.toastsService.danger('Shortcuts update FAIL, something\'s wrong happened');
  //         return ({type: fromRoot.SHORTCUT_UPDATE_FAILED });
  //       });
  //   });

  @Effect() addShortcut = this.actions
    .ofType(fromRoot.SHORTCUT_ADD)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.shortcutService.create(payload)
        .map((res: any) => {
          return ({type: fromRoot.SHORTCUT_UPDATE_DONE, payload: res['data']});
        })
        .catch(() => {
          this.toastsService.danger('Shortcuts update FAIL, something\'s wrong happened');
          return of({type: fromRoot.SHORTCUT_UPDATE_FAILED });
        });
    });

  @Effect() removeShortcut = this.actions
    .ofType(fromRoot.SHORTCUT_REMOVE)
    .map((action: any) => action['payload'])
    .switchMap((payload: any) => {
      return this.shortcutService.delete(payload.id)
        .map((res: any) => {
          return ({type: fromRoot.SHORTCUT_REMOVE_DONE, payload: res['data']});
        })
        .catch(() => {
          this.toastsService.danger('Shortcuts remove FAIL, something\'s wrong happened');
          return of({type: fromRoot.SHORTCUT_UPDATE_FAILED });
        });
    });
}
