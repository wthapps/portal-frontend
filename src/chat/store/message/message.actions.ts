import { Action } from '@ngrx/store';

export enum ActionTypes  {
  GET_ITEMS         = 'MESSAGE_GET_ITEMS',
  GET_ITEMS_SUCCESS = 'MESSAGE_GET_ITEMS_SUCCESS',
  GET_ITEMS_ERROR   = 'MESSAGE_GET_ITEMS_ERROR',
  GET_MORE          = 'MESSAGE_GET_MORE',
  GET_MORE_SUCCESS  = 'MESSAGE_GET_MORE_SUCCESS',
  GET_MORE_ERROR    = 'MESSAGE_GET_MORE_ERROR',
  GET_NEWER_ITEMS          = 'CONVERSATION_GET_NEWER_ITEMS',
  GET_NEWER_ITEMS_SUCCESS  = 'CONVERSATION_GET_NEWER_ITEMS_SUCCESS',
  GET_NEWER_ITEMS_ERROR    = 'CONVERSATION_GET_NEWER_ITEMS_ERROR',
  GET_ITEM          = 'MESSAGE_GET_ITEM',
  GET_ITEM_SUCCESS  = 'MESSAGE_GET_ITEM_SUCCESS',
  GET_ITEM_ERROR    = 'MESSAGE_GET_ITEM_ERROR',
  SELECT_ITEM       = 'MESSAGE_SELECT_ITEM',
  CREATE            = 'MESSAGE_CREATE',
  CREATE_SUCCESS    = 'MESSAGE_CREATE_SUCCESS',
  CREATE_ERROR      = 'MESSAGE_CREATE_ERROR',
  UPDATE            = 'MESSAGE_UPDATE',
  UPDATE_SUCCESS    = 'MESSAGE_UPDATE_SUCCESS',
  UPDATE_ERROR      = 'MESSAGE_UPDATE_ERROR',
  UPDATE_CURSOR            = 'MESSAGE_UPDATE_CURSOR',
  UPDATE_CURSOR_SUCCESS    = 'MESSAGE_UPDATE_CURSOR_SUCCESS',
  UPDATE_CURSOR_ERROR      = 'MESSAGE_UPDATE_CURSOR_ERROR',
  DELETE            = 'MESSAGE_DELETE',
  DELETE_SUCCESS    = 'MESSAGE_DELETE_SUCCESS',
  DELETE_ERROR      = 'MESSAGE_DELETE_ERROR',
  SET_STATE         = 'SET_STATE'
}

// Get all actions

export class GetItems implements Action {
  readonly type = ActionTypes.GET_ITEMS;

  constructor(public payload: any) { }
}

export class GetItemsSuccess implements Action {
  readonly type = ActionTypes.GET_ITEMS_SUCCESS;

  constructor(public payload: any) { }
}

export class GetItemsError implements Action {
  readonly type = ActionTypes.GET_ITEMS_ERROR;

  constructor(public payload: any = null) { }
}

// Get more actions
export class GetMore implements Action {
  readonly type = ActionTypes.GET_MORE;

  constructor(public payload: any) { }
}

export class GetMoreSuccess implements Action {
  readonly type = ActionTypes.GET_MORE_SUCCESS;

  constructor(public payload: any) { }
}

export class GetMoreError implements Action {
  readonly type = ActionTypes.GET_MORE_ERROR;

  constructor(public payload: any = null) { }
}

/**
 * Get newer items Actions
 */
export class GetNewerItems implements Action {
  readonly type = ActionTypes.GET_NEWER_ITEMS;

  constructor(public payload: {path: string, queryParams: {}}) { }
}

export class GetNewerItemsSuccess implements Action {
  readonly type = ActionTypes.GET_NEWER_ITEMS_SUCCESS;

  constructor(public payload: {messages: any[], links?: {}}) { }
}

export class GetNewerItemsError implements Action {
  readonly type = ActionTypes.GET_NEWER_ITEMS_ERROR;

  constructor(public payload: any = null) { }
}

// Get item actions

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

// Select actions
export class SelectItem implements Action {
  readonly type = ActionTypes.SELECT_ITEM;

  constructor(public payload: any = null) { }
}

// Create actions
export class Create implements Action {
  readonly type = ActionTypes.CREATE;

  constructor(public payload: any = null) { }
}

export class CreateSuccess implements Action {
  readonly type = ActionTypes.CREATE_SUCCESS;

  constructor(public payload: any = {message: null}) { }
}

export class CreateError implements Action {
  readonly type = ActionTypes.CREATE_ERROR;

  constructor(public payload: any = null) { }
}

// Update actions
export class Update implements Action {
  readonly type = ActionTypes.UPDATE;

  constructor(public payload: any = null) { }
}

export class UpdateSuccess implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class UpdateError implements Action {
  readonly type = ActionTypes.UPDATE_ERROR;

  constructor(public payload: any = null) { }
}

// Update Cursor actions
export class UpdateCursor implements Action {
  readonly type = ActionTypes.UPDATE_CURSOR;

  constructor(public payload: any = null) { }
}

export class UpdateCursorSuccess implements Action {
  readonly type = ActionTypes.UPDATE_CURSOR_SUCCESS;

  constructor(public payload: any = null) { }
}

export class UpdateCursorError implements Action {
  readonly type = ActionTypes.UPDATE_CURSOR_ERROR;

  constructor(public payload: any = null) { }
}

// Delete actions
export class Delete implements Action {
  readonly type = ActionTypes.DELETE;

  constructor(public payload: any = null) { }
}

export class DeleteSuccess implements Action {
  readonly type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class DeleteError implements Action {
  readonly type = ActionTypes.DELETE_ERROR;

  constructor(public payload: any = null) { }
}

export class SetState implements Action {
  readonly type = ActionTypes.SET_STATE;

  constructor(public payload: any = null) { }
}


export type Actions =
  GetItems |
  GetItemsSuccess |
  GetItemsError |
  GetMore |
  GetMoreSuccess |
  GetMoreError |
  GetNewerItems |
  GetNewerItemsSuccess |
  GetNewerItemsError |
  GetItem |
  GetItemSuccess |
  GetItemError |
  Create |
  CreateSuccess |
  CreateError |
  Update |
  UpdateSuccess |
  UpdateError |
  UpdateCursor |
  UpdateCursorSuccess |
  UpdateCursorError |
  Delete |
  DeleteSuccess |
  DeleteError |
  SelectItem |
  SetState;
