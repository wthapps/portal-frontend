import { Action } from '@ngrx/store';

export enum ActionTypes  {
  GET_ALL           = 'CONVERSATION_GET_ALL',
  GET_ALL_SUCCESS   = 'CONVERSATION_GET_ALL_SUCCESS',
  GET_ALL_FAILURE   = 'CONVERSATION_GET_ALL_FAILURE',
  GET               = 'CONVERSATION_GET',
  CREATE            = 'CONVERSATION_CREATE',
  UPDATE            = 'CONVERSATION_UPDATE',
  DELETE            = 'CONVERSATION_DELETE'
}
/**
 * Get All Conversation Actions
 */
export class GetAll implements Action {
  readonly type = ActionTypes.GET_ALL;

  constructor(public payload: any) { }
}

export class GetAllSuccess implements Action {
  readonly type = ActionTypes.GET_ALL_SUCCESS;

  constructor(public payload: any) { }
}

export class GetAllFailure implements Action {
  readonly type = ActionTypes.GET_ALL_FAILURE;

  constructor(public payload: any = null) { }
}


export type Actions =
  GetAll |
  GetAllSuccess |
  GetAllFailure;
