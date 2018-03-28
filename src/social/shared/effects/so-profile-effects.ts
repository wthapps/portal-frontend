import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';
import { delayWhen, filter, map, catchError, concatMap, retry } from 'rxjs/operators';

import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import * as fromRoot from '../reducers/index';
import { SoUserService } from '../services/social-user.service';
import { AuthService } from '@wth/shared/services';


@Injectable()
export class SoProfileEffects {

  constructor(private actions: Actions,
              private toastsService: ToastsService,
              private authService: AuthService,
              private soUserService: SoUserService) {
  }

  @Effect() loadSoProfile = this.actions
    .ofType(fromRoot.SO_PROFILE_LOAD)
    .pipe(
      // delayWhen( authService.user$.pipe(
      //   filter(u => !!u && Object.keys(u).length > 0)
      // )),
      concatMap(() => this.soUserService.get()),
      retry(3),
      map((res: any) => {
        return ({type: fromRoot.SO_PROFILE_UPDATE_DONE, payload: res['data']});
      }),
      catchError(() => {
        this.toastsService.danger('Profile loading FAIL, something\'s wrong happened');
        return of({type: fromRoot.COMMON_FAILED });
      })
    );


  @Effect() updateSoProfile = this.actions
    .ofType(fromRoot.SO_PROFILE_UPDATE)
    .pipe(
      concatMap(() => this.soUserService.get()),
      map((res: any) => {
        return ({type: fromRoot.SO_PROFILE_UPDATE_DONE, payload: res['data']});
      }),
      catchError(() => {
        this.toastsService.danger('Profile update FAIL, something\'s wrong happened');
        return of({type: fromRoot.COMMON_FAILED });
      })
    );
}
