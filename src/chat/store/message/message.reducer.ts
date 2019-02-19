import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Actions, ActionTypes } from './message.actions';

export const FEATURE_NAME = 'message';

export function sortByCursor(a: any, b: any): number {
  return a.cursor.localeCompare(b.cursor);
}

export const messageAdapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: model => model.id,
  // sortComparer: sortByCursor,
});

export interface MessageState extends EntityState<any> {
  selectedItem: any | null;
  messages: any[] | [];
  loading?: boolean;
  loadingMore?: boolean;
  sending?: boolean;
  error?: any;
  cursor: number;
  currentCursor: number;
  links: {
    self: string | null,
    prev: string | null,
    next: string | null,
    fist: string | null,
    last: string | null,
  };
}

export const initialMessageState: MessageState = messageAdapter.getInitialState({
  selectedItem: null,
  messages: [],
  loading: false,
  loadingMore: false,
  sending: false,
  error: null,
  cursor: 0,
  currentCursor: 0,
  links: {
    self: null,
    prev: null,
    next: null,
    fist: null,
    last: null,
  },
});

export function reducer(state = initialMessageState, action: Actions): MessageState {
  switch (action.type) {

    // Get all actions
    case ActionTypes.GET_ALL: {
      console.log('GET ALL cursor value:::', state.cursor);

      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case ActionTypes.GET_ALL_SUCCESS: {
      // const messages = [];
      // action.payload.data.forEach(message => {
      //   messages.push(message.attributes);
      // });
      const links = Object.assign({}, {...state.links}, action.payload.links);

      // return {
      //   ...state,
      //   messages: [
      //     ...messages.reverse(),
      //     ...state.messages
      //   ],
      //   cursor: messages[messages.length - 1].cursor,
      //   loading: false,
      //   error: null,
      //   links: links
      // };
      return messageAdapter.addAll(action.payload.messages.reverse(), {
        ...state,
        cursor: action.payload.messages[action.payload.messages.length - 1].cursor,
        loading: false,
        error: null,
        links: links
      });
    }
    case ActionTypes.GET_ALL_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    }

    // Get more actions
    case ActionTypes.GET_MORE: {
      return {
        ...state,
        loadingMore: true,
        error: null
      };
    }
    case ActionTypes.GET_MORE_SUCCESS: {
      const currentCursor = action.payload.messages[action.payload.messages.length - 1].cursor;

      return messageAdapter.addAll([
        ...action.payload.messages.reverse(),
        ...Object.values(state.entities)
      ], {
        ...state,
        currentCursor: currentCursor,
        loadingMore: false,
        error: null,
      });
    }
    case ActionTypes.GET_MORE_ERROR: {
      return {
        ...state,
        loadingMore: false,
        error: action.payload.error
      };
    }

    // Get item actions
    case ActionTypes.GET_ITEM: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case ActionTypes.GET_ITEM_SUCCESS: {
      const item = action.payload.data.attributes;

      return {
        ...state,
        selectedItem: item,
        loading: false,
        error: null,
      };
    }

    case ActionTypes.GET_ITEM_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }

    // Select actions
    case ActionTypes.SELECT_ITEM: {
      return {
        ...state,
        selectedItem: action.payload
      };
    }

    // Create actions
    case ActionTypes.CREATE: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case ActionTypes.CREATE_SUCCESS: {
      return messageAdapter.addOne(action.payload.message, {
        ...state,
        loading: false,
        error: null,
      });
      // return {
      //   ...state,
      //   messages: [
      //     ...state.messages,
      //     message
      //   ],
      //   loading: false,
      //   error: null,
      // };
    }

    case ActionTypes.CREATE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }

    default: {
      return state;
    }
  }
}

