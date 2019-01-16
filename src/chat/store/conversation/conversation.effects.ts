import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ConversationService } from '../../conversation/conversation.service';
import * as ConversationActions from './conversation.actions';

@Injectable()
export class ConversationEffects {
  constructor(private conversationService: ConversationService, private actions$: Actions) {}

  @Effect()
  getAll$: Observable<Action> = this.actions$.pipe(
    ofType<ConversationActions.GetAll>(
      ConversationActions.ActionTypes.GET_ALL
    ),
    switchMap(action =>
      this.conversationService
        .getAll(action.payload.query)
        .pipe(
          map(
            response =>
              new ConversationActions.GetAllSuccess(response)
          ),
          catchError(error =>
            observableOf(new ConversationActions.GetAllFailure({ error }))
          )
        )
    )
  );
}
