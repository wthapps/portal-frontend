import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import * as actions from './account.action';
import { User } from '@wth/shared/shared/models';


export interface AccountState extends EntityState<User> {
  loading: boolean;
  loaded:  boolean;
  failed:  boolean;
  user: User;
  users:   Array<User>;
}

export const accountAdapter: EntityAdapter<User> = createEntityAdapter<User>();


const INITIAL_STATE: AccountState = accountAdapter.getInitialState({
  loading: false,
  loaded:  false,
  failed:  false,
  user: null,
  users:   []
});

export function accountReducer(state = INITIAL_STATE, action: actions.Actions): AccountState {
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
        user: null,
        failed:   false
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

    case actions.ActionTypes.REGISTER: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.REGISTER_SUCCESS: {
      return Object.assign({}, state, {
        loaded:   true,
        loading:  false,
        failed:   false,
        user:     action.payload
      });
    }

    case actions.ActionTypes.REGISTER_FAIL: {
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

    case actions.ActionTypes.GET_ACCOUNTS: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.GET_ACCOUNTS_SUCCESS: {
      return accountAdapter.addAll(action.payload.data, state);
      // return Object.assign({}, state, {
      //   loaded:   true,
      //   loading:  false,
      //   failed:   false,
      //   users:     action.payload.data
      // });
    }

    case actions.ActionTypes.GET_ACCOUNTS_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        user:     null
      });
    }

    case actions.ActionTypes.ADD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.ADD_SUCCESS: {
      // return Object.assign({}, state, {
      //   loaded:   true,
      //   loading:  false,
      //   failed:   false,
      //   user:     action.payload
      // });
      return accountAdapter.addOne(action.payload.data, state);

    }

    case actions.ActionTypes.ADD_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        user:     null
      });
    }

    case actions.ActionTypes.ADD_MANY: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.ADD_MANY_SUCCESS: {
      // return Object.assign({}, state, {
      //   loaded:   true,
      //   loading:  false,
      //   failed:   false,
      //   user:     action.payload
      // });
      return accountAdapter.addMany(action.payload.data, state);

    }

    case actions.ActionTypes.ADD_MANY_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        user:     null
      });
    }

    case actions.ActionTypes.UPDATE: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.UPDATE_SUCCESS: {
      return accountAdapter.updateOne({id: action.payload.data.id, changes: action.payload.data }, state);
    }

    case actions.ActionTypes.UPDATE_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        user:     null
      });
    }

    case actions.ActionTypes.DELETE: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.DELETE_SUCCESS: {
      return accountAdapter.removeOne(action.payload.data[0].id, state);
      // return Object.assign({}, state, {
      //   loaded:   true,
      //   loading:  false,
      //   failed:   false,
      //   user:     action.payload
      // });
    }

    case actions.ActionTypes.DELETE_FAIL: {
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
}

// export const getUser    = (state: State) => state.user;
// export const getUsers    = (state: State) => state.users;
// export const getLoading = (state: State) => state.loading;
// export const getLoaded  = (state: State) => state.loaded;
// export const getFailed  = (state: State) => state.failed;

/**
 * User store functions
 */

export const {
  // select the array of user ids
  selectIds: selectUserIds,

  // select the dictionary of user entities
  selectEntities: selectUserEntities,

  // select the array of users
  selectAll: selectAllUsers,

  // select the total user count
  selectTotal: selectUserTotal
} = accountAdapter.getSelectors();

export const getAccountState   = createFeatureSelector<AccountState>('account');

export const getAccountLoaded  = createSelector(getAccountState, (state: AccountState) => state.loaded);
export const getAccountLoading = createSelector(getAccountState, (state: AccountState) => state.loading);
export const getAccountFailed  = createSelector(getAccountState, (state: AccountState) => state.failed);
export const getAccountUser    = createSelector(getAccountState, (state: AccountState) => state.user);
export const getAccountUsers   = createSelector(getAccountState, (state: AccountState) => state.users);
