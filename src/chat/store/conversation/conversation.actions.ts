import { Action } from '@ngrx/store';

export enum ActionTypes  {
  GET_ALL           = 'CONVERSATION_GET_ALL',
  GET_ALL_SUCCESS   = 'CONVERSATION_GET_ALL_SUCCESS',
  GET_ALL_ERROR     = 'CONVERSATION_GET_ALL_ERROR',
  GET_ITEM          = 'CONVERSATION_GET_ITEM',
  GET_ITEM_SUCCESS  = 'CONVERSATION_GET_ITEM_SUCCESS',
  GET_ITEM_ERROR    = 'CONVERSATION_GET_ITEM_ERROR',
  SET_SELECTED_ITEM = 'CONVERSATION_SET_SELECTED_ITEM',
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

export class GetAllError implements Action {
  readonly type = ActionTypes.GET_ALL_ERROR;

  constructor(public payload: any = null) { }
}

export class GetItem implements Action {
  readonly type = ActionTypes.GET_ITEM;

  constructor(public payload: any) { }
}

export class GetItemSuccess implements Action {
  readonly type = ActionTypes.GET_ITEM_SUCCESS;

  constructor(public payload: any = null) { }
}

export class GetItemError implements Action {
  readonly type = ActionTypes.GET_ITEM_ERROR;

  constructor(public payload: any = null) { }
}

export class SetSelectedItem implements Action {
  readonly type = ActionTypes.SET_SELECTED_ITEM;

  constructor(public payload: any) { }
}




export type Actions =
  GetAll |
  GetAllSuccess |
  GetAllError |
  GetItem |
  GetItemSuccess |
  GetItemError |
  SetSelectedItem;
