import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { Conversation } from './conversation.model';
import { ConversationState, conversationAdapter } from './conversation.reducer';
import { Dictionary } from '@ngrx/entity';

export const FEATURE_NAME = 'conversation';

export const getError = (state: ConversationState): any => state.error;

export const getIsLoading = (state: ConversationState): boolean => state.isLoading;

// export const getItems = (state: State): Array<Conversation> => state.items;

// export const getSelectedItem = (state: ConversationState): Conversation => state.selectedConversation;


export const selectConversationState: MemoizedSelector<
  object,
  ConversationState
  > = createFeatureSelector<ConversationState>(FEATURE_NAME);

// Select from entity
export const selectConversationEntities: (
  state: object
) => Dictionary<Conversation> = conversationAdapter.getSelectors(selectConversationState).selectEntities;

export const selectAllConversations: (
  state: object
) => Conversation[] = conversationAdapter.getSelectors(selectConversationState).selectAll;

export const selectConversationIds: (
  state: object
) => any[] = conversationAdapter.getSelectors(selectConversationState).selectIds;

export const selectConversationTotal: (
  state: object
) => number = conversationAdapter.getSelectors(selectConversationState).selectTotal;

// custom selector
export const selectSearchedConversations  =
  createSelector(selectConversationState, (state: ConversationState) => state.searchedConversations);

// export const selectSelectedConversation   =
//   createSelector(selectConversationState, (state: ConversationState) => state.selectedConversation);
// export const selectSelectedConversationId   =
//   createSelector(selectConversationState, (state: ConversationState) => state.selectedConversationId);

export const selectJoinedConversation   =
  createSelector(selectConversationState, (state: ConversationState) => state.joinedConversation);

export const selectJoinedConversationId   =
  createSelector(selectConversationState, (state: ConversationState) => state.joinedConversationId);

export const getLinks   = createSelector(selectConversationState, (state: ConversationState) => state.links);


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
