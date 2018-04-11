export const SET_CHAT_CONVERSATIONS = '[CHAT] SET_CHAT_CONVERSATIONS';
export const ADD_CHAT_CONVERSATIONS = '[CHAT] ADD_CHAT_CONVERSATIONS';

declare let _: any;
const empty: any = function(): any {
  return {};
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    case SET_CHAT_CONVERSATIONS:
      stateClone = [...action.payload];
      return stateClone;
    case ADD_CHAT_CONVERSATIONS:
      stateClone = [...action.payload];
      return stateClone;
    default:
      return state;
  }
}
