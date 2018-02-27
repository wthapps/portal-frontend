import { Action } from '@ngrx/store';
// import { Update } from '@ngrx/entity';
// import { User } from '@wth/shared/shared/models';

export const ActionTypes = {
  LOGIN:                  '[Account] Login',
  LOGIN_SUCCESS:          '[Account] Login Success',
  LOGIN_FAIL:             '[Account] Login Fail',
  REGISTER:               '[Account] Register',
  REGISTER_SUCCESS:       '[Account] Register Success',
  REGISTER_FAIL:          '[Account] Register Fail',
  LOGOUT:                 '[Account] Logout',
  LOGOUT_SUCCESS:         '[Account] Logout Success',
  LOGOUT_FAIL:            '[Account] Logout Fail',
  GET:                    '[Account] Get',
  GET_SUCCESS:            '[Account] Get Success',
  GET_FAIL:               '[Account] Get Fail',
  GET_ACCOUNTS:           '[Account] Get Accounts',
  GET_ACCOUNTS_SUCCESS:   '[Account] Get Accounts Success',
  GET_ACCOUNTS_FAIL:      '[Account] Get Account Fail',
  ADD:                    '[Account] Add',
  ADD_SUCCESS:            '[Account] Add Success',
  ADD_FAIL:               '[Account] Add Fail',
  ADD_MANY:                    '[Account] Add Many',
  ADD_MANY_SUCCESS:            '[Account] Add Many Success',
  ADD_MANY_FAIL:               '[Account] Add Many Fail',
  UPDATE:                 '[Account] Update',
  UPDATE_SUCCESS:         '[Account] Update Success',
  UPDATE_FAIL:            '[Account] Update Fail',
  DELETE:                 '[Account] Delete',
  DELETE_SUCCESS:         '[Account] Delete Success',
  DELETE_FAIL:            '[Account] Delete Fail'
};

/**
 * Login Actions
 */
export class Login implements Action {
  type = ActionTypes.LOGIN;

  constructor(public payload: any) { }
}

export class LoginSuccess implements Action {
  type = ActionTypes.LOGIN_SUCCESS;

  constructor(public payload: any) { }
}

export class LoginFail implements Action {
  type = ActionTypes.LOGIN_FAIL;

  constructor(public payload: any = null) { }
}

/**
 * Register Actions
 */
export class Register implements Action {
  type = ActionTypes.REGISTER;

  constructor(public payload: any = null) { }
}

export class RegisterSuccess implements Action {
  type = ActionTypes.REGISTER_SUCCESS;

  constructor(public payload: any) { }
}

export class RegisterFail implements Action {
  type = ActionTypes.REGISTER_FAIL;

  constructor(public payload: any = null) { }
}


/**
 * Logout Actions
 */
export class Logout implements Action {
  type = ActionTypes.LOGOUT;

  constructor(public payload: any = null) { }
}

export class LogoutSuccess implements Action {
  type = ActionTypes.LOGOUT_SUCCESS;

  constructor(public payload: any = null) { }
}

export class LogoutFail implements Action {
  type = ActionTypes.LOGOUT_FAIL;

  constructor(public payload: any = null) { }
}

export class Get implements Action {
  type = ActionTypes.GET;

  constructor(public payload: any) { }
}

export class GetSuccess implements Action {
  type = ActionTypes.GET_SUCCESS;

  constructor(public payload: any) { }
}

export class GetFail implements Action {
  type = ActionTypes.GET_FAIL;

  constructor(public payload: any) { }
}

export class GetAccounts implements Action {
  type = ActionTypes.GET_ACCOUNTS;

  constructor(public payload: any) { }
}

export class GetAccountsSuccess implements Action {
  type = ActionTypes.GET_ACCOUNTS_SUCCESS;

  constructor(public payload: any) { }
}

export class GetAccountsFail implements Action {
  type = ActionTypes.GET_ACCOUNTS_FAIL;

  constructor(public payload: any) { }
}

export class Update implements Action {
  type = ActionTypes.UPDATE;

  constructor(public payload: any) { }
}

export class UpdateSuccess implements Action {
  type = ActionTypes.UPDATE_SUCCESS;

  constructor(public payload: any) { }
}

export class UpdateFail implements Action {
  type = ActionTypes.UPDATE_FAIL;

  constructor(public payload: any) { }
}

export class Add implements Action {
  type = ActionTypes.ADD;

  constructor(public payload: any) { }
}

export class AddSuccess implements Action {
  type = ActionTypes.ADD_SUCCESS;

  constructor(public payload: any) { }
}

export class AddFail implements Action {
  type = ActionTypes.ADD_FAIL;

  constructor(public payload: any) { }
}

export class AddMany implements Action {
  type = ActionTypes.ADD_MANY;

  constructor(public payload: any) { }
}

export class AddManySuccess implements Action {
  type = ActionTypes.ADD_MANY_SUCCESS;

  constructor(public payload: any) { }
}

export class AddManyFail implements Action {
  type = ActionTypes.ADD_MANY_FAIL;

  constructor(public payload: any) { }
}

export class Delete implements Action {
  type = ActionTypes.DELETE;

  constructor(public payload: any) { }
}

export class DeleteSuccess implements Action {
  type = ActionTypes.DELETE_SUCCESS;

  constructor(public payload: any) { }
}

export class DeleteFail implements Action {
  type = ActionTypes.DELETE_FAIL;

  constructor(public payload: any) { }
}

export type Actions
  = Login
  | LoginSuccess
  | LoginFail
  | Register
  | RegisterSuccess
  | RegisterFail
  | Logout
  | LogoutSuccess
  | LogoutFail
  | Get
  | GetSuccess
  | GetFail
  | GetAccounts
  | GetAccountsSuccess
  | GetAccountsFail
  | Add
  | AddSuccess
  | AddFail
  | AddMany
  | AddManySuccess
  | AddManyFail
  | Update
  | UpdateSuccess
  | UpdateFail
  | Delete
  | DeleteSuccess
  | DeleteFail;
