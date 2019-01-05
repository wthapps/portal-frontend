export const SET_SELECTED_CONVERSATION = '[CHAT] SET_SELECTED_CONVERSATION';

declare let _: any;
const empty: any = function(): any {
  return {
    isDifference: false,
    selectedConversation: {}
  };
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    case SET_SELECTED_CONVERSATION:
      if (stateClone.selectedConversation.group_id !== action.payload.group_id){
        stateClone.isDifference = true;
      } else {
        stateClone.isDifference = false;
      }
      stateClone.selectedConversation = action.payload;
      return stateClone;
    default:
      return state;
  }
}
