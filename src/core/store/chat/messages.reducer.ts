import { Messages } from "@shared/shared/models/chat/messages.model";

export const CHAT_MESSAGES_SET = 'CHAT_MESSAGES_SET';
export const CHAT_MESSAGES_CURRENT_SET = 'CHAT_MESSAGES_CURRENT_SET';
export const CHAT_MESSAGES_CURRENT_ADD = 'CHAT_MESSAGES_CURRENT_ADD';
export const CHAT_MESSAGES_CURRENT_MORE = 'CHAT_MESSAGES_CURRENT_MORE';
export const CHAT_MESSAGES_CURRENT_TIMEOUT = 'CHAT_MESSAGES_CURRENT_TIMEOUT';

declare let _: any;

const empty: any = function(): any {
  return {
    data: [],
    meta: {}
  };
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: Messages = _.clone(state);
  switch (action.type) {
    case CHAT_MESSAGES_SET:
      return stateClone;
    case CHAT_MESSAGES_CURRENT_SET:
      let messages = new Messages(action.payload);
      messages.addShowInfoAttribute();
      stateClone = messages;
      return stateClone;
    case CHAT_MESSAGES_CURRENT_MORE:
      stateClone.data = [...action.payload.data, ...stateClone.data];
      stateClone.meta = action.payload.meta;
      return stateClone;
    case CHAT_MESSAGES_CURRENT_TIMEOUT:
      stateClone.data = stateClone.data.map(d => {
        let item = {...d}
        if (item.status == 'pending') item.message = '<span class="message-error"><i class="fa fa-exclamation-triangle"></i> This message couldn\'t send. Please check your Internet connection.<span>';
        return item;
      })
      return stateClone;
    case CHAT_MESSAGES_CURRENT_ADD:
      // repalce action
      let isReplaced = false;
      stateClone.data = stateClone.data.map(message => {
        if (message.id == action.payload.data.id || (action.payload.data.client_id && message.client_id == action.payload.data.client_id)) {
          isReplaced = true;
          return action.payload.data;
        } else {
          return message;
        }
      })
      if (!isReplaced) stateClone.data = [...stateClone.data, action.payload.data];
      stateClone.addShowInfoAttribute();
      return stateClone;
    default:
      return state;
  }
}
