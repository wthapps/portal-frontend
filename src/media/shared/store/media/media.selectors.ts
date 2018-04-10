import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMedia       from './media.reducers';

export const selectMediaState   = createFeatureSelector<fromMedia.State>('media');
export const selectObjects = createSelector(selectMediaState, fromMedia.getObjects);
export const selectObject = createSelector(selectMediaState, fromMedia.getObject);
export const selectDetailObjects = createSelector(selectMediaState, fromMedia.getDetailObjects);
export const selectDetailObject = createSelector(selectMediaState, fromMedia.getDetailObject);
export const selectNextLink = createSelector(selectMediaState, fromMedia.getNextLink);
export const selectLoading = createSelector(selectMediaState, fromMedia.getLoading);
