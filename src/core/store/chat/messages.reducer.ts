import { Messages } from "@shared/shared/models/chat/messages.model";

export const CHAT_MESSAGES_SET = 'CHAT_MESSAGES_SET';
export const CHAT_MESSAGES_CURRENT_SET = 'CHAT_MESSAGES_CURRENT_SET';
export const CHAT_MESSAGES_CURRENT_ADD = 'CHAT_MESSAGES_CURRENT_ADD';
export const CHAT_MESSAGES_CURRENT_MORE = 'CHAT_MESSAGES_CURRENT_MORE';

declare let _: any;

const empty: any = function(): any {
  return {
    data: [],
    meta: {}
  };
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    case CHAT_MESSAGES_SET:
      return stateClone;
    case CHAT_MESSAGES_CURRENT_SET:
      let messages = new Messages(action.payload);
      messages.addShowInfoAttribute();
      // stateClone.data = action.payload.data;
      // stateClone.meta = action.payload.meta;
      return messages;
    case CHAT_MESSAGES_CURRENT_MORE:
      stateClone.data = [...action.payload.data, ...stateClone.data];
      stateClone.meta = action.payload.meta;
      return stateClone;
    case CHAT_MESSAGES_CURRENT_ADD:
      // repalce action
      let isReplaced = false;
      stateClone.data = stateClone.data.map(message => {
        if (message.id == action.payload.data.id) {
          isReplaced = true;
          return action.payload.data;
        } else {
          return message;
        }
      })
      if (!isReplaced) stateClone.data = [...stateClone.data, action.payload.data];
      return stateClone;
    default:
      return state;
  }
}
