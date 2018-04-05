import * as actions from './album.action';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

// extends EntityState<Partial<any>>
export interface State  extends EntityState<any> {
  // ids: Array<any>;
  // entities: Array<any>;
  loading: boolean;
  detail: boolean; // if state is in details page as album detail, sharing detail
  selectedObjectId: number;
  selectedDetailObjectId: number;
  object:    any;
  objects:  Array<any>;
  currentLink: string;
  nextLink: string;
  query: string;
  detailObject: any;
  detailObjects: Array<any>;
}

export const albumAdapter: EntityAdapter<any> = createEntityAdapter<any>();


const INITIAL_STATE: State = albumAdapter.getInitialState({
  ids: [],
  entities: [],
  loading: true,
  detail: false,
  selectedObjectId: null,
  selectedDetailObjectId: null,
  object:    null,
  objects:  [],
  currentLink: null,
  nextLink: null,
  query: null,
  detailObject: null,
  detailObjects: [],
  currentLinkDetail: null,
  nextLinkDetail: null,
  queryDetail: null,
});


export function reducer(state = INITIAL_STATE, action: actions.Actions): State {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case actions.ActionTypes.GET: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.GET_SUCCESS: {
      return Object.assign({}, state, {
        loading:  false,
        photo:     action.payload
      });
    }

    case actions.ActionTypes.GET_FAIL: {
      return Object.assign({}, state, {
        loading:  false,
        photos:     null
      });
    }

    case actions.ActionTypes.GET_ALL: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.GET_ALL_SUCCESS: {
      let result: any;
      // add selected attribute
      action.payload.data.map(obj => {
        obj['selected'] = state.selectedObjectId === obj.id ? true : false;
        return obj;
      });
      if (action.payload.detail) {
        result = Object.assign({}, state, {
          loading:  false,
          detail: true,
          detailObjects: action.payload.data,
          detailObject: null,
          currentLinkDetail: action.payload.page_metadata.links.self,
          nextLinkDetail: action.payload.page_metadata.links.next
        });
      } else {
        result = Object.assign({}, state, {
          loading:  false,
          detail: false,
          objects:   action.payload.data,
          object: null,
          detailObjects: [],
          detailObject: null,
          currentLink: action.payload.page_metadata.links.self,
          nextLink: action.payload.page_metadata.links.next
        });
      }
      return result;
    }

    case actions.ActionTypes.GET_MORE_SUCCESS: {
      let result: any;
      // add selected attribute
      action.payload.data.map(obj => {
        obj['selected'] = state.selectedObjectId === obj.id ? true : false;
        return obj;
      });
      if (action.payload.detail) {
        result = Object.assign({}, state, {
          loading:  false,
          detail: true,
          detailObjects: action.payload.data,
          detailObject: null,
          currentLinkDetail: action.payload.page_metadata.links.self,
          nextLinkDetail: action.payload.page_metadata.links.next
        });
      } else {
        result = Object.assign({}, state, {
          loading:  false,
          detail: false,
          objects:   action.payload.data,
          object: null,
          detailObjects: [],
          detailObject: null,
          currentLink: action.payload.page_metadata.links.self,
          nextLink: action.payload.page_metadata.links.next
        });
      }
      return result;
    }

    case actions.ActionTypes.GET_ALL_FAIL: {
      return Object.assign({}, state, {
        loading:  false,
        objects:   []
      });
    }

    case actions.ActionTypes.SELECT_ALL: {
      if (state.detail) {
        Object.values(state.detailObjects).map(obj => {
          obj.selected = true;
          return obj;
        });
      } else {
        Object.values(state.objects).map(obj => {
          obj.selected = true;
          return obj;
        });
      }
      return state;
    }

    case actions.ActionTypes.SELECT:
      if (state.detail) {
        Object.values(state.detailObjects).map(obj => {
          if (obj.id === action.payload.selectedObjects[0].id) {
            obj.selected = true;
            state.selectedObjectId = obj.id;
          } else if (action.payload.clearAll) {
            obj.selected = false;
          }
          return obj;
        });
      } else {
        Object.values(state.objects).map(obj => {
          if (obj.id === action.payload.selectedObjects[0].id) {
            obj.selected = true;
            state.selectedObjectId = obj.id;
          } else if (action.payload.clearAll) {
            obj.selected = false;
          }
          return obj;
        });
      }
      return state;
    case actions.ActionTypes.DESELECT: {
      if (state.detail) {
        Object.values(state.detailObjects).map(obj => {
          if (obj.id === action.payload.selectedObjects[0].id) {
            obj.selected = false;
          }
          return obj;
        });
      } else {
        Object.values(state.objects).map(obj => {
          if (obj.id === action.payload.selectedObjects[0].id) {
            obj.selected = false;
          }
          return obj;
        });
      }
      return state;
        // return albumAdapter.updateMany(
        //   action.payload.selectedObjects.map(
        //     (object) => Object.assign({}, { id: object.id, changes: object })),
        //   {...state, loading: false }
        // );
    }
    case actions.ActionTypes.DESELECT_ALL: {
      if (state.detail) {
        Object.values(state.detailObjects).map(obj => {
          obj.selected = false;
          return obj;
        });
      } else {
        Object.values(state.objects).map(obj => {
          obj.selected = false;
          return obj;
        });
      }
      return state;
    }

    case actions.ActionTypes.FAVORITE_SUCCESS: {
      if (state.detail) {
        Object.values(state.detailObjects).map(obj => {
          action.payload.selectedObjects.forEach(selectedObject => {
            if (obj.id === selectedObject.id && action.payload.mode === 'add') {
              obj.favorite = true;
            } else if (obj.id === selectedObject.id && action.payload.mode === 'remove') {
              obj.favorite = false;
            }
          });
          return obj;
        });
      } else {
        Object.values(state.objects).map(obj => {
          action.payload.selectedObjects.forEach(selectedObject => {
            if (obj.id === selectedObject.id && action.payload.mode === 'add') {
              obj.favorite = true;
            } else if (obj.id === selectedObject.id && action.payload.mode === 'remove') {
              obj.favorite = false;
            }
          });
          return obj;
        });
      }
      return state;
    }

    case actions.ActionTypes.ADD: {
        return albumAdapter.addOne(action.payload.data, state);
      }

    case actions.ActionTypes.ADD_SUCCESS: {
        action.payload.data['selected'] = false;
        if (state.detail) {
          state.detailObjects.push(action.payload.data);
        } else {
          state.selectedObjectId = action.payload.data.id;
          state.objects.push(action.payload.data);
        }
        return state;
    }

    case actions.ActionTypes.ADD_MANY_SUCCESS: {
      const cloneState = {
        objects: [...state.objects],
        detailObjects: [...state.detailObjects]
      };
      action.payload.data.map(obj => {
        obj.selected = false;
        if (state.detail) {
          cloneState.detailObjects.push(obj);
        } else {
          cloneState.objects.push(obj);
        }
      });

      return  Object.assign({}, state, cloneState);
    }

    case actions.ActionTypes.DELETE_MANY_SUCCESS: {
      const cloneState = {
        objects: [...state.objects],
        detailObjects: [...state.detailObjects]
      };
      if (state.detail) {
        action.payload.data.forEach(obj => {
          cloneState.detailObjects.splice(cloneState.detailObjects.indexOf(obj), 1);
        });
      } else {
        action.payload.data.forEach(obj => {
          cloneState.objects.splice(cloneState.objects.indexOf(obj), 1);
        });
      }
      return  Object.assign({}, state, cloneState);
    }

    case actions.ActionTypes.ADD_TO_DETAIL_OBJECTS_SUCCESS: {
      action.payload.data.map(obj => {
        obj.selected = false;
        return obj;
      });
      state.detailObjects.push(...action.payload.data);
      return state;
    }

    default: {
      return state;
    }
  }
}


export const getLoading = (state: State) => state.loading;
export const getObjectEntities    = (state: State) => state.entities;
export const getObjectState   = (state: State) => state;
export const getObjects    = (state: State) => state.objects;
export const getObject    = (state: State) => state.object;
export const getDetailObjects    = (state: State) => state.detailObjects;
export const getDetailObject    = (state: State) => state.detailObject;
export const getNextLink    = (state: State) => state.nextLink;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = albumAdapter.getSelectors(getObjectState);
