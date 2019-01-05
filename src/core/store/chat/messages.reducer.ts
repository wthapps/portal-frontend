export const SET_CHAT_MESSAGES = '[CHAT] SET_CHAT_MESSAGES';
export const SET_CHAT_CURRENT_MESSAGES = '[CHAT] SET_CHAT_CURRENT_MESSAGES';
export const ADD_CHAT_CURRENT_MESSAGES = '[CHAT] ADD_CHAT_CURRENT_MESSAGES';
export const MORE_CHAT_CURRENT_MESSAGES = '[CHAT] MORE_CHAT_CURRENT_MESSAGES';
export const ADD_CHAT_MESSAGES = '[CHAT] ADD_CHAT_MESSAGES';

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
    case SET_CHAT_MESSAGES:
      return stateClone;
    case SET_CHAT_CURRENT_MESSAGES:
      stateClone.data = [...action.payload.data];
      stateClone.meta = action.payload.meta;
      return stateClone;
    case MORE_CHAT_CURRENT_MESSAGES:
      stateClone.data = [...action.payload.data, ...stateClone.data];
      stateClone.meta = action.payload.meta;
      return stateClone;
    case ADD_CHAT_CURRENT_MESSAGES:
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
    case ADD_CHAT_MESSAGES:
      stateClone = [...action.payload];
      return stateClone;
    default:
      return state;
  }
}
