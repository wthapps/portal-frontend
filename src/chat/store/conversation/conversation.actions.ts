import { Action } from '@ngrx/store';

export enum ActionTypes  {
  GET_ITEMS             = 'CONVERSATION_GET_ITEMS',
  GET_ITEMS_SUCCESS     = 'CONVERSATION_GET_ITEMS_SUCCESS',
  GET_ITEMS_ERROR       = 'CONVERSATION_GET_ITEMS_ERROR',
  SEARCH                = 'CONVERSATION_SEARCH',
  SEARCH_SUCCESS        = 'CONVERSATION_SEARCH_SUCCESS',
  SEARCH_ERROR          = 'CONVERSATION_SEARCH_ERROR',
  CLEAR_SEARCH          = 'CONVERSATION_CLEAR_SEARCH',
  GET_ITEM              = 'CONVERSATION_GET_ITEM',
  GET_ITEM_SUCCESS      = 'CONVERSATION_GET_ITEM_SUCCESS',
  GET_ITEM_ERROR        = 'CONVERSATION_GET_ITEM_ERROR',
  CREATE                = 'CONVERSATION_CREATE',
  CREATE_SUCCESS        = 'CONVERSATION_CREATE_SUCCESS',
  CREATE_ERROR          = 'CONVERSATION_CREATE_ERROR',
  UPDATE                = 'CONVERSATION_UPDATE',
  UPDATE_SUCCESS        = 'CONVERSATION_UPDATE_SUCCESS',
  UPDATE_ERROR          = 'CONVERSATION_UPDATE_ERROR',
  UPDATE_SELF           = 'CONVERSATION_UPDATE_SELF',
  UPDATE_SELF_SUCCESS   = 'CONVERSATION_UPDATE_SELF_SUCCESS',
  UPDATE_SELF_ERROR     = 'CONVERSATION_UPDATE_SELF_ERROR',
  HIDE                  = 'CONVERSATION_HIDE',
  HIDE_SUCCESS          = 'CONVERSATION_HIDE_SUCCESS',
  HIDE_ERROR            = 'CONVERSATION_HIDE_ERROR',
  JOIN                  = 'CONVERSATION_JOIN',
  JOIN_SUCCESS          = 'CONVERSATION_JOIN_SUCCESS',
  JOIN_ERROR            = 'CONVERSATION_JOIN_ERROR',
  LEAVE                 = 'CONVERSATION_LEAVE',
  LEAVE_SUCCESS         = 'CONVERSATION_LEAVE_SUCCESS',
  LEAVE_ERROR           = 'CONVERSATION_LEAVE_ERROR',
  DELETE                = 'CONVERSATION_DELETE',
  DELETE_SUCCESS        = 'CONVERSATION_DELETE_SUCCESS',
  DELETE_ERROR          = 'CONVERSATION_DELETE_ERROR',
  SELECT_ITEM           = 'CONVERSATION_SELECT_ITEM',
  ADD_MEMBERS           = 'CONVERSATION_ADD_MEMBERS',
  ADD_MEMBERS_SUCCESS   = 'CONVERSATION_ADD_MEMBERS_SUCCESS',
  ADD_MEMBERS_ERROR     = 'CONVERSATION_ADD_MEMBERS_ERROR',
  REMOVE_MEMBER         = 'CONVERSATION_REMOVE_MEMBER',
  REMOVE_MEMBER_SUCCESS = 'CONVERSATION_REMOVE_MEMBER_SUCCESS',
  REMOVE_MEMBER_ERROR   = 'CONVERSATION_REMOVE_MEMBER_ERROR',
  ACCEPT_INVITATION           = 'CONVERSATION_ACCEPT_INVITATION',
  ACCEPT_INVITATION_SUCCESS   = 'CONVERSATION_ACCEPT_INVITATION_SUCCESS',
  ACCEPT_INVITATION_ERROR     = 'CONVERSATION_ACCEPT_INVITATION_ERROR',
  DECLINE_INVITATION          = 'CONVERSATION_DECLINE_INVITATION',
  DECLINE_INVITATION_SUCCESS  = 'CONVERSATION_DECLINE_INVITATION_SUCCESS',
  DECLINE_INVITATION_ERROR    = 'CONVERSATION_DECLINE_INVITATION_ERROR',

}
/**
 * Get Items Actions
 */
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

/**
 * Get more actions
 */
export class Search implements Action {
  readonly type = ActionTypes.SEARCH;

  constructor(public payload: any) { }
}

export class SearchSuccess implements Action {
  readonly type = ActionTypes.SEARCH_SUCCESS;

  constructor(public payload: any) { }
}

