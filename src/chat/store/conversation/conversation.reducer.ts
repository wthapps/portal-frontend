import { Actions, ActionTypes } from './conversation.actions';
import { ConversationState, INITIAL_CONVERSATION_STATE } from './conversation.state';

export function conversationReducer(state = INITIAL_CONVERSATION_STATE, action: Actions): ConversationState {
  switch (action.type) {
    case ActionTypes.GET_ALL: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.GET_ALL_SUCCESS: {
      const items = [];
      action.payload.data.forEach(item => {
        items.push(item.attributes);
      });
      return {
        ...state,
        items: items,
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.GET_ALL_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
}
