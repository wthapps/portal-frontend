import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

// import { Message } from './message.model';
import { MessageState, FEATURE_NAME, messageAdapter } from './message.reducer';
import { Dictionary } from '@ngrx/entity';

export const getError = (state: MessageState): any => state.error;

// export const getLoading = (state: State): boolean => state.loading;
// export const getLoadingMore = (state: State): any => state.loadingMore;

// export const getItems = (state: State): Array<Conversation> => state.items;

export const getSelectedItem = (state: MessageState): any => state.selectedItem;


export const selectMessageState: MemoizedSelector<
  object,
  MessageState
  > = createFeatureSelector<MessageState>(FEATURE_NAME);

// Select from entity
export const selectMessageEntities: (
  state: object
) => Dictionary<any> = messageAdapter.getSelectors(selectMessageState).selectEntities;

export const selectAllMessages: (
  state: object
) => any[] = messageAdapter.getSelectors(selectMessageState).selectAll;

export const selectMessageIds: (
  state: object
) => any[] = messageAdapter.getSelectors(selectMessageState).selectIds;

export const selectMessageTotal: (
  state: object
) => number = messageAdapter.getSelectors(selectMessageState).selectTotal;


export const getLoading = createSelector(selectMessageState, (state: MessageState) => state.loading);
export const getLoadingMore = createSelector(selectMessageState, (state: MessageState) => state.loadingMore);
export const getCurrentCursor = createSelector(selectMessageState, (state: MessageState) => state.currentCursor);


export const getItems   = createSelector(selectMessageState, (state: MessageState) => state.messages);
export const getMessage   = createSelector(selectMessageState, (state: MessageState) => state.selectedItem);
export const getLinks   = createSelector(selectMessageState, (state: MessageState) => state.links);

export const selectById = (id: string) =>
  createSelector(this.selectAllItems, (allMyFeatures: any[]) => {
    if (allMyFeatures) {
      return allMyFeatures.find(p => p.id === id);
    } else {
      return null;
    }
  });

export const selectError: MemoizedSelector<object, any> = createSelector(
  selectMessageState,
  getError
);

export const selectLoading: MemoizedSelector<
  object,
  boolean
  > = createSelector(selectMessageState, getLoading);
