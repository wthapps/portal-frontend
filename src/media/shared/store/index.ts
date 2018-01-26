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
import { PhotoEffects } from './effects/photo.effect';

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

export const getPhotoEntities    = createSelector(getPhotoState, fromPhoto.getPhotoEntities);
export const getPhotoLoaded  = createSelector(getPhotoState, fromPhoto.getLoaded);
export const getPhotoLoading = createSelector(getPhotoState, fromPhoto.getLoading);
export const getPhotoFailed  = createSelector(getPhotoState, fromPhoto.getFailed);
export const getPhoto        = createSelector(getPhotoState, fromPhoto.getPhoto);
export const getPhotos       = createSelector(getPhotoState, fromPhoto.selectAll);


// export const getPhotoLoaded  = createSelector(getPhotoEntities, fromPhoto.getLoaded, state => state);
// export const getPhotoLoading = createSelector(getPhotoEntities, fromPhoto.getLoading, state => state);
// export const getPhotoFailed  = createSelector(getPhotoEntities, fromPhoto.getFailed, state => state);
// export const getPhoto        = createSelector(getPhotoEntities, fromPhoto.getPhoto, state => state);
// export const getPhotos       = createSelector(getPhotoEntities, fromPhoto.getPhotos, state => state);


export const appStore = {
  photo: fromPhoto.reducer
};

export let appEffects: Array<any> = [PhotoEffects];
