import { ActionReducer, Action } from '@ngrx/store';
import { BaseModel } from '../../../core/shared/models/base.model';

export const ADD_SELECTED_CONTACT = '[NOTE] SHARE_MODAL_ADD_SELECTED_CONTACT';
export const SET_SHARED_CONTACTS = '[NOTE] SHARE_MODAL_SET_SHARED_CONTACTS';
export const REMOVE_SHARED_CONTACT = '[NOTE] SHARE_MODAL_REMOVE_SHARED_CONTACT';
export const CANCEL_REMOVE_SHARED_CONTACT = '[NOTE] SHARE_MODAL_CANCEL_REMOVE_SHARED_CONTACT';
export const CANCEL_ACTIONS = '[NOTE] SHARE_MODAL_CANCEL_ACTIONS';
export const SAVE = '[NOTE] SHARE_MODAL_SAVE';

declare let _: any;
let empty: any = function(): any {
	return {
		selectedContacts: [],
		sharedContacts: []
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
			stateClone.current.sharedContacts = _.clone(stateClone.saved.sharedContacts);
			return stateClone;
		case SAVE:
			stateClone.changed = false;
			stateClone.showCancelButton = false;
			stateClone.current.sharedContacts = _.uniqBy(stateClone.current.sharedContacts.concat(stateClone.current.selectedContacts), 'id');
			stateClone.current.selectedContacts = [];

			stateClone.saved.selectedContacts = _.clone(stateClone.current.selectedContacts);
			stateClone.saved.sharedContacts = _.clone(stateClone.current.sharedContacts);
			return stateClone;
		case SET_SHARED_CONTACTS:
			stateClone.current.sharedContacts = _.clone(action.payload);
			stateClone.saved.sharedContacts = _.clone(action.payload);
			return stateClone;
		case REMOVE_SHARED_CONTACT:
			stateClone.changed = true;
			stateClone.showCancelButton = true;
			for( let i in stateClone.current.sharedContacts) {
				if (stateClone.current.sharedContacts[i].id == action.payload.id) {
					let clone = _.clone(stateClone.current.sharedContacts[i]);
					clone._destroy = true;
					stateClone.current.sharedContacts[i] = clone;
				}
			}
			return stateClone;
		case CANCEL_REMOVE_SHARED_CONTACT:
			for( let i in stateClone.current.sharedContacts) {
				if (stateClone.current.sharedContacts[i].id == action.payload.id) {
					let clone = _.clone(stateClone.current.sharedContacts[i]);
					clone._destroy = null;
					stateClone.current.sharedContacts[i] = clone;
				}
			}
			return stateClone;
		default:
			return stateClone;
	}
}
