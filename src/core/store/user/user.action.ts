import { Action }   from '@ngrx/store';

export const ActionTypes = {
  LOGIN:                  '[User] Login',
  LOGIN_SUCCESS:          '[User] Login Success',
  LOGIN_FAIL:             '[User] Login Fail',
  REGISTER:               '[User] Register',
  REGISTER_SUCCESS:       '[User] Register Success',
  REGISTER_FAIL:          '[User] Register Fail',
  LOGOUT:                 '[User] Logout',
  LOGOUT_SUCCESS:         '[User] Logout Success',
  LOGOUT_FAIL:            '[User] Logout Fail',
  ADD:                    '[User] Add',
  ADD_SUCCESS:            '[User] Add Success',
  ADD_FAIL:               '[User] Add Fail',
  DELETE:                 '[User] Delete',
  DELETE_SUCCESS:         '[User] Delete Success',
  DELETE_FAIL:            '[User] Delete Fail'
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
  | Add
  | AddSuccess
  | AddFail
  | Delete
  | DeleteSuccess
  | DeleteFail;
