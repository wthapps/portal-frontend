import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable ,  EMPTY } from 'rxjs';
import { map, concatMap, catchError } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import { MixedEntityAction } from './mixed-entity.action';
import { MixedEntityService } from './mixed-entity.service';
import { ActionBase } from '../actions/action-base';

@Injectable()
export class MixedEntityEffects {

  @Effect()
  getAll: Observable<any> = this.actions
    .ofType(MixedEntityAction.GET_ALL)
    .pipe(
      map((action: any) => action.payload),
      concatMap((queryParams: any) => this.mixedEntityService.getAll()),
      map((response: any) => {
        return MixedEntityAction.getAllSuccess(response.data);
      }),
      catchError(() => EMPTY)
    );

  constructor(private actions: Actions<ActionBase>, private mixedEntityService: MixedEntityService) { }
}
