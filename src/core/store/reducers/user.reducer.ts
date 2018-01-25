//
// import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
// import * as actions from '../actions/user.action';
// import { User } from '@wth/shared/shared/models';
//
// export interface State extends EntityState<User> {
//   loading: boolean;
//   loaded:  boolean;
//   failed:  boolean;
//   user:    User;
//   users:   Array<User>;
// };
//
// export const adapter: EntityAdapter<User> = createEntityAdapter<User>();
//
//
// const INITIAL_STATE: State = adapter.getInitialState({
//   ids: [],
//   entities: null,
//   loading: false,
//   loaded:  false,
//   failed:  false,
//   user:    null,
//   users:   []
// });
//
// export function reducer(state = INITIAL_STATE, action: actions.Actions): State {
//   if (!action) {
//     return state;
//   }
//
//   switch (action.type) {
//     case actions.ActionTypes.LOGIN: {
//       return Object.assign({}, state, {
//         loading: true
//       });
//     }
//
//     case actions.ActionTypes.LOGIN_SUCCESS: {
//       return Object.assign({}, state, {
//         loaded:   true,
//         loading:  false,
//         failed:   false,
//         user:     action.payload
//       });
//     }
//
//     case actions.ActionTypes.LOGIN_FAIL: {
//       return Object.assign({}, state, {
//         loaded:   false,
//         loading:  false,
//         failed:   true,
//         user:     null
//       });
//     }
//
//     case actions.ActionTypes.REGISTER: {
//       return Object.assign({}, state, {
//         loading: true
//       });
//     }
//
//     case actions.ActionTypes.REGISTER_SUCCESS: {
//       return Object.assign({}, state, {
//         loaded:   true,
//         loading:  false,
//         failed:   false,
//         user:     action.payload
//       });
//     }
//
//     case actions.ActionTypes.REGISTER_FAIL: {
//       return Object.assign({}, state, {
//         loaded:   false,
//         loading:  false,
//         failed:   true,
//         user:     null
//       });
//     }
//     case actions.ActionTypes.LOGOUT: {
//       return Object.assign({}, state, {
//         loading: true
//       });
//     }
//
//     case actions.ActionTypes.LOGOUT_SUCCESS: {
//       return Object.assign({}, state, {
//         loaded:   true,
//         loading:  false,
//         failed:   false,
//         user:     action.payload
//       });
//     }
//
//     case actions.ActionTypes.LOGOUT_FAIL: {
//       return Object.assign({}, state, {
//         loaded:   false,
//         loading:  false,
//         failed:   true,
//         user:     null
//       });
//     }
//     case actions.ActionTypes.ADD: {
//       return Object.assign({}, state, {
//         loading: true
//       });
//     }
//
//     case actions.ActionTypes.ADD_SUCCESS: {
//       return Object.assign({}, state, {
//         loaded:   true,
//         loading:  false,
//         failed:   false,
//         user:     action.payload
//       });
//     }
//
//     case actions.ActionTypes.ADD_FAIL: {
//       return Object.assign({}, state, {
//         loaded:   false,
//         loading:  false,
//         failed:   true,
//         user:     null
//       });
//     }
//     case actions.ActionTypes.DELETE: {
//       return Object.assign({}, state, {
//         loading: true
//       });
//     }
//
//     case actions.ActionTypes.DELETE_SUCCESS: {
//       return Object.assign({}, state, {
//         loaded:   true,
//         loading:  false,
//         failed:   false,
//         user:     action.payload
//       });
//     }
//
//     case actions.ActionTypes.DELETE_FAIL: {
//       return Object.assign({}, state, {
//         loaded:   false,
//         loading:  false,
//         failed:   true,
//         user:     null
//       });
//     }
//     default: {
//       return state;
//     }
//   }
// };
//
// export const getUser    = (state: State) => state.user;
// export const getUsers    = (state: State) => state.users;
// export const getLoading = (state: State) => state.loading;
// export const getLoaded  = (state: State) => state.loaded;
// export const getFailed  = (state: State) => state.failed;
