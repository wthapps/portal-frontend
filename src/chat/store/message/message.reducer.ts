import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Actions, ActionTypes } from './message.actions';

export const FEATURE_NAME = 'message';

export const messageAdapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: model => model.id
});

export interface MessageState extends EntityState<any> {
  selectedItem: any | null;
  items: any[] | [];
  loading?: boolean;
  loadingMore?: boolean;
  error?: any;
  cursor: number;
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
  items: [],
  loading: false,
  loadingMore: false,
  error: null,
  cursor: 0,
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
      const items = [...state.items];
      action.payload.data.forEach(item => {
        items.push(item.attributes);
      });
      const links = Object.assign({}, {...state.links}, action.payload.links);

      console.log('Message links:::', links, items[items.length - 1].cursor,
    );

      return {
        ...state,
        items: items,
        cursor: items[items.length - 1].cursor,
        loading: false,
        error: null,
        links: links
      };
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
      console.log('GET MORE cursor value:::', state.cursor);
      return {
        ...state,
        loadingMore: true,
        error: null
      };
    }
    case ActionTypes.GET_MORE_SUCCESS: {
      const items = [...state.items];
      action.payload.data.forEach(item => {
        items.push(item.attributes);
      });
      const links = Object.assign({}, {...state.links}, action.payload.links);

      return {
        ...state,
        items: items,
        cursor: items[items.length - 1].cursor,
        loadingMore: false,
        error: null,
        links: links
      };
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

    case ActionTypes.SELECT_ITEM: {
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

