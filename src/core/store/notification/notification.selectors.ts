import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { NotificationState, notificationAdapter } from './notification.reducer';
import { Dictionary } from '@ngrx/entity';

export const FEATURE_NAME = 'notification';

export const getError = (state: NotificationState): any => state.error;

export const getIsLoading = (state: NotificationState): boolean => state.isLoading;
export const getIsLoadingMore = (state: NotificationState): boolean => state.isLoadingMore;
export const getIsNoData = (state: NotificationState): boolean => state.isNoData;

export const selectNotificationState: MemoizedSelector<
  object,
  NotificationState
  > = createFeatureSelector<NotificationState>(FEATURE_NAME);

// Select from entity
export const selectNotificationEntities: (
  state: object
) => Dictionary<any> = notificationAdapter.getSelectors(selectNotificationState).selectEntities;

export const selectAllNotifications: (
  state: object
) => any[] = notificationAdapter.getSelectors(selectNotificationState).selectAll;

export const selectNotificationIds: (
  state: object
) => any[] = notificationAdapter.getSelectors(selectNotificationState).selectIds;

export const selectNotificationTotal: (
  state: object
) => number = notificationAdapter.getSelectors(selectNotificationState).selectTotal;

export const getLinks   = createSelector(selectNotificationState, (state: NotificationState) => state.links);


export const selectNotificationById = (id: string) =>
  createSelector(this.selectAllItems, (allMyFeatures: any[]) => {
    if (allMyFeatures) {
      return allMyFeatures.find(p => p.id === id);
    } else {
      return null;
    }
  });

export const selectError: MemoizedSelector<object, any> = createSelector(
  selectNotificationState,
  getError
);

export const selectIsLoading: MemoizedSelector<
  object,
  boolean
  > = createSelector(selectNotificationState, getIsLoading);

export const selectIsLoadingMore: MemoizedSelector<
  object,
  boolean
  > = createSelector(selectNotificationState, getIsLoadingMore);

export const selectIsNoData: MemoizedSelector<
  object,
  boolean
  > = createSelector(selectNotificationState, getIsNoData);
