import { Action }   from '@ngrx/store';

export const ActionTypes = {
  GET:                  '[Album] Get',
  GET_SUCCESS:          '[Album] Get Success',
  GET_FAIL:             '[Album] Get Fail',
  GET_ALL:              '[Album] Get All',
  GET_ALL_SUCCESS:      '[Album] Get All Success',
  GET_MORE:             '[Album] Get More',
  GET_MORE_SUCCESS:     '[Album] Get More Success',
  GET_ALL_FAIL:         '[Album] Get All',
  SELECT:               '[Album] Select',
  SELECT_ALL:           '[Album] Select All',
  DESELECT:             '[Album] Deselect',
  DESELECT_ALL:         '[Album] Deselect All',
  FAVORITE_SUCCESS:     '[Album] Favorite Success',
  ADD:                  '[Album] Add',
  ADD_SUCCESS:          '[Album] Add Success',
  ADD_FAIL:             '[Album] Add Fail',
  ADD_MANY:             '[Album] Add Many',
  ADD_MANY_SUCCESS:     '[Album] Add Many Success',
  ADD_MANY_FAIL:        '[Album] Add Many Fail',
  ADD_TO_DETAIL_OBJECTS: '[Album] Add To Detail Objects',
  ADD_TO_DETAIL_OBJECTS_SUCCESS:     '[Album] Add To Detail Objects Success',
  REMOVE_FROM_DETAIL_OBJECTS:     '[Album] Remove From Detail Objects',
  REMOVE_FROM_DETAIL_OBJECTS_SUCCESS:     '[Album] Remove From Detail Objects Success',
  UPDATE:               '[Album] Update',
  UPDATE_SUCCESS:       '[Album] Update Success',
  UPDATE_FAIL:          '[Album] Update Fail',
  UPDATE_MANY:          '[Album] Update Many',
  UPDATE_MANY_SUCCESS:  '[Album] Update Many Success',
  UPDATE_MANY_FAIL:     '[Album] Update Many Fail',
  DELETE:               '[Album] Delete',
  DELETE_SUCCESS:       '[Album] Delete Success',
  DELETE_FAIL:          '[Album] Delete Fail',
  DELETE_MANY:          '[Album] Delete Many',
  DELETE_MANY_SUCCESS:  '[Album] Delete Many Success',
  DELETE_MANY_FAIL:     '[Album] Delete Many Fail',
  DOWNLOAD:             '[Album] Download',
  FAVORITE:             '[Album] Favorite',
  GET_ALL_FAVORITE:     '[Album] Get All Favorite',

};

/**
 * Album Actions
 */
export class GetAll implements Action {
  type = ActionTypes.GET_ALL;
  constructor(public payload: any = {objectType: 'all', detail: false, object: null, query: null }) { }
}

export class GetAllSuccess implements Action {
  type = ActionTypes.GET_ALL_SUCCESS;
  constructor(public payload: Partial<any>[] = null) { }
}

export class GetMore implements Action {
  type = ActionTypes.GET_MORE;
  constructor(public payload: any = {objectType: 'all', detail: false, object: null, query: null }) { }
}

export class GetMoreSuccess implements Action {
  type = ActionTypes.GET_MORE_SUCCESS;
  constructor(public payload: Partial<any>[] = null) { }
}

export class GetAllFail implements Action {
  type = ActionTypes.GET_ALL_FAIL;
  constructor(public payload: any = null) { }
}

export class Get implements Action {
  type = ActionTypes.GET;
  constructor(public payload: any = null) { }
}

export class GetSuccess implements Action {
  type = ActionTypes.GET_SUCCESS;
  constructor(public payload: any = null) { }
}

export class GetAllFavorite implements Action {
  type = ActionTypes.GET_ALL_FAVORITE;
  constructor(public payload: any = null) { }
}

export class GetFail implements Action {
  type = ActionTypes.GET_FAIL;
  constructor(public payload: any = null) { }
}

export class Select implements Action {
  type = ActionTypes.SELECT;
  constructor(public payload: any = null) { }
}

