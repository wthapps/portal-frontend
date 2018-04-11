export const SET_CHAT_CONVERSATIONS_USERS =
  '[CHAT] SET_CHAT_CONVERSATIONS_USERS';

declare let _: any;
const empty: any = function(): any {
  return {};
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    case SET_CHAT_CONVERSATIONS_USERS:
      stateClone = [...action.payload];
      return stateClone;
    default:
      return state;
  }
}
