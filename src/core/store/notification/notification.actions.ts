import { Action } from '@ngrx/store';

export enum ActionTypes  {
  LOAD_ITEMS                  = 'NOTIFICATION_LOAD_ITEMS',
  LOAD_ITEMS_SUCCESS          = 'NOTIFICATION_LOAD_ITEMS_SUCCESS',
  LOAD_ITEMS_ERROR            = 'NOTIFICATION_LOAD_ITEMS_ERROR',
  LOAD_MORE_ITEMS             = 'NOTIFICATION_LOAD_MORE_ITEMS',
  LOAD_MORE_ITEMS_SUCCESS     = 'NOTIFICATION_LOAD_MORE_ITEMS_SUCCESS',
  LOAD_MORE_ITEMS_ERROR       = 'NOTIFICATION_LOAD_MORE_ITEMS_ERROR',
  UPDATE                      = 'NOTIFICATION_UPDATE',
  UPDATE_SUCCESS              = 'NOTIFICATION_UPDATE_SUCCESS',
  UPDATE_ERROR                = 'NOTIFICATION_UPDATE_ERROR',
  UPDATE_DISPLAY              = 'NOTIFICATION_UPDATE_DISPLAY',
  UPDATE_DISPLAY_SUCCESS      = 'NOTIFICATION_UPDATE_DISPLAY_SUCCESS',
  UPDATE_DISPLAY_ERROR        = 'NOTIFICATION_UPDATE_DISPLAY_ERROR',
  ACCEPT_INVITATION           = 'NOTIFICATION_ACCEPT_INVITATION',
  ACCEPT_INVITATION_SUCCESS   = 'NOTIFICATION_ACCEPT_INVITATION_SUCCESS',
  ACCEPT_INVITATION_ERROR     = 'NOTIFICATION_ACCEPT_INVITATION_ERROR',
  DECLINE_INVITATION          = 'NOTIFICATION_DECLINE_INVITATION',
  DECLINE_INVITATION_SUCCESS  = 'NOTIFICATION_DECLINE_INVITATION_SUCCESS',
  DECLINE_INVITATION_ERROR    = 'NOTIFICATION_DECLINE_INVITATION_ERROR',
  SET_STATE                   = 'NOTIFICATION_SET_STATE',
  MARK_AS_READ                = 'NOTIFICATION_MARK_AS_READ',
  MARK_AS_READ_SUCCESS        = 'NOTIFICATION_MARK_AS_READ_SUCCESS',
  MARK_AS_READ_ERROR          = 'NOTIFICATION_MARK_AS_READ_ERROR',
  MARK_ALL_AS_READ            = 'NOTIFICATION_MARK_ALL_AS_READ',
  MARK_ALL_AS_READ_SUCCESS    = 'NOTIFICATION_MARK_ALL_AS_READ_SUCCESS',
  MARK_ALL_AS_READ_ERROR      = 'NOTIFICATION_MARK_ALL_AS_READ_ERROR'
}
/**
 * Get Items Actions
 */
export class LoadItems implements Action {
  readonly type = ActionTypes.LOAD_ITEMS;

  constructor(public payload: any) { }
}

export class LoadItemsSuccess implements Action {
  readonly type = ActionTypes.LOAD_ITEMS_SUCCESS;

  constructor(public payload: any) { }
}

export class LoadItemsError implements Action {
  readonly type = ActionTypes.LOAD_ITEMS_ERROR;

  constructor(public payload: any = null) { }
}

export class LoadMoreItems implements Action {
  readonly type = ActionTypes.LOAD_MORE_ITEMS;

  constructor(public payload: any) { }
}

export class LoadMoreItemsSuccess implements Action {
  readonly type = ActionTypes.LOAD_MORE_ITEMS_SUCCESS;

  constructor(public payload: any) { }
}

export class LoadMoreItemsError implements Action {
  readonly type = ActionTypes.LOAD_ITEMS_ERROR;

  constructor(public payload: any = null) { }
}


// Update actions
export class Update implements Action {
  readonly type = ActionTypes.UPDATE;

  constructor(public payload: any) { }
}

export class UpdateSuccess implements Action {
  readonly type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class UpdateError implements Action {
  readonly type = ActionTypes.UPDATE_ERROR;

  constructor(public payload: any = null) { }
}

// Update state
export class SetState implements Action {
  readonly type = ActionTypes.SET_STATE;

  constructor(public payload: any = null) { }
}


// Accept Invitation actions
export class AcceptInvitation implements Action {
  readonly type = ActionTypes.ACCEPT_INVITATION;

  constructor(public payload: any) { }
}

export class AcceptInvitationSuccess implements Action {
  readonly type = ActionTypes.ACCEPT_INVITATION_SUCCESS;

  constructor(public payload: any = null) { }
}

export class AcceptInvitationError implements Action {
  readonly type = ActionTypes.ACCEPT_INVITATION_ERROR;

  constructor(public payload: any = null) { }
}

// Accept Invitation actions
export class DeclineInvitation implements Action {
  readonly type = ActionTypes.DECLINE_INVITATION;

  constructor(public payload: any) { }
}

export class DeclineInvitationSuccess implements Action {
  readonly type = ActionTypes.DECLINE_INVITATION_SUCCESS;

  constructor(public payload: any = null) { }
}

export class DeclineInvitationError implements Action {
  readonly type = ActionTypes.DECLINE_INVITATION_ERROR;

  constructor(public payload: any = null) { }
}

// Mark all as read actions
export class MarkAsRead implements Action {
  readonly type = ActionTypes.MARK_AS_READ;

  constructor(public payload: any) { }
}

export class MarkAsReadSuccess implements Action {
  readonly type = ActionTypes.MARK_AS_READ_SUCCESS;

  constructor(public payload: any = null) { }
}

export class MarkAsReadError implements Action {
  readonly type = ActionTypes.MARK_AS_READ_ERROR;

  constructor(public payload: any = null) { }
}

// Mark all as read actions
export class MarkAllAsRead implements Action {
  readonly type = ActionTypes.MARK_ALL_AS_READ;

  constructor(public payload: any) { }
}

export class MarkAllAsReadSuccess implements Action {
  readonly type = ActionTypes.MARK_ALL_AS_READ_SUCCESS;

  constructor(public payload: any = null) { }
}

export class MarkAllAsReadError implements Action {
  readonly type = ActionTypes.MARK_ALL_AS_READ_ERROR;

  constructor(public payload: any = null) { }
}


export type Actions =
  LoadItems |
  LoadItemsSuccess |
  LoadItemsError |
  LoadMoreItems |
  LoadMoreItemsSuccess |
  LoadMoreItemsError |
  Update |
  UpdateSuccess |
  UpdateError |
  AcceptInvitation |
  AcceptInvitationSuccess |
  AcceptInvitationError |
  DeclineInvitation |
  DeclineInvitationSuccess |
  DeclineInvitationError |
  SetState |
  MarkAsRead |
  MarkAsReadSuccess |
  MarkAsReadError |
  MarkAllAsRead |
  MarkAllAsReadSuccess |
  MarkAllAsReadError;
