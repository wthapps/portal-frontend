import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { ConversationService } from '@shared/services/chat';
import * as NotificationActions from './notification.actions';

@Injectable()
export class NotificationEffects {
  constructor(private actions$: Actions,
              private conversationService: ConversationService) {}

  @Effect()
  getAll$: Observable<Action> = this.actions$.pipe(
    ofType<NotificationActions.LoadItems>(NotificationActions.ActionTypes.LOAD_ITEMS),
    switchMap(action =>
      this.conversationService.getAll(action.payload.query, action.payload.path).pipe(
        map(response => {
          const conversations = [];
          response.data.forEach(item => {
            conversations.push(item.attributes);
          });
          return new NotificationActions.LoadItemsSuccess({
            conversations: conversations,
            links: response.links
          });
        }),
        catchError(error =>
          of(new NotificationActions.LoadItemsError({ error }))
        )
      )
    )
  );

  @Effect()
  loadMoreItems$: Observable<Action> = this.actions$.pipe(
    ofType<NotificationActions.LoadMoreItems>(NotificationActions.ActionTypes.LOAD_MORE_ITEMS),
    switchMap(action =>
      this.conversationService.getAll(action.payload.query, action.payload.path).pipe(
        map(response => {
          const conversations = [];
          response.data.forEach(item => {
            conversations.push(item.attributes);
          });
          return new NotificationActions.LoadMoreItemsSuccess({
            conversations: conversations,
            links: response.links
          });
        }),
        catchError(error =>
          of(new NotificationActions.LoadMoreItemsError({ error }))
        )
      )
    )
  );

  @Effect()
  update$: Observable<Action> = this.actions$.pipe(
    ofType<NotificationActions.Update>(NotificationActions.ActionTypes.UPDATE),
    switchMap(action =>
      this.conversationService.update(action.payload.id, action.payload.body).pipe(
        map(response => {
          const conversationMember = response.data;

          return new NotificationActions.UpdateSuccess({conversation: {
              id: conversationMember.group_id,
              favorite: conversationMember.favorite,
              notification: conversationMember.notification,
            }});
        }),
        catchError(error =>
          of(new NotificationActions.UpdateError({ error }))
        )
      )
    )
  );

  // @Effect()
  // acceptInvitation$: Observable<Action> = this.actions$.pipe(
  //   ofType<NotificationActions.AcceptInvitation>(NotificationActions.ActionTypes.ACCEPT_INVITATION),
  //   switchMap(action =>
  //     this.conversationService.acceptInvitation(action.payload.id).pipe(
  //       map(response => {
  //         const conversation = response.data.attributes;
  //         return new NotificationActions.UpdateDisplaySuccess({conversation: conversation});
  //       }),
  //       catchError(error =>
  //         of(new NotificationActions.UpdateDisplayError({ error }))
  //       )
  //     )
  //   )
  // );

  @Effect()
  markAsRead: Observable<Action> = this.actions$.pipe(
    ofType<NotificationActions.MarkAsRead>(NotificationActions.ActionTypes.MARK_AS_READ),
    switchMap(action =>
      this.conversationService.markAsRead(action.payload.id).pipe(
        map(response => {
          return new NotificationActions.MarkAsReadSuccess({
            conversation: response.data.attributes
          });
        }),
        catchError(error =>
          of(new NotificationActions.MarkAsReadError({ error }))
        )
      )
    )
  );

  @Effect()
  markAllAsRead: Observable<Action> = this.actions$.pipe(
    ofType<NotificationActions.MarkAllAsRead>(NotificationActions.ActionTypes.MARK_ALL_AS_READ),
    switchMap(action =>
      this.conversationService.markAllAsRead().pipe(
        map(response => {
          return new NotificationActions.MarkAllAsReadSuccess({});
        }),
        catchError(error =>
          of(new NotificationActions.MarkAllAsReadError({ error }))
        )
      )
    )
  );

}
