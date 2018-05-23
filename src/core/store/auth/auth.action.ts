import { Action }   from '@ngrx/store';

export const ActionTypes = {
  LOGIN:                  '[Auth] Login',
  LOGIN_SUCCESS:          '[Auth] Login Success',
  LOGIN_FAIL:             '[Auth] Login Fail',
  LOGIN_REDIRECT:         '[Auth] Login Redirect',
  LOGOUT:                 '[Auth] Logout',
  LOGOUT_SUCCESS:         '[Auth] Logout Success',
  LOGOUT_FAIL:            '[Auth] Logout Fail'
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

export class LoginRedirect implements Action {
  type = ActionTypes.LOGIN_REDIRECT;

  constructor(public payload: any) { }
}

export class LoginFail implements Action {
  type = ActionTypes.LOGIN_FAIL;

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




export type Actions
  = Login
  | LoginSuccess
  | LoginFail
  | LoginRedirect
  | Logout
  | LogoutSuccess
  | LogoutFail;
