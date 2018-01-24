import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import * as fromRoot from '../reducers/index';
import { of } from 'rxjs/observable/of';
import { SoUserService } from '../services/social-user.service';


@Injectable()
export class SoProfileEffects {

  constructor(private actions: Actions,
              private toastsService: ToastsService,
              private soUserService: SoUserService) {
  }

  @Effect() loadSoProfile = this.actions
    .ofType(fromRoot.SO_PROFILE_LOAD)
    .switchMap(() => {
      return this.soUserService.get()
        .map((res: any) => {
          return ({type: fromRoot.SO_PROFILE_UPDATE_DONE, payload: res['data']});
        })
        .catch(() => {
          this.toastsService.danger('Profile loading FAIL, something\'s wrong happened');
          return of({type: fromRoot.COMMON_FAILED });
        });
    });


  @Effect() updateSoProfile = this.actions
    .ofType(fromRoot.SO_PROFILE_UPDATE)
    .switchMap(() => {
      return this.soUserService.get()
        .map((res: any) => {
          return ({type: fromRoot.SO_PROFILE_UPDATE_DONE, payload: res['data']});
        })
        .catch(() => {
          this.toastsService.danger('Profile update FAIL, something\'s wrong happened');
          return of({type: fromRoot.COMMON_FAILED });
        });
    });
}
