import { createSelector } from 'reselect';

/**
 * More info: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

/**
 * More info: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as fromPhoto       from './reducers/photo.reducer';
import { EntityState } from '@ngrx/entity';

/**
 * We treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  photo:       fromPhoto.State;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export const mediaReducers: ActionReducerMap<State> = {
  photo: fromPhoto.reducer,
};

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 */

/**
 * Photos store functions
 */
export const getPhotoState   = createFeatureSelector<fromPhoto.State>('photo');

export const getPhotoLoaded  = createSelector(getPhotoState, fromPhoto.getLoaded);
export const getPhotoLoading = createSelector(getPhotoState, fromPhoto.getLoading);
export const getPhotoFailed  = createSelector(getPhotoState, fromPhoto.getFailed);
export const getPhoto        = createSelector(getPhotoState, fromPhoto.getPhoto);
export const getPhotos       = createSelector(getPhotoState, fromPhoto.getPhotos);



