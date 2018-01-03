import { ActionReducer, Action } from '@ngrx/store';
import { BaseModel } from '@shared/shared/models/base.model';

export const ADD_SELECTED_CONTACT = '[NOTE] SHARE_MODAL_ADD_SELECTED_CONTACT';
export const SET_SHARED_SHARINGS = '[NOTE] SHARE_MODAL_SET_SHARED_SHARINGS';
export const REMOVE_SELECTED_CONTACT = '[NOTE] SHARE_MODAL_REMOVE_SELECTED_CONTACT';
export const CANCEL_ACTIONS = '[NOTE] SHARE_MODAL_CANCEL_ACTIONS';
export const UPDATE_SHARING = '[NOTE] UPDATE_SHARING';
export const SAVE = '[NOTE] SHARE_MODAL_SAVE';

declare let _: any;
let empty: any = function (): any {
  return {
    selectedContacts: [],
    sharedSharings: []
  }
};

export function reducer(state: any = {
  saved: empty(),
  current: empty(),
  changed: false,
  showCancelButton: false,
  saveButton: {}
}, action: any) {
  let stateClone: any = _.clone(state);
  switch (action.type) {
    case ADD_SELECTED_CONTACT:
      stateClone.changed = true;
      stateClone.showCancelButton = true;
      stateClone.current.selectedContacts.push(action.payload);
      return stateClone;
    case CANCEL_ACTIONS:
      stateClone.changed = false;
      stateClone.showCancelButton = false;
      stateClone.current.selectedContacts = _.clone(stateClone.saved.selectedContacts);
      stateClone.current.sharedSharings = _.clone(stateClone.saved.sharedSharings);
      return stateClone;
    case SAVE:
      stateClone.changed = false;
      stateClone.showCancelButton = false;
      stateClone.current.sharedSharings = _.uniqBy(stateClone.current.sharedSharings.concat(convertContactsToSharings(stateClone.current.selectedContacts)), 'id');
      stateClone.current.selectedContacts = [];

      stateClone.saved.selectedContacts = _.clone(stateClone.current.selectedContacts);
      stateClone.saved.sharedSharings = _.clone(stateClone.current.sharedSharings);
      return stateClone;
    case SET_SHARED_SHARINGS:
      stateClone.current.sharedSharings = _.clone(action.payload);
      stateClone.saved.sharedSharings = _.clone(action.payload);
      return stateClone;
    case UPDATE_SHARING:
      stateClone.changed = true;
      stateClone.showCancelButton = true;
      for (let i in stateClone.current.sharedSharings) {
        if (stateClone.current.sharedSharings[i].id == action.payload.id) {
          stateClone.current.sharedSharings[i] = action.payload;
        }
      }
      return stateClone;
		case REMOVE_SELECTED_CONTACT:
			_.remove(stateClone.current.selectedContacts, (contact: any) => {return contact.id == action.payload.id});
      if(stateClone.current.selectedContacts.length == 0) stateClone.changed = false;
			return stateClone;
    default:
      return state;
  }
}


let convertContactsToSharings = (contacts: any) => {
  let sharings:any = []
  for(let contact of contacts) {
    sharings.push({permission: 'view', recipient: {id: contact.id, name: contact.name, profile_image: contact.profile_image}})
  }
  return sharings;
}
