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
  joinedConversationId: string | null;
  joinedConversation: Conversation | null;
  searchedConversations: Conversation[] | [];
  doing?: boolean;
  done?: boolean;
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
  searchedLinks: {
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
    joinedConversationId: null,
    joinedConversation: null,
    searchedConversations: [],
    doing: false,
    done: false,
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
    searchedLinks: {
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
    case ActionTypes.GET_ITEMS: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.GET_ITEMS_SUCCESS: {
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
    case ActionTypes.GET_ITEMS_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.SEARCH: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.SEARCH_SUCCESS: {
      console.log('SEARCH RESULT:::', action.payload.conversations);
      return {
        ...state,
        searchedConversations: [
          ...state.searchedConversations,
          ...action.payload.conversations
        ],
        isLoading: false,
        error: null,
        links: action.payload.links,
      };
    }
    case ActionTypes.SEARCH_ERROR: {
      return {
        ...state,
        isLoadingMore: false,
        error: action.payload.error
      };
    }

    case ActionTypes.CLEAR_SEARCH: {
      return {
        ...state,
        searchedConversations: [],
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
        selectedConversationId: item.id,
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

    // Create actions
    // Update Self actions
    case ActionTypes.CREATE: {
      return {
        ...state,
        doing: true,
        done: false,
        error: null
      };
    }

    case ActionTypes.CREATE_SUCCESS: {
      const conversation = action.payload.conversation;
      console.log('dispatch created conversation:::', conversation);
      return conversationAdapter.addOne(
        conversation, {
        ...state,
        doing: false,
        done: true,
        error: null,
      });
    }

    case ActionTypes.CREATE_ERROR: {
      return {
        ...state,
        doing: false,
        done: true,
        error: action.payload.error
      };
    }


    // Update Self actions
    case ActionTypes.UPDATE_SELF: {
      return {
        ...state,
        error: null
      };
    }

    case ActionTypes.UPDATE_SELF_SUCCESS: {
      const conversation = action.payload.conversation;

      return conversationAdapter.updateOne({
        id: conversation.id,
        changes: {
          favorite: conversation.favorite,
          notification: conversation.notification,
        }
      }, {
        ...state,
        selectedConversation: {
          ...state.selectedConversation,
          ...conversation
        }
      });
    }

    case ActionTypes.UPDATE_SELF_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    // Select action
    case ActionTypes.SELECT_ITEM: {
      return {
        ...state,
        // selectedConversation: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

