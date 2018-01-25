// import { createSelector } from 'reselect';
//
// /**
//  * More info: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
//  */
// import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
//
// /**
//  * More info: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
//  */
//
// /**
//  * Every reducer module's default export is the reducer function itself. In
//  * addition, each module should export a type or interface that describes
//  * the state of the reducer plus any selector functions. The `* as`
//  * notation packages up all of the exports into a single object.
//  */
// import * as fromUser       from './reducers/user.reducer';
// import * as fromAuth  from './reducers/auth.reducer';
//
// /**
//  * We treat each reducer like a table in a database. This means
//  * our top level state interface is just a map of keys to inner state types.
//  */
// export interface State {
//   user: fromUser.State;
//   auth: fromAuth.State;
// }
//
// /**
//  * Because metareducers take a reducer function and return a new reducer,
//  * we can use our compose helper to chain them together. Here we are
//  * using combineReducers to make our top level reducer, and then
//  * wrapping that in storeLogger. Remember that compose applies
//  * the result from right to left.
//  */
// export const gAppReducers: ActionReducerMap<State> = {
//   user: fromUser.reducer,
//   auth: fromAuth.reducer
// };
//
// /**
//  * Every reducer module exports selector functions, however child reducers
//  * have no knowledge of the overall state tree. To make them useable, we
//  * need to make new selectors that wrap them.
//  */
//
// /**
//  * User store functions
//  */
// export const getUserState   = createFeatureSelector<fromUser.State>('user');
//
// export const getgetUserLoaded  = createSelector(getUserState, fromUser.getLoaded);
// export const getgetUserLoading = createSelector(getUserState, fromUser.getLoading);
// export const getgetUserFailed  = createSelector(getUserState, fromUser.getFailed);
// export const getUser           = createSelector(getUserState, fromUser.getUser);
// export const getUsers          = createSelector(getUserState, fromUser.getUsers);
//
//
// /**
//  * Auth store functions
//  */
// export const getAuthState   = (state: State) => state.auth;
// export const getAuthLoaded  = createSelector(getAuthState, fromAuth.getLoaded);
// export const getAuthLoading = createSelector(getAuthState, fromAuth.getLoading);
// export const getAuthFailed  = createSelector(getAuthState, fromAuth.getFailed);
// export const getLoggedUser  = createSelector(getAuthState, fromAuth.getLoggedUser);
