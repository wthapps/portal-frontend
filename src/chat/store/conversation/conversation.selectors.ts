import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { Conversation } from './conversation.model';
import { ConversationState } from './conversation.reducer';

export const FEATURE_NAME = 'conversation';

export const getError = (state: ConversationState): any => state.error;

export const getIsLoading = (state: ConversationState): boolean => state.isLoading;

// export const getItems = (state: State): Array<Conversation> => state.items;

export const getSelectedItem = (state: ConversationState): Conversation => state.selectedItem;


export const selectConversationState: MemoizedSelector<
  object,
  ConversationState
  > = createFeatureSelector<ConversationState>(FEATURE_NAME);

// export const selectAllItems: (
//   state: object
// ) => Conversation[] = conversationAdapter.getSelectors(selectConversationState).selectAll;
//
// export const selectItems: (
//   state: object
// ) => Conversation[] = conversationAdapter.getSelectors(selectConversationState).selectEntities;

export const getItems   = createSelector(selectConversationState, (state: ConversationState) => state.items);
export const getItem   = createSelector(selectConversationState, (state: ConversationState) => state.selectedItem);


export const selectConversationById = (id: string) =>
  createSelector(this.selectAllItems, (allMyFeatures: Conversation[]) => {
    if (allMyFeatures) {
      return allMyFeatures.find(p => p.id === id);
    } else {
      return null;
    }
  });

export const selectError: MemoizedSelector<object, any> = createSelector(
  selectConversationState,
  getError
);

export const selectIsLoading: MemoizedSelector<
  object,
  boolean
  > = createSelector(selectConversationState, getIsLoading);
