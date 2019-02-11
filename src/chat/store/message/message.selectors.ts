import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

// import { Message } from './message.model';
import { MessageState, FEATURE_NAME } from './message.reducer';

export const getError = (state: MessageState): any => state.error;

// export const getLoading = (state: State): boolean => state.loading;
// export const getLoadingMore = (state: State): any => state.loadingMore;

// export const getItems = (state: State): Array<Conversation> => state.items;

export const getSelectedItem = (state: MessageState): any => state.selectedItem;


export const selectMessageState: MemoizedSelector<
  object,
  MessageState
  > = createFeatureSelector<MessageState>(FEATURE_NAME);

// export const selectAllItems: (
//   state: object
// ) => Conversation[] = conversationAdapter.getSelectors(selectConversationState).selectAll;
//
// export const selectItems: (
//   state: object
// ) => Conversation[] = conversationAdapter.getSelectors(selectConversationState).selectEntities;
export const getLoading = createSelector(selectMessageState, (state: MessageState) => state.loading);
export const getLoadingMore = createSelector(selectMessageState, (state: MessageState) => state.loadingMore);

export const getItems   = createSelector(selectMessageState, (state: MessageState) => state.items);
export const getItem   = createSelector(selectMessageState, (state: MessageState) => state.selectedItem);
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
