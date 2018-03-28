import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { delayWhen, filter, map, concatMap, catchError } from 'rxjs/operators';

import { ToastsService } from '@shared/shared/components/toast/toast-message.service';


import * as fromRoot from '../reducers/index';
import { SoShortcutService } from '../services/shortcut.service';
import { of } from 'rxjs/observable/of';
import { AuthService } from '@wth/shared/services';


@Injectable()
export class ShortcutEffects {

  validUser$: Observable<any>;

  constructor(private actions: Actions,
              private toastsService: ToastsService,
              private shortcutService: SoShortcutService,
              private authService: AuthService,
              private store: Store<fromRoot.State>) {
    this.validUser$ = authService.user$.pipe(
      filter(u => !!u && Object.keys(u).length > 0)
    )
  }

  @Effect() loadShortcuts = this.actions
    .ofType(fromRoot.SHORTCUT_LOAD)
    .pipe(
      delayWhen(this.validUser$),
      map((action: any) => action['payload']),
      concatMap(_ => this.shortcutService.getAll()),
      map((res: any) => {
        return ({type: fromRoot.SHORTCUT_LOAD_DONE, payload: res['data']});
      }),
      catchError(() => {
        this.toastsService.danger('Shortcuts loading FAIL, something\'s wrong happened');
        return of({type: fromRoot.SHORTCUT_LOAD_FAILED });
      })
    );

  @Effect() addShortcuts = this.actions
    .ofType(fromRoot.SHORTCUT_ADD_MULTI)
    .pipe(
      map((action: any) => action['payload']),
      concatMap((payload: any) => this.shortcutService.create(payload)),
      map((res: any) => {
        this.toastsService.success('New shortcuts are added successfully');
        return ({type: fromRoot.SHORTCUT_ADD_MULTI_DONE, payload: res['data']});
      }),
      catchError(() => {
        this.toastsService.danger('Shortcuts adding FAIL, something\'s wrong happened');
        return of({type: fromRoot.COMMON_FAILED });
      })
    );

  @Effect() removeShortcuts = this.actions
    .ofType(fromRoot.SHORTCUTS_REMOVE)
    .pipe(
      map((action: any) => action['payload']),
      concatMap((payload: any) => this.shortcutService.deleteMulti(payload['ids'])),
      map((res) => {
        this.toastsService.success('Shortcuts are removed successfully');
        return ({type: fromRoot.SHORTCUTS_REMOVE_DONE, payload: res.ids});
      }),
      catchError(() => {
        this.toastsService.danger('Shortcuts remove FAIL, something\'s wrong happened');
        return of({type: fromRoot.COMMON_FAILED });
      })
    );
}
