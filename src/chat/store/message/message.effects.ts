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
    ofType<MessageActions.GetItems>(MessageActions.ActionTypes.GET_ITEMS),
    switchMap(action =>
      this.messageService.getAll(action.payload.groupId, action.payload.queryParams).pipe(
        map(response => {
          const messages = [];
          response.data.forEach(message => {
            messages.push(message.attributes);
          });
          return new MessageActions.GetItemsSuccess({messages: messages});
        }),
        catchError(error =>
          of(new MessageActions.GetItemsError({ error }))
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
          const messages = [];
          response.data.forEach(message => {
            messages.push(message.attributes);
          });

          return new MessageActions.GetMoreSuccess({messages: messages});
        }),
        catchError(error =>
          of(new MessageActions.GetItemsError({ error }))
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

  @Effect()
  create$: Observable<Action> = this.actions$.pipe(
    ofType<MessageActions.Create>(MessageActions.ActionTypes.CREATE),
    switchMap(action =>
      this.messageService.create(action.payload).pipe(
        map(response => {
          const message = response.data.attributes;

          return new MessageActions.CreateSuccess({message: message});
        }),
        catchError(error =>
          of(new MessageActions.CreateError({ error }))
        )
      )
    )
  );

}
