import { Action }   from '@ngrx/store';
import { User } from '@wth/shared/shared/models';

export const ActionTypes = {
  GET:                  '[Photo] Get',
  GET_SUCCESS:          '[Photo] Get Success',
  GET_FAIL:             '[Photo] Get Fail',
  GET_ALL:              '[Photo] Get All',
  GET_ALL_SUCCESS:      '[Photo] Get All Success',
  GET_ALL_FAIL:         '[Photo] Get All',
  ADD:                  '[Photo] Add',
  ADD_SUCCESS:          '[Photo] Add Success',
  ADD_FAIL:             '[Photo] Add Fail',
  ADD_MANY:             '[Photo] Add Many',
  ADD_MANY_SUCCESS:     '[Photo] Add Many Success',
  ADD_MANY_FAIL:        '[Photo] Add Many Fail',
  UPDATE:               '[Photo] Update',
  UPDATE_SUCCESS:       '[Photo] Update Success',
  UPDATE_FAIL:          '[Photo] Update Fail',
  UPDATE_MANY:          '[Photo] Update Many',
  UPDATE_MANY_SUCCESS:  '[Photo] Update Many Success',
  UPDATE_MANY_FAIL:     '[Photo] Update Many Fail',
  DELETE:               '[Photo] Delete',
  DELETE_SUCCESS:       '[Photo] Delete Success',
  DELETE_FAIL:          '[Photo] Delete Fail',
  DELETE_MANY:          '[Photo] Delete Many',
  DELETE_MANY_SUCCESS:  '[Photo] Delete Many Success',
  DELETE_MANY_FAIL:     '[Photo] Delete Many Fail',
};

/**
 * Sharing Actions
 */
export class GetAll implements Action {
  type = ActionTypes.GET_ALL;
  constructor(public payload: any = null) { }
}

export class GetAllSuccess implements Action {
  type = ActionTypes.GET_ALL_SUCCESS;
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

export class GetFail implements Action {
  type = ActionTypes.GET_FAIL;
  constructor(public payload: any = null) { }
}

export class Select implements Action {
  type = ActionTypes.GET;
  constructor(public payload: any = null) { }
}

export class Add implements Action {
  type = ActionTypes.ADD;

  constructor(public payload: any = null) { }
}

export class Update implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: any) { }
}

export class Delete implements Action {
  type = ActionTypes.DELETE;

  constructor(public payload: any = null) { }
}

export type Actions
  = Get
  | GetSuccess
  | GetFail
  | GetAll
  | GetAllSuccess
  | GetAllFail
  | Add
  | Update
  | Delete;
