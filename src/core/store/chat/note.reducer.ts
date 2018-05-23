export const SET_OBJECTS = '[CHAT NOTE] SET_OBJECTS';
export const SELECT_MULTIPLE = '[CHAT NOTE] SELECT_MULTIPLE';
export const SELECT_ALL = '[CHAT NOTE] SELECT_ALL';
export const SELECT_ONE = '[CHAT NOTE] SELECT_ONE';
export const SET_CURRENT_TAB = '[CHAT NOTE] SET_CURRENT_TAB';
export const SET_BREADCRUMB = '[CHAT NOTE] SET_BREADCRUMB';

declare let _: any;
const empty: any = function(): any {
  return {
    // note list objects
    objects: [],
    breadcrumb: []
  };
};

export function reducer(state: any = empty(), action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    // After we load objects from API we set it into store
    case SET_OBJECTS:
      stateClone.objects = action.payload;
      return stateClone;
    // Select multiple is we select all object we click
    case SELECT_MULTIPLE:
      stateClone.objects = stateClone.objects.map(item => {
        if (item.id == action.payload.id) item.selected = !item.selected;
        return item;
      });
      return stateClone;
    // Select All objects
    case SELECT_ALL:
      stateClone.objects = stateClone.objects.map(item => {
        item.selected = action.payload;
        return item;
      });
      return stateClone;
    // Select One
    case SELECT_ONE:
      stateClone.objects = stateClone.objects.map(item => {
        item.selected = false;
        if (item.id == action.payload.id) item.selected = !item.selected;
        return item;
      });
      return stateClone;
    // Set Breadcrumb
    case SET_BREADCRUMB:
      stateClone.breadcrumb = action.payload;
      return stateClone;
    default:
      return state;
  }
}
