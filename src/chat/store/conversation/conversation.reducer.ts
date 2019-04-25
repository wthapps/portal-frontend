import { Actions, ActionTypes } from './conversation.actions';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Conversation } from './conversation.model';

export function sortByName(a: Conversation, b: Conversation): number {
  return a.name.localeCompare(b.name);
}

export function sortByDate(c1: Conversation, c2: Conversation): number {
  return c2.updated_chat_at.localeCompare(c1.updated_chat_at);
}

export const conversationAdapter: EntityAdapter<Conversation> = createEntityAdapter<Conversation>({
  selectId: model => model.id,
  sortComparer: sortByDate,
});

export interface ConversationState extends EntityState<Conversation> {
  joinedConversationId: string | null; // set joined Id for redirecting to conversation detail
  joinedConversation: Conversation | null;
  searchedConversations: Conversation[] | [];
  doing?: boolean;
  done?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  loaded?: boolean;
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
    joinedConversationId: null,
    joinedConversation: null,
    searchedConversations: [],
    doing: false,
    done: false,
    isLoading: false,
    isLoadingMore: false,
    loaded: false,
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
        loaded: false,
        error: null
      };
    }
    case ActionTypes.GET_ITEMS_SUCCESS: {
      return conversationAdapter.addAll([
        ...action.payload.conversations
      ], {
        ...state,
        isLoading: false,
        loaded: true,
        error: null,
        links: action.payload.links,
      });
    }
    case ActionTypes.GET_ITEMS_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    // Get more items
    case ActionTypes.GET_MORE_ITEMS: {
      return {
        ...state,
        isLoadingMore: true,
        error: null
      };
    }
    case ActionTypes.GET_MORE_ITEMS_SUCCESS: {
      return conversationAdapter.addMany([
        ...Object.values(state.entities),
        ...action.payload.conversations
      ], {
        ...state,
        isLoadingMore: false,
        error: null,
        links: action.payload.links,
      });
    }
    case ActionTypes.GET_MORE_ITEMS_ERROR: {
      return {
        ...state,
        isLoadingMore: false,
        error: action.payload.error
      };
    }
    case ActionTypes.SEARCH: {
      return {
        ...state,
        isLoading: true,
        loaded: false,
        error: null
      };
    }
    case ActionTypes.SEARCH_SUCCESS: {
      return {
        ...state,
        searchedConversations: action.payload.conversations,
        isLoading: false,
        loaded: true,
        error: null,
        searchedLinks: action.payload.links,
      };
    }
    case ActionTypes.SEARCH_ERROR: {
      return {
        ...state,
        isLoading: false,
        loaded: true,
        error: action.payload.error
      };
    }

    case ActionTypes.SEARCH_MORE: {
      return {
        ...state,
        isLoadingMore: true,
        loaded: false,
        error: null
      };
    }
    case ActionTypes.SEARCH_MORE_SUCCESS: {
      return {
        ...state,
        searchedConversations: [
          ...state.searchedConversations,
          ...action.payload.conversations
        ],
        isLoadingMore: false,
        error: null,
        searchedLinks: action.payload.links,
      };
    }
    case ActionTypes.SEARCH_MORE_ERROR: {
      return {
        ...state,
        isLoadingMore: false,
        loaded: true,
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
        error: null
      };
    }

    case ActionTypes.GET_ITEM_SUCCESS: {
      const conversation = action.payload.data.attributes;
      return {
        ...state,
        joinedConversation: conversation,
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
      return conversationAdapter.upsertOne(
        conversation, {
        ...state,
        joinedConversationId: conversation.uuid,
        joinedConversation: conversation,
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

    // Update actions
    case ActionTypes.UPDATE: {
      return {
        ...state,
        error: null
      };
    }

    case ActionTypes.UPDATE_SUCCESS: {
      const conversation = action.payload.conversation;
      if (state.joinedConversationId === conversation.uuid) {
        return conversationAdapter.updateOne({
          id: conversation.id,
          changes: conversation
        }, {
          ...state,
          joinedConversation: {
            ...state.joinedConversation,
            ...conversation
          }
        });
      } else {
        return conversationAdapter.updateOne({
          id: conversation.id,
          changes: conversation
        }, state);
      }
    }

    case ActionTypes.UPDATE_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    // Update Display actions
    case ActionTypes.UPSERT: {
      return {
        ...state,
        error: null
      };
    }

    case ActionTypes.UPSERT_SUCCESS: {
      const conversation = action.payload.conversation;

      if (state.joinedConversationId && state.joinedConversationId === conversation.uuid) {
        return conversationAdapter.upsertOne(conversation, {
          ...state,
          joinedConversationId: conversation.uuid,
          joinedConversation: conversation,
          isLoading: false,
          error: null,
        });
      } else {
        return conversationAdapter.upsertOne(conversation, {
          ...state,
          isLoading: false,
          error: null,
        });
      }
    }

    case ActionTypes.UPSERT_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    // Update Display actions
    case ActionTypes.UPDATE_DISPLAY: {
      return {
        ...state,
        isLoading: false,
        error: null
      };
    }

    case ActionTypes.UPDATE_DISPLAY_SUCCESS: {
      const conversation = action.payload.conversation;
      const joinedConversation = state.joinedConversationId === conversation.uuid ? conversation : state.joinedConversation;
      console.log('update display:::', conversation, state.joinedConversationId, state.joinedConversation);

      return conversationAdapter.updateOne({
        id: conversation.id,
        changes: conversation
      }, {
        ...state,
        joinedConversation: joinedConversation,
        isLoading: false,
      });
    }

    case ActionTypes.UPDATE_DISPLAY_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.ACCEPT_INVITATION_SUCCESS: {
      const conversation = action.payload.conversation;

      // update conversation list
      return conversationAdapter.updateOne({
        id: conversation.id,
        changes: conversation
      }, {
        ...state,
        isLoading: false,
      });
    }

    // Delete actions
    case ActionTypes.LEAVE: {
      return {
        ...state,
        error: null
      };
    }

    // Delete actions
    case ActionTypes.DELETE: {
      return {
        ...state,
        isLoading: false,
        error: null
      };
    }

    case ActionTypes.DELETE_SUCCESS: {
      const conversation = action.payload.conversation;
      console.log('delete display:::', conversation, state.joinedConversationId, state.joinedConversation);

      return conversationAdapter.removeOne(conversation.id, {
        ...state,
        joinedConversation: null,
        joinedConversationId: null,
      });
    }

    case ActionTypes.DELETE_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.SET_STATE: {
      return {
        ...state,
        ...action.payload
      };
    }

    // Select action
    case ActionTypes.SELECT_ITEM: {
      return {
        ...state,
        // selectedConversation: action.payload
      };
    }

    // Mark all as read action
    case ActionTypes.MARK_AS_READ_SUCCESS: {
      const update = {
        id: action.payload.conversation.id,
        changes: {
          notification_count: 0
        }
      };
      return conversationAdapter.updateOne(update, state);
    }

    // Mark all as read action
    case ActionTypes.MARK_ALL_AS_READ_SUCCESS: {
      const updates = (<number[]>state.ids).map(id => {
        return {
          id: id,
          changes: {
            notification_count: 0
          }
        };
      });
      return conversationAdapter.updateMany(updates, state);
    }


    default: {
      return state;
    }
  }
}

