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
      this.conversationService.getAll(action.payload.query, action.payload.path).pipe(
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
  search$: Observable<Action> = this.actions$.pipe(
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
  update$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.Update>(ConversationActions.ActionTypes.UPDATE),
    switchMap(action =>
      this.conversationService.update(action.payload.id, action.payload.body).pipe(
        map(response => {
          const conversationMember = response.data;

          return new ConversationActions.UpdateSuccess({conversation: {
              id: conversationMember.group_id,
              favorite: conversationMember.favorite,
              notification: conversationMember.notification,
            }});
        }),
        catchError(error =>
          of(new ConversationActions.UpdateError({ error }))
        )
      )
    )
  );

  @Effect()
  updateDisplay$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.UpdateDisplay>(ConversationActions.ActionTypes.UPDATE_DISPLAY),
    switchMap(action =>
      this.conversationService.updateDisplay(action.payload.id, action.payload.body).pipe(
        map(response => {
          const conversation = response.data.attributes;

          if (conversation.status === 'decline') {
            return new ConversationActions.DeleteSuccess({conversation: conversation});
          } else {
            return new ConversationActions.UpdateDisplaySuccess({conversation: conversation});
          }
        }),
        catchError(error =>
          of(new ConversationActions.UpdateDisplayError({ error }))
        )
      )
    )
  );

  @Effect()
  acceptInvitation$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.AcceptInvitation>(ConversationActions.ActionTypes.ACCEPT_INVITATION),
    switchMap(action =>
      this.conversationService.acceptInvitation(action.payload.id).pipe(
        map(response => {
          const conversation = response.data.attributes;
          return new ConversationActions.UpdateDisplaySuccess({conversation: conversation});
        }),
        catchError(error =>
          of(new ConversationActions.UpdateDisplayError({ error }))
        )
      )
    )
  );

  @Effect()
  markAllAsRead: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.MarkAllAsRead>(ConversationActions.ActionTypes.MARK_ALL_AS_READ),
    switchMap(action =>
      this.conversationService.markAllAsRead().pipe(
        map(response => {
          return new ConversationActions.MarkAllAsReadSuccess({
            conversations: response.data.map(conversation => conversation.attributes)
          });
        }),
        catchError(error =>
          of(new ConversationActions.MarkAllAsReadError({ error }))
        )
      )
    )
  );

}