export class SearchError implements Action {
  readonly type = ActionTypes.SEARCH_ERROR;

  constructor(public payload: any = null) { }
}

export class ClearSearch implements Action {
  readonly type = ActionTypes.CLEAR_SEARCH;

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

// Create actions
export class Create implements Action {
  readonly type = ActionTypes.CREATE;

  constructor(public payload: any) { }
}

export class CreateSuccess implements Action {
  readonly type = ActionTypes.CREATE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class CreateError implements Action {
  readonly type = ActionTypes.CREATE_ERROR;

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

// Update User actions
/**
 * This class is use for update favorite, notification
 */
export class UpdateSelf implements Action {
  readonly type = ActionTypes.UPDATE_SELF;

  constructor(public payload: any) { }
}

export class UpdateSelfSuccess implements Action {
  readonly type = ActionTypes.UPDATE_SELF_SUCCESS;

  constructor(public payload: any = null) { }
}

export class UpdateSelfError implements Action {
  readonly type = ActionTypes.UPDATE_SELF_ERROR;

  constructor(public payload: any = null) { }
}

// Hide actions
export class Hide implements Action {
  readonly type = ActionTypes.HIDE;

  constructor(public payload: any) { }
}

export class HideSuccess implements Action {
  readonly type = ActionTypes.HIDE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class HideError implements Action {
  readonly type = ActionTypes.HIDE_ERROR;

  constructor(public payload: any = null) { }
}

// Join actions
export class Join implements Action {
  readonly type = ActionTypes.JOIN;

  constructor(public payload: any) { }
}

export class JoinSuccess implements Action {
  readonly type = ActionTypes.JOIN_SUCCESS;

  constructor(public payload: any = null) { }
}

export class JoinError implements Action {
  readonly type = ActionTypes.JOIN_ERROR;

  constructor(public payload: any = null) { }
}

// Leave actions
export class Leave implements Action {
  readonly type = ActionTypes.LEAVE;

  constructor(public payload: any) { }
}

export class LeaveSuccess implements Action {
  readonly type = ActionTypes.LEAVE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class LeaveError implements Action {
  readonly type = ActionTypes.LEAVE_ERROR;

  constructor(public payload: any = null) { }
}

// Delete actions
export class Delete implements Action {
  readonly type = ActionTypes.DELETE;

  constructor(public payload: any) { }
}

export class DeleteSuccess implements Action {
  readonly type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class DeleteError implements Action {
  readonly type = ActionTypes.DELETE_ERROR;

  constructor(public payload: any = null) { }
}

// Select actions
export class SelectItem implements Action {
  readonly type = ActionTypes.SELECT_ITEM;

  constructor(public payload: any) { }
}

// Add members actions
export class AddMembers implements Action {
  readonly type = ActionTypes.ADD_MEMBERS;

  constructor(public payload: any) { }
}

export class AddMembersSuccess implements Action {
  readonly type = ActionTypes.ADD_MEMBERS_SUCCESS;

  constructor(public payload: any = null) { }
}

export class AddMembersError implements Action {
  readonly type = ActionTypes.ADD_MEMBERS_ERROR;

  constructor(public payload: any = null) { }
}

// Remove Member actions
export class RemoveMember implements Action {
  readonly type = ActionTypes.REMOVE_MEMBER;

  constructor(public payload: any) { }
}

export class RemoveMemberSuccess implements Action {
  readonly type = ActionTypes.REMOVE_MEMBER_SUCCESS;

  constructor(public payload: any = null) { }
}

export class RemoveMemberError implements Action {
  readonly type = ActionTypes.REMOVE_MEMBER_ERROR;

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


export type Actions =
  GetItems |
  GetItemsSuccess |
  GetItemsError |
  GetItem |
  GetItemSuccess |
  GetItemError |
  Search |
  SearchSuccess |
  SearchError |
  ClearSearch |
  Create |
  CreateSuccess |
  CreateError |
  Update |
  UpdateSuccess |
  UpdateError |
  UpdateSelf |
  UpdateSelfSuccess |
  UpdateSelfError |
  Hide |
  HideSuccess |
  Hide |
  Join |
  JoinSuccess |
  JoinError |
  Leave |
  LeaveSuccess |
  LeaveError |
  Delete |
  DeleteSuccess |
  DeleteError |
  SelectItem |
  AddMembers |
  AddMembersSuccess |
  AddMembersError |
  RemoveMember |
  RemoveMemberSuccess |
  RemoveMemberError |
  AcceptInvitation |
  AcceptInvitationSuccess |
  AcceptInvitationError |
  DeclineInvitation |
  DeclineInvitationSuccess |
  DeclineInvitationError;
