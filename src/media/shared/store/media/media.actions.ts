import { Action }   from '@ngrx/store';

export const ActionTypes = {
  GET:                  '[Media] Get',
  GET_SUCCESS:          '[Media] Get Success',
  GET_FAIL:             '[Media] Get Fail',
  SEARCH:               '[Media] Get Search',
  GET_ALL:              '[Media] Get All',
  GET_ALL_SUCCESS:      '[Media] Get All Success',
  GET_MORE:             '[Media] Get More',
  GET_MORE_SUCCESS:     '[Media] Get More Success',
  GET_ALL_FAIL:         '[Media] Get All',
  SELECT:               '[Media] Select',
  SELECT_ALL:           '[Media] Select All',
  DESELECT:             '[Media] Deselect',
  DESELECT_ALL:         '[Media] Deselect All',
  FAVORITE_SUCCESS:     '[Media] Favorite Success',
  ADD:                  '[Media] Add',
  ADD_SUCCESS:          '[Media] Add Success',
  ADD_FAIL:             '[Media] Add Fail',
  ADD_MANY:             '[Media] Add Many',
  ADD_MANY_SUCCESS:     '[Media] Add Many Success',
  ADD_MANY_FAIL:        '[Media] Add Many Fail',
  ADD_TO_DETAIL_OBJECTS: '[Media] Add To Detail Objects',
  ADD_TO_DETAIL_OBJECTS_SUCCESS:     '[Media] Add To Detail Objects Success',
  REMOVE_FROM_DETAIL_OBJECTS:     '[Media] Remove From Detail Objects',
  REMOVE_FROM_DETAIL_OBJECTS_SUCCESS:     '[Media] Remove From Detail Objects Success',
  UPDATE:               '[Media] Update',
  UPDATE_SUCCESS:       '[Media] Update Success',
  UPDATE_FAIL:          '[Media] Update Fail',
  UPDATE_MANY:          '[Media] Update Many',
  UPDATE_MANY_SUCCESS:  '[Media] Update Many Success',
  UPDATE_MANY_FAIL:     '[Media] Update Many Fail',
  DELETE:               '[Media] Delete',
  DELETE_SUCCESS:       '[Media] Delete Success',
  DELETE_FAIL:          '[Media] Delete Fail',
  DELETE_MANY:          '[Media] Delete Many',
  DELETE_MANY_SUCCESS:  '[Media] Delete Many Success',
  DELETE_MANY_FAIL:     '[Media] Delete Many Fail',
  DOWNLOAD:             '[Media] Download',
  DOWNLOAD_SUCCESS:     '[Media] Download Success',
  FAVORITE:             '[Media] Favorite',
  GET_ALL_FAVORITE:     '[Media] Get All Favorite',

};

/**
 * Media Actions
 */
export class Search implements Action {
  type = ActionTypes.SEARCH;
  constructor(public payload: any = null) { }
}

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

export class DownloadSuccess implements Action {
  type = ActionTypes.DOWNLOAD_SUCCESS;
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
  | Search
  | GetAll
  | GetAllSuccess
  | GetAllFail
  | GetMore
  | GetMoreSuccess
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
