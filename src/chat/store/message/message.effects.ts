import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap, concatMap } from 'rxjs/operators';
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
      this.messageService.getAll(
        action.payload.queryParams,
        action.payload.path).pipe(
        map(response => {
          const messages = [];
          response.data.forEach(message => {
            messages.push(message.attributes);
          });
          return new MessageActions.GetItemsSuccess({messages: messages, links: response.links});
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
      this.messageService.getAll(
        {},
        action.payload.path).pipe(
        map(response => {
          const messages = [];
          response.data.forEach(message => {
            messages.push(message.attributes);
          });

          return new MessageActions.GetMoreSuccess({messages: messages, links: response.links});
        }),
        catchError(error =>
          of(new MessageActions.GetItemsError({ error }))
        )
      )
    )
  );

  @Effect()
  getNewer$: Observable<Action> = this.actions$.pipe(
    ofType<MessageActions.GetNewerItems>(MessageActions.ActionTypes.GET_NEWER_ITEMS),
    concatMap(action =>
      this.messageService.getAll(action.payload.queryParams, action.payload.path).pipe(
        map(response => {
          const messages = [];
          response.data.forEach(item => {
            messages.push(item.attributes);
          });
          return new MessageActions.GetNewerItemsSuccess({
            messages: messages.reverse()
          });
        }),
        catchError(error =>
          of(new MessageActions.GetNewerItemsError({ error }))
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
    mergeMap(action =>
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

  @Effect()
  update$: Observable<Action> = this.actions$.pipe(
    ofType<MessageActions.Create>(MessageActions.ActionTypes.UPDATE),
    switchMap(action =>
      this.messageService.update(action.payload.conversationId, action.payload.message).pipe(
        map(response => {
          const message = response.data.attributes;

          return new MessageActions.UpdateSuccess({message: message});
        }),
        catchError(error =>
          of(new MessageActions.UpdateError({ error }))
        )
      )
    )
  );

  @Effect()
  delete$: Observable<Action> = this.actions$.pipe(
    ofType<MessageActions.Create>(MessageActions.ActionTypes.DELETE),
    switchMap(action =>
      this.messageService.delete(action.payload.conversationId, action.payload.message.uuid).pipe(
        map(response => {
          const message = response.data.attributes;
          // return new MessageActions.DeleteSuccess({message: message});
          return new MessageActions.UpdateSuccess({message: message});
        }),
        catchError(error =>
          of(new MessageActions.UpdateError({ error }))
        )
      )
    )
  );


}
