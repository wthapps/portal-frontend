import * as actions from './object.action';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<Partial<any>> {
  loading: boolean;
  loaded:  boolean;
  failed:  boolean;
  selectedObjectIds: any;
  object:    any;
  objects:  Array<any>;
  selectedObjects: Array<any>;
}

export const adapter: EntityAdapter<Partial<any>> = createEntityAdapter<Partial<any>>();


const INITIAL_STATE: State = adapter.getInitialState({
  ids: [],
  entities: [],
  loading: false,
  loaded:  false,
  failed:  false,
  selectedObjectIds: null,
  object:    null,
  objects:  [],
  selectedObjects: [],
});


export function reducer(state = INITIAL_STATE, action: actions.Actions): State {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case actions.GET: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.GET_SUCCESS: {
      return Object.assign({}, state, {
        loaded:   true,
        loading:  false,
        failed:   false,
        object:     action.payload
      });
    }

    case actions.GET_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        objects:     []
      });
    }

    case actions.GET_ALL: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.GET_ALL_SUCCESS: {
      // Add selected attribute to each of object
      action.payload.data.map(obj => {
        obj['selected'] = false;
        return obj;
      });
      return adapter.addAll(action.payload.data, state);
    }

    case actions.GET_ALL_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        objects:   []
      });
    }
    case actions.SELECT: {
      adapter.updateMany(action.payload.selectedObjects, state);
      Object.values(state.entities).forEach(object => {
        if (object.selected) {
          if (state.selectedObjects.indexOf(object) < 0) {
            state.selectedObjects.push(object);
          }
        } else {
          state.selectedObjects.forEach((so, index) => {
            if (object.id === so.id) {
              state.selectedObjects.splice(index, 1);
            }
          });
        }
      });
      return state;
    }
    case actions.SELECT_ALL: {
      Object.values(state.entities).map(obj => {
        obj.selected = true;
        return obj;
      });
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        objects:   []
      });
    }
    case actions.DESELECT: {
      action.payload.selectedObjects.forEach(selectedObject => {
        Object.values(state.entities).map(obj => {
          if (selectedObject.id === obj.id) {
            obj.selected = false;
          }
          return obj;
        });
      });
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        objects:   []
      });
    }
    case actions.DESELECT_ALL: {
      Object.values(state.entities).map(obj => {
        obj.selected = false;
        return obj;
      });
      // state.selectedObjects = [];
      return state;
    }

    case actions.GET_SELECTED_OBJECTS: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        objects:   []
      });
    }

    case actions.UPDATE: {
      state.loading = true;
      return state;
    }
    case actions.UPDATE_SUCCESS: {
      if(state.selectedObjects.length > 1) {
        return adapter.updateMany([], state);
      } else if (state.selectedObjects.length == 1) {
        let id = state.selectedObjects[0].id;
        state.selectedObjects = [];
        return adapter.updateOne(id, state);
      }
    }

    case actions.UPDATE_FAIL: {
      return Object.assign({}, state, {
        loaded:   true,
        loading:  false,
        failed:   true,
        objects:   []
      });
    }

    case actions.DELETE: {
      state.loading = true;
      return state;
    }
    case actions.DELETE_SUCCESS: {

      if(state.selectedObjects.length > 1) {
        return adapter.removeMany([], state);
      } else if (state.selectedObjects.length == 1) {
        let id = state.selectedObjects[0].id;
        state.selectedObjects = [];
        return adapter.removeOne(id, state);
      }
    }

    case actions.DELETE_FAIL: {
      return Object.assign({}, state, {
        loaded:   true,
        loading:  false,
        failed:   true,
        objects:   []
      });
    }

    default: {
      return state;
    }
  }
}

export const getObject    = (state: State) => state.object;
export const getObjects    = (state: State) => state.objects;
export const getLoading = (state: State) => state.loading;
export const getLoaded  = (state: State) => state.loaded;
export const getFailed  = (state: State) => state.failed;
export const getObjectEntities    = (state: State) => state.entities;
export const getSelectedObjects    = (state: State) => state.selectedObjects;

export const getObjectState   = (state: State) => state;
// export const getState   = createFeatureSelector<State>('object');
export const getState   = (state: State) => state;



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getState);

