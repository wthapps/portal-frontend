import * as actions from './album.action';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';


export interface State extends EntityState<Partial<any>> {
  loading: boolean;
  loaded:  boolean;
  detail: boolean; // if state is in details page as album detail, sharing detail
  selectedObjectId: number;
  selectedDetailObjectId: number;
  object:    any;
  objects:  Array<any>;
  detailObject: any;
  detailObjects: Array<any>;
}

export const albumAdapter: EntityAdapter<Partial<any>> = createEntityAdapter<Partial<any>>();


const INITIAL_STATE: State = albumAdapter.getInitialState({
  ids: [],
  entities: [],
  loading: false,
  loaded:  false,
  detail: false,
  selectedObjectId: null,
  selectedDetailObjectId: null,
  object:    null,
  objects:  [],
  detailObject: null,
  detailObjects: []
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
        loaded:   true,
        loading:  false,
        photo:     action.payload
      });
    }

    case actions.ActionTypes.GET_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
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
        obj['selected'] = false;
        return obj;
      });
      if (action.payload.detail) {
        result = Object.assign({}, state, {
          loaded:   true,
          loading:  false,
          detail: true,
          detailObjects: action.payload.data,
          detailObject: null,
        });
      } else {
        result = Object.assign({}, state, {
          loaded:   true,
          loading:  false,
          detail: false,
          objects:   action.payload.data,
          object: null,
          detailObjects: [],
          detailObject: null,
        });
      }
      return result;

      // return albumAdapter.addAll(action.payload.data, state);
    }

    case actions.ActionTypes.GET_ALL_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
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
      return state
    }

    case actions.ActionTypes.SELECT:
      if (state.detail) {
        Object.values(state.detailObjects).map(obj => {
          if (obj.id === action.payload.selectedObjects[0].id) {
            obj.selected = true;
          } else if (action.payload.clearAll) {
            obj.selected = false;
          }
          return obj;
        });
      } else {
        Object.values(state.objects).map(obj => {
          if (obj.id === action.payload.selectedObjects[0].id) {
            obj.selected = true;
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
        //   {...state, loaded: true, loading: false }
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
        Object.values(state.entities).map(obj => {
          obj.selected = false;
          return obj;
        });
        return state;
    }

    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoaded  = (state: State) => state.loaded;
export const getObjectEntities    = (state: State) => state.entities;
export const getObjectState   = (state: State) => state;
export const getObjects    = (state: State) => state.objects;
export const getObject    = (state: State) => state.object;
export const getDetailObjects    = (state: State) => state.detailObjects;
export const getDetailObject    = (state: State) => state.detailObject;




export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = albumAdapter.getSelectors(getObjectState);
