import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as MessageActions from './message.actions';

import { MessageService } from '@chat/shared/message/message.service';


@Injectable()
export class MessageEffects {
  constructor(private actions$: Actions, private messageService: MessageService) {}

  @Effect()
  getAll$: Observable<Action> = this.actions$.pipe(
    ofType<MessageActions.GetAll>(MessageActions.ActionTypes.GET_ALL),
    switchMap(action =>
      this.messageService.getAll(action.payload.groupId, action.payload.queryParams).pipe(
        map(response => {
          return new MessageActions.GetAllSuccess(response);
        }),
        catchError(error =>
          of(new MessageActions.GetAllError({ error }))
        )
      )
    )
  );

  @Effect()
  getMore$: Observable<Action> = this.actions$.pipe(
    ofType<MessageActions.GetMore>(MessageActions.ActionTypes.GET_MORE),
    switchMap(action =>
      this.messageService.getAll(action.payload.groupId, action.payload.queryParams).pipe(
        map(response => {
          return new MessageActions.GetMoreSuccess(response);
        }),
        catchError(error =>
          of(new MessageActions.GetAllError({ error }))
        )
      )
    )
  );

  @Effect()
  getItem$: Observable<Action> = this.actions$.pipe(
    ofType<MessageActions.GetItem>(MessageActions.ActionTypes.GET_ITEM),
    switchMap(action =>
      this.messageService.get(action.payload).pipe(
        map(response => {
          return new MessageActions.GetItemSuccess(response);
        }),
        catchError(error =>
          of(new MessageActions.GetItemError({ error }))
        )
      )
    )
  );

}
