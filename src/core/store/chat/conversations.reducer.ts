import { Conversations } from "@shared/shared/models/chat/conversations.list.model";

export const SET_CHAT_CONVERSATIONS = '[CHAT] SET_CHAT_CONVERSATIONS';
export const ADD_CHAT_CONVERSATIONS = '[CHAT] ADD_CHAT_CONVERSATIONS';
export const ADD_CHAT_CONVERSATION_NOTIFICATION = '[CHAT] ADD_CHAT_CONVERSATION_NOTIFICATION';
export const UPDATE_CHAT_CONVERSATIONS = '[CHAT] UPDATE_CHAT_CONVERSATIONS';
export const SET_CHAT_SELECTED = '[CHAT] SET_CHAT_SELECTED';

declare let _: any;
const empty: any = function (): any {
  return new Conversations();
};

export function reducer(state: Conversations = empty(), action: any) {
  let stateClone: Conversations = _.clone(state);
  switch (action.type) {
    case SET_CHAT_CONVERSATIONS:
      stateClone.data = [...action.payload.data];
      stateClone.meta = action.payload.meta;
      return stateClone;
    case ADD_CHAT_CONVERSATION_NOTIFICATION:
      stateClone.data = stateClone.data.map(c => {
        if(c.group_id == action.payload.group_id) {
          c.notification_count = action.payload.count;
        }
        return c;
      });
      return stateClone;
    case UPDATE_CHAT_CONVERSATIONS:
      if (stateClone.data.find(c => c.group_id == action.payload.group_id)) {
        stateClone.data = stateClone.data.map(c => {
          if(c.group_id == action.payload.group_id) {
            c = action.payload;
          }
          return c;
        });
      } else {
        stateClone.data = [action.payload, ...stateClone.data]
      }
      return stateClone;
    default:
      return state;
  }
}
