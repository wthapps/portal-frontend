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
  isLoadingMore?: boolean;
  error?: any;
  links: {
    self: string | null,
    prev: string | null,
    next: string | null,
    fist: string | null,
    last: string | null,
  };
}

export const initialConversationState: ConversationState = conversationAdapter.getInitialState(
  {
    selectedConversationId: null,
    selectedConversation: null,
    conversations: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    links: {
      self: null,
      prev: null,
      next: null,
      fist: null,
      last: null,
    },
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
      console.log('LINKS IN EFFECTS', action.payload.links);

      return conversationAdapter.addAll([
        ...Object.values(state.entities),
        ...action.payload.conversations
      ], {
        ...state,
        isLoading: false,
        error: null,
        links: {...action.payload.links},
      });
    }
    case ActionTypes.GET_ALL_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.GET_MORE: {
      return {
        ...state,
        isLoadingMore: true,
        error: null
      };
    }
    case ActionTypes.GET_MORE_SUCCESS: {
      return conversationAdapter.addAll([
        ...Object.values(state.entities),
        ...action.payload.conversations
      ], {
        ...state,
        isLoadingMore: false,
        error: null,
        links: action.payload.links,
      });
    }
    case ActionTypes.GET_MORE_ERROR: {
      return {
        ...state,
        isLoadingMore: false,
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
