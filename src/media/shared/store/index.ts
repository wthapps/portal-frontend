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

import * as fromPhoto from './photo';
import * as fromMedia from './media';
import * as fromObject from './object';

/**
 * We treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  media: fromMedia.State;
  photo: fromPhoto.State;
  object: fromObject.State;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export const mediaReducers: ActionReducerMap<State> = {
  media: fromMedia.reducer,
  photo: fromPhoto.reducer,
  object: fromObject.reducer
};

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 */

// /**
//  * Media store functions
//  */
export const selectMediaState = createFeatureSelector<fromMedia.State>('media');
export const selectObjects = createSelector(selectMediaState, fromMedia.getObjects);
export const selectObject = createSelector(selectMediaState, fromMedia.getObject);
export const selectDetailObjects = createSelector(selectMediaState, fromMedia.getDetailObjects);
export const selectDetailObject = createSelector(selectMediaState, fromMedia.getDetailObject);
export const selectLinks = createSelector(selectMediaState, fromMedia.getLinks);
export const selectNextLink = createSelector(selectMediaState, fromMedia.getNextLink);
export const selectLoading = createSelector(selectMediaState, fromMedia.getLoading);

/**
 * Photos store functions
 */
export const getPhotoState = createFeatureSelector<fromPhoto.State>('photo');

// export const getPhotoEntities    = createSelector(getPhotoState, fromPhoto.getPhotoEntities);
// export const getPhotoLoaded  = createSelector(getPhotoState, fromPhoto.getLoaded);
// export const getPhotoLoading = createSelector(getPhotoState, fromPhoto.getLoading);
// export const getPhotoFailed  = createSelector(getPhotoState, fromPhoto.getFailed);
// export const getPhoto        = createSelector(getPhotoState, fromPhoto.getPhoto);
export const getPhotos = createSelector(getPhotoState, fromPhoto.selectAll);

// Object store functions
export const getObjectState = createFeatureSelector<fromObject.State>('object');
export const getObjects = createSelector(getObjectState, fromObject.selectAll);
export const getObject = createSelector(getObjectState, fromObject.getObject);

export const getSelectedObjects = createSelector(getObjectState, fromObject.getSelectedObjects);



export const appStore = {
  media: fromMedia.reducer,
  photo: fromPhoto.reducer,
  object: fromObject.reducer
};

export let appEffects: Array<any> = [
  fromPhoto.PhotoEffects,
  fromObject.ObjectEffects
];
