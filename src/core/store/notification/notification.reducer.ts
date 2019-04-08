import { Actions, ActionTypes } from './notification.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
export function sortByDate(n1: any, n2: any): number {
  return n2.updated_chat_at.localeCompare(n1.updated_chat_at);
}

export const notificationAdapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: model => model.id,
  sortComparer: sortByDate,
});

export interface NotificationState extends EntityState<any> {
  doing?: boolean;
  done?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isNoData?: boolean;
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

export const initialNotificationState: NotificationState = notificationAdapter.getInitialState(
  {
    doing: false,
    done: false,
    isLoading: false,
    isLoadingMore: false,
    isNoData: false,
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

export function reducer(state = initialNotificationState, action: Actions): NotificationState {
  switch (action.type) {
    case ActionTypes.LOAD_ITEMS: {
      return {
        ...state,
        isLoading: true,
        isNoData: false,
        error: null
      };
    }
    case ActionTypes.LOAD_ITEMS_SUCCESS: {
      const links = action.payload.links;
      // if it is first load
      if (!links.prev) {
        return notificationAdapter.addAll([
          ...action.payload.conversations
        ], {
          ...state,
          isLoading: false,
          isNoData: action.payload.conversations.length === 0,
          error: null,
          links: {...action.payload.links},
        });
      } else {
        return notificationAdapter.addMany([
          ...Object.values(state.entities),
          ...action.payload.conversations
        ], {
          ...state,
          isLoading: false,
          error: null,
          links: {...action.payload.links},
        });
      }
    }
    case ActionTypes.LOAD_ITEMS_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.LOAD_MORE_ITEMS: {
      return {
        ...state,
        isLoadingMore: true,
        error: null
      };
    }
    case ActionTypes.LOAD_MORE_ITEMS_SUCCESS: {
      return notificationAdapter.addMany([
          ...Object.values(state.entities),
          ...action.payload.conversations
        ], {
          ...state,
          isLoadingMore: false,
          error: null,
          links: {...action.payload.links},
        });

    }
    case ActionTypes.LOAD_ITEMS_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    // Load more items actions

    // Update actions
    case ActionTypes.UPDATE: {
      return {
        ...state,
        error: null
      };
    }

    case ActionTypes.UPDATE_SUCCESS: {
      const conversation = action.payload.conversation;

      return notificationAdapter.updateOne({
        id: conversation.id,
        changes: conversation
      }, state);
    }

    case ActionTypes.UPDATE_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }

    case ActionTypes.ACCEPT_INVITATION_SUCCESS: {
      const conversation = action.payload.conversation;

      // update conversation list
      return notificationAdapter.updateOne({
        id: conversation.id,
        changes: conversation
      }, {
        ...state,
        isLoading: false,
      });
    }

    case ActionTypes.SET_STATE: {
      return {
        ...state,
        ...action.payload
      };
    }

    // Mark as read action
    case ActionTypes.MARK_AS_READ_SUCCESS: {
      const update = {
        id: action.payload.conversation.id,
        changes: {
          ...action.payload.conversation
        }
      };
      return notificationAdapter.updateOne(update, state);
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
      return notificationAdapter.updateMany(updates, state);
    }


    default: {
      return state;
    }
  }
}

