export const SET_OBJECTS = '[CHAT NOTE] SET_OBJECTS';

declare let _: any;
const empty: any = function(): any {
  return {
    objects: [],
    selectedObjects: []
  };
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    case SET_OBJECTS:
      stateClone.objects = action.payload;
      return stateClone;
    default:
      return state;
  }
}
