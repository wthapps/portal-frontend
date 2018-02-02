import * as actions from './photo.action';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';


export interface State extends EntityState<Partial<any>> {
  loading: boolean;
  loaded:  boolean;
  failed:  boolean;
  selectedPhotoId: number;
  photo:    any;
  photos:  Array<any>;
}

export const adapter: EntityAdapter<Partial<any>> = createEntityAdapter<Partial<any>>();


const INITIAL_STATE: State = adapter.getInitialState({
  ids: [],
  entities: [],
  loading: false,
  loaded:  false,
  failed:  false,
  selectedPhotoId: null,
  photo:    null,
  photos:  []
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
      return adapter.addAll(action.payload.data, state);
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
};

export const getPhoto    = (state: State) => state.photo;
export const getPhotos    = (state: State) => state.photos;
export const getLoading = (state: State) => state.loading;
export const getLoaded  = (state: State) => state.loaded;
export const getFailed  = (state: State) => state.failed;
export const getPhotoEntities    = (state: State) => state.entities;
export const getPhotoState   = (state: State) => state;
// export const getState   = createFeatureSelector<State>('photo');
export const getState   = (state: State) => state;



export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getState);

