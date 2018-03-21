import { Action }   from '@ngrx/store';
import { User } from '@wth/shared/shared/models';

export const ActionTypes = {
  GET:                  '[Album] Get',
  GET_SUCCESS:          '[Album] Get Success',
  GET_FAIL:             '[Album] Get Fail',
  GET_ALL:              '[Album] Get All',
  GET_ALL_SUCCESS:      '[Album] Get All Success',
  GET_ALL_FAIL:         '[Album] Get All',
  ADD:                  '[Album] Add',
  ADD_SUCCESS:          '[Album] Add Success',
  ADD_FAIL:             '[Album] Add Fail',
  ADD_MANY:             '[Album] Add Many',
  ADD_MANY_SUCCESS:     '[Album] Add Many Success',
  ADD_MANY_FAIL:        '[Album] Add Many Fail',
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
};

/**
 * Album Actions
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
