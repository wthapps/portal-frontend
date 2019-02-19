import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, exhaustMap } from 'rxjs/operators';
import { ConversationService } from '../../conversation/conversation.service';
import * as ConversationActions from './conversation.actions';

@Injectable()
export class ConversationEffects {
  constructor(private conversationService: ConversationService, private actions$: Actions) {}

  @Effect()
  getAll$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.GetAll>(ConversationActions.ActionTypes.GET_ALL),
    switchMap(action =>
      this.conversationService.getAll(action.payload.query).pipe(
        map(response => {
          const conversations = [];
          response.data.forEach(item => {
            conversations.push(item.attributes);
          });
          return new ConversationActions.GetAllSuccess({
            conversations: conversations,
            links: response.links
          });
        }),
        catchError(error =>
          of(new ConversationActions.GetAllError({ error }))
        )
      )
    )
  );

  @Effect()
  getMore$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.GetMore>(ConversationActions.ActionTypes.GET_MORE),
    switchMap(action =>
      this.conversationService.getAll(action.payload).pipe(
        map(response => {
          const conversations = [];
          response.data.forEach(item => {
            conversations.push(item.attributes);
          });
          return new ConversationActions.GetMoreSuccess({conversations: conversations});
        }),
        catchError(error =>
          of(new ConversationActions.GetMoreError({ error }))
        )
      )
    )
  );

  @Effect()
  getItem$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.GetItem>(ConversationActions.ActionTypes.GET_ITEM),
    switchMap(action =>
      this.conversationService.get(action.payload).pipe(
        map(response => {
          return new ConversationActions.GetItemSuccess(response);
        }),
        catchError(error =>
          of(new ConversationActions.GetItemError({ error }))
        )
      )
    )
  );
}
