import { Actions, ActionTypes } from './conversation.actions';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Conversation } from './conversation.model';

export const conversationAdapter: EntityAdapter<Conversation> = createEntityAdapter<Conversation>({
  selectId: model => model.id
});

export interface ConversationState extends EntityState<Conversation> {
  selectedItem: Conversation | null;
  items: Array<Conversation> | [];
  isLoading?: boolean;
  error?: any;
}

export const inititalConversationState: ConversationState = conversationAdapter.getInitialState(
  {
    selectedItem: null,
    items: [],
    isLoading: false,
    error: null
  }
);

export function reducer(state = inititalConversationState, action: Actions): ConversationState {
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
        selectedItem: item,
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
        selectedItem: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
