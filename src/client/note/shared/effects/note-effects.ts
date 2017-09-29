import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class NoteEffects {

  // Listen for the 'LOGIN' action
  @Effect() create$: Observable<any> = this.actions$.ofType('CREATE')
    .mergeMap((action: any) =>
      this.api.post('/auth', action.payload)
      // If successful, dispatch success action with result
        .map(data => ({ type: 'CREATE_SUCCESS', payload: data }))
        // If request fails, dispatch failed action
        .catch(() => of({ type: 'CREATE_FAILED' }))
  );

  constructor(
    private api: ApiBaseService,
    private actions$: Actions
  ) {}


}
