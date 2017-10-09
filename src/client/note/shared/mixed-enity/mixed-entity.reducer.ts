import { MixedEntityAction } from './mixed-entity.action';
import { ActionBase } from '../actions/action-base';

export interface State {
  item: null;
  items: Array<any>,
  selectedItems: Array<any>;
  selectingItems: Array<any>;
};

const INITIAL: any = {
  item: null,
  items: new Array<any>(),
  selectedItems: new Array<any>(),
  selectingItems: new Array<any>()
};

export function reducer(state: any = INITIAL, action: any): any {
  switch (action.type) {
    case MixedEntityAction.GET_ALL:
      console.log('GET_ALL::::', state, action.payload);
      return {...state, payload: action.payload};
    case MixedEntityAction.GET_ALL_SUCCESS:
      console.log('GET_ALL_SUCCESS::::', state, action.payload);
      state.items = action.payload;
      return {...state, payload: action.payload};
    default:
      return state;
  }
}

