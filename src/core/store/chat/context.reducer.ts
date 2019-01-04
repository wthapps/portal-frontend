export const SET_LOADING = '[CHAT NOTE] SET_LOADING';
export const SET_CONTEXT = '[CHAT NOTE] SET_CONTEXT';
export const SET_SELECTED_CONVERSATION_CONTEXT = '[CHAT] SET_SELECTED_CONVERSATION_CONTEXT';

declare let _: any;
const empty: any = function(): any {
  return {
    // note list objects
    loading: false,
    selectedConversation: {},
    noData: false
  };
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    case SET_LOADING:
      stateClone.loading = action.payload;
      return stateClone;
    case SET_CONTEXT:
      stateClone.loading = action.payload.loading;
      stateClone.noData = action.payload.noData;
      return stateClone;
    case SET_SELECTED_CONVERSATION_CONTEXT:
      stateClone.selectedConversation = action.payload;
      return stateClone;
    default:
      return state;
  }
}
