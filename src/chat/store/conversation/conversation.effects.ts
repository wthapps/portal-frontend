import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, exhaustMap } from 'rxjs/operators';
import { ConversationService } from '../../conversation/conversation.service';
import * as ConversationActions from './conversation.actions';
import { ApiBaseService } from '@shared/services';

@Injectable()
export class ConversationEffects {
  constructor(private actions$: Actions,
              private conversationService: ConversationService,
              private apiBaseService: ApiBaseService) {}

  @Effect()
  getAll$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.GetItems>(ConversationActions.ActionTypes.GET_ITEMS),
    switchMap(action =>
      this.conversationService.getAll(action.payload.query).pipe(
        map(response => {
          const conversations = [];
          response.data.forEach(item => {
            conversations.push(item.attributes);
          });
          return new ConversationActions.GetItemsSuccess({
            conversations: conversations,
            links: response.links
          });
        }),
        catchError(error =>
          of(new ConversationActions.GetItemsError({ error }))
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

  @Effect()
  getSearch$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.Search>(ConversationActions.ActionTypes.SEARCH),
    switchMap(action =>
      this.conversationService.getAll(action.payload).pipe(
        map(response => {
          const conversations = [];
          response.data.forEach(item => {
            conversations.push(item.attributes);
          });
          return new ConversationActions.SearchSuccess({conversations: conversations});
        }),
        catchError(error =>
          of(new ConversationActions.SearchError({ error }))
        )
      )
    )
  );

  @Effect()
  create: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.Create>(ConversationActions.ActionTypes.CREATE),
    switchMap(action =>
      this.conversationService.create(action.payload).pipe(
        map(response => {
          const conversation = response.data.attributes;
          return new ConversationActions.UpdateSuccess({conversation: conversation});
        }),
        catchError(error =>
          of(new ConversationActions.CreateError({ error }))
        )
      )
    )
  );

  @Effect()
  updateUser$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.UpdateSelf>(ConversationActions.ActionTypes.UPDATE_SELF),
    switchMap(action =>
      this.apiBaseService.put(`zone/chat/group_user/${action.payload.id}`, action.payload.body).pipe(
        map(response => {
          const conversationMember = response.data;

          return new ConversationActions.UpdateSelfSuccess({conversation: {
            id: conversationMember.group_id,
            favorite: conversationMember.favorite,
            notification: conversationMember.notification,
          }});
        }),
        catchError(error =>
          of(new ConversationActions.UpdateSelfError({ error }))
        )
      )
    )
  );

}
