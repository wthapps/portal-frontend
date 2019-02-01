import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { Conversation } from './conversation.model';
import { conversationAdapter, ConversationState } from './conversation.state';

export const FEATURE_CONVERSATION = 'conversation';

export const getError = (state: ConversationState): any => state.error;

export const getIsLoading = (state: ConversationState): boolean => state.isLoading;

// export const getItems = (state: State): Array<Conversation> => state.items;

export const getSelectedItem = (state: ConversationState): Conversation => state.selectedItem;


export const selectConversationState: MemoizedSelector<
  object,
  ConversationState
  > = createFeatureSelector<ConversationState>(FEATURE_CONVERSATION);

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

export const selectConversationError: MemoizedSelector<object, any> = createSelector(
  selectConversationState,
  getError
);

export const selectConversationIsLoading: MemoizedSelector<
  object,
  boolean
  > = createSelector(selectConversationState, getIsLoading);
