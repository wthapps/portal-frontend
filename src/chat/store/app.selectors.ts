import { createSelector, MemoizedSelector } from '@ngrx/store';
import {
  ConversationSelectors
} from './conversation';
import { MessageSelectors } from '@chat/store/message';


export const selectError: MemoizedSelector<
  object,
  string
  > = createSelector(
  ConversationSelectors.selectError,
  MessageSelectors.selectError,
  (conversationError: string, messageError: string) => {
    return conversationError || messageError;
  }
);

export const selectIsLoading: MemoizedSelector<
  object,
  boolean
  > = createSelector(
  ConversationSelectors.selectIsLoading,
  MessageSelectors.selectLoading,
  (conversationIsLoading: boolean, messageLoading: boolean) => {
    return conversationIsLoading || messageLoading;
  }
);
