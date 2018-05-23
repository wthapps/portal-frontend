import { Action }   from '@ngrx/store';

export const  GET =                  '[Object] Get';
export const  GET_SUCCESS =          '[Object] Get Success';
export const  GET_FAIL =             '[Object] Get Fail';
export const  GET_ALL =              '[Object] Get All';
export const  GET_ALL_SUCCESS =      '[Object] Get All Success';
export const  GET_ALL_FAIL =         '[Object] Get All';
export const  SELECT =               '[Object] Select';
export const  SELECT_ALL =           '[Object] Select All';
export const  DESELECT =             '[Object] Deselect';
export const  DESELECT_ALL =         '[Object] Deselect All';
export const  GET_SELECTED_OBJECTS = '[Object] Get Selected Objects';
export const  ADD =                  '[Object] Add';
export const  ADD_SUCCESS =          '[Object] Add Success';
export const  ADD_FAIL =             '[Object] Add Fail';
export const  ADD_MANY =             '[Object] Add Many';
export const  ADD_MANY_SUCCESS =     '[Object] Add Many Success';
export const  ADD_MANY_FAIL =        '[Object] Add Many Fail';
export const  UPDATE =               '[Object] Update';
export const  UPDATE_SUCCESS =       '[Object] Update Success';
export const  UPDATE_FAIL =          '[Object] Update Fail';
export const  UPDATE_MANY =          '[Object] Update Many';
export const  UPDATE_MANY_SUCCESS =  '[Object] Update Many Success';
export const  UPDATE_MANY_FAIL =     '[Object] Update Many Fail';
export const  DELETE =               '[Object] Delete';
export const  DELETE_SUCCESS =       '[Object] Delete Success';
export const  DELETE_FAIL =          '[Object] Delete Fail';
export const  DELETE_MANY =          '[Object] Delete Many';
export const  DELETE_MANY_SUCCESS =  '[Object] Delete Many Success';
export const  DELETE_MANY_FAIL =     '[Object] Delete Many Fail';


/**
 * Photo Actions
 */
export class GetAll implements Action {
  type = GET_ALL;
  constructor(public payload: any = null) { }
}

export class GetAllSuccess implements Action {
  type = GET_ALL_SUCCESS;
  constructor(public payload: Partial<any>[] = null) { }
}

export class GetAllFail implements Action {
  type = GET_ALL_FAIL;
  constructor(public payload: any = null) { }
}

export class Get implements Action {
  type = GET;
  constructor(public payload: any = null) { }
}

export class GetSuccess implements Action {
  type = GET_SUCCESS;
  constructor(public payload: any = null) { }
}

export class GetFail implements Action {
  type = GET_FAIL;
  constructor(public payload: any = null) { }
}

export class Select implements Action {
  type = SELECT;
  constructor(public payload: any = null) { }
}

export class SelectAll implements Action {
  type = SELECT_ALL;
  constructor(public payload: any = null) { }
}

export class Deselect implements Action {
  type = DESELECT;
  constructor(public payload: any = null) { }
}

export class DeselectAll implements Action {
  type = DESELECT_ALL;
  constructor(public payload: any = null) { }
}

export class GetSelectedObjects implements Action {
  type = GET_SELECTED_OBJECTS;
  constructor(public payload: any = null) { }
}

export class Add implements Action {
  type = ADD;
  constructor(public payload: any = null) { }
}

export class AddSuccess implements Action {
  type = ADD;
  constructor(public payload: any = null) { }
}

export class AddFail implements Action {
  type = ADD;
  constructor(public payload: any = null) { }
}

export class Update implements Action {
  type = UPDATE;
  constructor(public payload: any) { }
}

export class UpdateSuccess implements Action {
  type = UPDATE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class UpdateFail implements Action {
  type = UPDATE_FAIL;

  constructor(public payload: any = null) { }
}

export class Delete implements Action {
  type = DELETE;

  constructor(public payload: any = null) { }
}

export class DeleteSuccess implements Action {
  type = DELETE_SUCCESS;

  constructor(public payload: any = null) { }
}

export class DeleteFail implements Action {
  type = DELETE_FAIL;

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
  | Add
  | AddSuccess
  | AddFail
  | Update
  | UpdateSuccess
  | UpdateFail
  | Delete
  | DeleteSuccess
  | DeleteFail;
