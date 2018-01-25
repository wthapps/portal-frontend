// import * as actions from '../actions/auth.action';
// import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
//
// export interface State extends EntityState<any> {
//   loading: boolean;
//   loaded:  boolean;
//   failed:  boolean;
//   user:    any;
// };
// export const adapter: EntityAdapter<any> = createEntityAdapter<any>();
//
// const INITIAL_STATE: State = adapter.getInitialState({
//   ids:  [],
//   entities: null,
//   loading: false,
//   loaded:  false,
//   failed:  false,
//   user:    null
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
//     default: {
//       return state;
//     }
//   }
// };
//
// export const getLoading = (state: State) => state.loading;
// export const getLoaded  = (state: State) => state.loaded;
// export const getFailed  = (state: State) => state.failed;
// export const getLoggedUser  = (state: State) => state.user;
//
