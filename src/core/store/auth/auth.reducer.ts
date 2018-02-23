import * as actions from './auth.action';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface AuthState extends EntityState<any> {
  loggedIn: boolean;
  user:    any | null;
}

export const authAdapter: EntityAdapter<any> = createEntityAdapter<any>();

const INITIAL_STATE: AuthState = authAdapter.getInitialState({
  loggedIn: false,
  user:    null
});

export function authReducer(state = INITIAL_STATE, action: actions.Actions): AuthState {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case actions.ActionTypes.LOGIN: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.LOGIN_SUCCESS: {
      return Object.assign({}, state, {
        loaded:   true,
        loading:  false,
        failed:   false,
        user:     action.payload
      });
    }

    case actions.ActionTypes.LOGIN_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        user:     null
      });
    }

    case actions.ActionTypes.LOGOUT: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.LOGOUT_SUCCESS: {
      return Object.assign({}, state, {
        loaded:   true,
        loading:  false,
        failed:   false,
        user:     action.payload
      });
    }

    case actions.ActionTypes.LOGOUT_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        user:     null
      });
    }

    default: {
      return state;
    }
  }
};

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoggedIn  = createSelector(selectAuthState, (state: AuthState) => state.loggedIn);
export const selectAuthUser  = createSelector(selectAuthState, (state: AuthState) => state.user);

