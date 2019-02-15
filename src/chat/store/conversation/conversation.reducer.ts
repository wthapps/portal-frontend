import { Actions, ActionTypes } from './conversation.actions';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Conversation } from './conversation.model';

export function sortByName(a: Conversation, b: Conversation): number {
  return a.name.localeCompare(b.name);
}

export const conversationAdapter: EntityAdapter<Conversation> = createEntityAdapter<Conversation>({
  selectId: model => model.id,
  sortComparer: sortByName,
});

export interface ConversationState extends EntityState<Conversation> {
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  conversations: Array<Conversation> | [];
  isLoading?: boolean;
  error?: any;
}

export const initialConversationState: ConversationState = conversationAdapter.getInitialState(
  {
    selectedConversationId: null,
    selectedConversation: null,
    conversations: [],
    isLoading: false,
    error: null
  }
);

export function reducer(state = initialConversationState, action: Actions): ConversationState {
  switch (action.type) {
    case ActionTypes.GET_ALL: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.GET_ALL_SUCCESS: {
      return conversationAdapter.addAll(action.payload.conversations, {
        ...state,
        isLoading: false,
        error: null
      });
    }
    case ActionTypes.GET_ALL_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.GET_ITEM: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }

    case ActionTypes.GET_ITEM_SUCCESS: {
      const item = action.payload.data.attributes;

      return {
        ...state,
        selectedConversation: item,
        isLoading: false,
        error: null
      };
    }

    case ActionTypes.GET_ITEM_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.SET_SELECTED_ITEM: {
      return {
        ...state,
        selectedConversation: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// export const getSelectedConversationId = (state: ConversationState) => state.selectedConversationId;
//
// // get the selectors
// const {
//   selectIds,
//   selectEntities,
//   selectAll,
//   selectTotal,
// } = conversationAdapter.getSelectors();
//
// // select the array of conversation ids
// export const selectConversationIds = selectIds;
//
// // select the dictionary of conversation entities
// export const selectConversationEntities = selectEntities;
//
// // select the array of conversations
// export const selectAllConversations = selectAll;
//
// // select the total conversation count
// export const selectConversationTotal = selectTotal;
