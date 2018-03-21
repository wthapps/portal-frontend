import * as actions from './album.action';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Album } from '@media/shared/model/album.model';


export interface State extends EntityState<Partial<any>> {
  loading: boolean;
  loaded:  boolean;
  failed:  boolean;
  selectedAlbumId: number;
  album:    any;
  albums:  Array<any>;
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
  albums:  []
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

    case actions.ActionTypes.GET_ALL: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.ActionTypes.GET_ALL_SUCCESS: {
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



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = albumAdapter.getSelectors(getAlbumState);
