import * as actions from './album.action';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';


export interface State extends EntityState<Partial<any>> {
  loading: boolean;
  loaded:  boolean;
  failed:  boolean;
  selectedAlbumId: number;
  album:    any;
  albums:  Array<any>;
  photo: any;
  photos: Array<any>;
}

export const albumAdapter: EntityAdapter<Partial<any>> = createEntityAdapter<Partial<any>>();


const INITIAL_STATE: State = albumAdapter.getInitialState({
  ids: [],
  entities: [],
  loading: false,
  loaded:  false,
  failed:  false,
  selectedAlbumId: null,
  album:    null,
  albums:  [],
  photo: null,
  photos: []
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
        failed:   false,
        photo:     action.payload
      });
    }

    case actions.ActionTypes.GET_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        photos:     null
      });
    }

    case actions.ActionTypes.GET_PHOTOS: {
      return Object.assign({}, state, {
        loading: true,
        photos: [],
        photo: null
      });
    }

    case actions.ActionTypes.GET_PHOTOS_SUCCESS: {
      return Object.assign({}, state, {
        loaded:   true,
        loading:  false,
        failed:   false,
        photos:   action.payload.data
      });
    }

    case actions.ActionTypes.GET_ALL: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.GET_ALL_SUCCESS: {
      // add selected attribute
      action.payload.data.map(obj => {
        obj['selected'] = false;
        return obj;
      });
      return albumAdapter.addAll(action.payload.data, state);
    }

    case actions.ActionTypes.GET_ALL_FAIL: {
      return Object.assign({}, state, {
        loaded:   false,
        loading:  false,
        failed:   true,
        photos:   []
      });
    }

    case actions.ActionTypes.SELECT_ALL: {
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

    case actions.ActionTypes.SELECT:
      Object.values(state.entities).map(obj => {
        if (obj.id === action.payload.selectedObjects[0].id) {
          obj.selected = true;
        } else if (action.payload.clearAll) {
          obj.selected = false;
        }
        return obj;
      });
      return Object.assign({}, state, {
        loaded: false,
        loading: false,
        failed: true,
        objects: []
      });
    case actions.ActionTypes.DESELECT: {
      Object.values(state.entities).map(obj => {
        if (obj.id === action.payload.selectedObjects[0].id) {
          obj.selected = false;
        }
        return obj;
      });
      return Object.assign({}, state, {
        loaded: false,
        loading: false,
        failed: true,
        objects: []
      });
        // return albumAdapter.updateMany(
        //   action.payload.selectedObjects.map(
        //     (object) => Object.assign({}, { id: object.id, changes: object })),
        //   {...state, loaded: true, loading: false }
        // );
    }
    case actions.ActionTypes.DESELECT_ALL: {
      Object.values(state.entities).map(obj => {
        obj.selected = false;
        return obj;
      });
      return Object.assign({}, state, {
        loaded: false,
        loading: false,
        failed: true,
        objects: []
      });
    }

    case actions.ActionTypes.FAVORITE_SUCCESS: {
      Object.values(state.entities).map(obj => {
        action.payload.selectedObjects.forEach(selectedObject => {
          if (obj.id === selectedObject.id && action.payload.mode === 'add') {
            obj.favorite = true;
          } else if (obj.id === selectedObject.id && action.payload.mode === 'remove') {
            obj.favorite = false;
          }
        });
        return obj;
      });
      return Object.assign({}, state, {
        loaded: false,
        loading: false,
        failed: true,
        objects: []
      });
    }

    case actions.ActionTypes.ADD: {
        return albumAdapter.addOne(action.payload.data, state);
      }

    case actions.ActionTypes.ADD_SUCCESS: {
        Object.values(state.entities).map(obj => {
          obj.selected = false;
          return obj;
        });
        return Object.assign({}, state, {
          loaded:   false,
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

export const getAlbum    = (state: State) => state.album;
export const getAlbums    = (state: State) => state.albums;
export const getLoading = (state: State) => state.loading;
export const getLoaded  = (state: State) => state.loaded;
export const getFailed  = (state: State) => state.failed;
export const getAlbumEntities    = (state: State) => state.entities;
export const getAlbumState   = (state: State) => state;
export const getPhotos    = (state: State) => state.photos;



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = albumAdapter.getSelectors(getAlbumState);
