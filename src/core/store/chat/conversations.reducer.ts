import { Conversations } from "@shared/shared/models/chat/conversations.list.model";

export const CHAT_CONVERSATIONS_SET = 'CHAT_CONVERSATIONS_SET';
export const CHAT_CONVERSATIONS_ADD = 'CHAT_CONVERSATIONS_ADD';
export const CHAT_CONVERSATIONS_ADD_NOTIFICATION = 'CHAT_CONVERSATIONS_ADD_NOTIFICATION';
export const CHAT_CONVERSATIONS_UPDATE = 'CHAT_CONVERSATIONS_UPDATE';

declare let _: any;
const empty: any = function (): any {
  return new Conversations();
};

export function reducer(state: Conversations = empty(), action: any) {
  let stateClone: Conversations = _.clone(state);
  switch (action.type) {
    case CHAT_CONVERSATIONS_SET:
      stateClone.data = [...action.payload.data];
      stateClone.meta = action.payload.meta;
      return stateClone;
    case CHAT_CONVERSATIONS_ADD_NOTIFICATION:
      stateClone.data = stateClone.data.map(c => {
        if(c.group_id == action.payload.group_id) {
          c.notification_count = action.payload.notification_count;
        }
        return c;
      });
      return stateClone;
    case CHAT_CONVERSATIONS_UPDATE:
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
