import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';

import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SoPostService } from '../services/social-post.service';
import { POSTS_COUNT_LOAD, POSTS_COUNT_LOAD_DONE, COMMON_FAILED } from '../reducers/index';


@Injectable()
export class SocialPostsEffects {

  constructor(private actions: Actions,
              private toastsService: ToastsService,
              private soPostService: SoPostService) {
  }

  @Effect() loadSocialPostsCount = this.actions.pipe(
    ofType(POSTS_COUNT_LOAD),
    concatMap(() => this.soPostService.getNewPostsCount()),
    map((res: any) => {
    return ({type: POSTS_COUNT_LOAD_DONE, payload: res['data']});
    }),
    catchError(() => {
      this.toastsService.danger('Profile loading FAIL, something\'s wrong happened');
      return of({type: COMMON_FAILED });
    }));
}
