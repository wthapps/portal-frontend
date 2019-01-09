export const CHAT_SELECTED_CONVERSATION_SET = 'CHAT_SELECTED_CONVERSATION_SET';

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
    case CHAT_SELECTED_CONVERSATION_SET:
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
