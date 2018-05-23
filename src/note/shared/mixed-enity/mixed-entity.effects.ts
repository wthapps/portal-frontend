import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { map, concatMap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
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
      catchError(() => empty())
    );

  constructor(private actions: Actions<ActionBase>, private mixedEntityService: MixedEntityService) { }
}