export class SelectAll implements Action {
  type = ActionTypes.SELECT_ALL;
  constructor(public payload: any = null) { }
}

export class Deselect implements Action {
  type = ActionTypes.DESELECT;
  constructor(public payload: any = null) { }
}

export class DeselectAll implements Action {
  type = ActionTypes.DESELECT_ALL;
  constructor(public payload: any = null) { }
}

export class FavoriteSuccess implements Action {
  type = ActionTypes.FAVORITE_SUCCESS;
  constructor(public payload: any = null) { }
}

export class Add implements Action {
  type = ActionTypes.ADD;
  constructor(public payload: any = null) { }
}

export class AddSuccess implements Action {
  type = ActionTypes.ADD_SUCCESS;
  constructor(public payload: any = null) { }
}

export class AddMany implements Action {
  type = ActionTypes.ADD_MANY;
  constructor(public payload: any = null) { }
}

export class AddManySuccess implements Action {
  type = ActionTypes.ADD_MANY_SUCCESS;
  constructor(public payload: any = null) { }
}

export class AddToDetailObjects implements Action {
  type = ActionTypes.ADD_TO_DETAIL_OBJECTS;

  /**
   * Create action that add objects list to detail objects list
   * @param payload
   * with structure { object: object, objects: array<object> }
   * object: parent object
   * objects: array of objects that you need to add to parent object
   */
  constructor(public payload: any = { object: null, objects: [] }) { }
}

export class AddToDetailObjectsSuccess implements Action {
  type = ActionTypes.ADD_TO_DETAIL_OBJECTS_SUCCESS;
  constructor(public payload: any = null) { }
}

export class RemoveFromDetailObjects implements Action {
  type = ActionTypes.REMOVE_FROM_DETAIL_OBJECTS;
  constructor(public payload: any = null) { }
}

export class RemoveFromDetailObjectsSuccess implements Action {
  type = ActionTypes.REMOVE_FROM_DETAIL_OBJECTS_SUCCESS;
  constructor(public payload: any = null) { }
}

export class Update implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: any) { }
}

export class UpdateSuccess implements Action {
  type = ActionTypes.UPDATE_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateMany implements Action {
  type = ActionTypes.UPDATE_MANY;
  constructor(public payload: any) { }
}

export class UpdateManySuccess implements Action {
  type = ActionTypes.UPDATE_MANY_SUCCESS;
  constructor(public payload: any) { }
}

export class Delete implements Action {
  type = ActionTypes.DELETE;
  constructor(public payload: any = null) { }
}

export class DeleteSuccess implements Action {
  type = ActionTypes.DELETE_SUCCESS;
  constructor(public payload: any = null) { }
}

export class DeleteMany implements Action {
  type = ActionTypes.DELETE_MANY;
  constructor(public payload: any = null) { }
}

export class DeleteManySuccess implements Action {
  type = ActionTypes.DELETE_MANY_SUCCESS;
  constructor(public payload: any = null) { }
}

export class Download implements Action {
  type = ActionTypes.DOWNLOAD;
  constructor(public payload: any = null) { }
}

export class Favorite implements Action {
  type = ActionTypes.FAVORITE;
  constructor(public payload: any = null) { }
}

export type Actions
  = Get
  | GetSuccess
  | GetFail
  | GetAll
  | GetAllSuccess
  | GetAllFail
  | Select
  | SelectAll
  | Deselect
  | DeselectAll
  | FavoriteSuccess
  | Add
  | AddSuccess
  | AddMany
  | AddManySuccess
  | AddToDetailObjects
  | AddToDetailObjectsSuccess
  | RemoveFromDetailObjects
  | RemoveFromDetailObjectsSuccess
  | Update
  | UpdateSuccess
  | UpdateMany
  | UpdateManySuccess
  | Delete
  | DeleteSuccess
  | DeleteMany
  | DeleteManySuccess
  | Download
  | Favorite
  | GetAllFavorite;
