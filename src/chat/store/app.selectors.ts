import { createSelector, MemoizedSelector } from '@ngrx/store';
import {
  ConversationSelectors
} from './conversation';


export const selectError: MemoizedSelector<
  object,
  string
  > = createSelector(
  ConversationSelectors.selectConversationError,
  (conversation: string) => {
    return conversation;
  }
  );

export const selectIsLoading: MemoizedSelector<
  object,
  boolean
  > = createSelector(
  ConversationSelectors.selectConversationIsLoading,
  (conversation: boolean) => {
    return conversation;
  }
);
