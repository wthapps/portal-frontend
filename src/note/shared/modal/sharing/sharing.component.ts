import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Constants } from '@shared/constant/config/constants';
import { Store } from '@ngrx/store';
import * as fromShareModal from '../../reducers/share-modal';
import { AutoComplete } from 'primeng/primeng';

declare var $: any;

@Component({
  selector: 'z-note-shared-modal-sharing',
  templateUrl: 'sharing.component.html',
  styleUrls: ['sharing.component.scss']
})

export class ZNoteSharedModalSharingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('auto') auto: AutoComplete;

  // operation: any = {
  //   read: 0,
  //   edit: 2,
  //   editing: 20,
  //   create: 1,
  //   creating: 10,
  //   delete: 9,
  //   deleting: 90
  // };

  users: any = [];
  selectedUsers: any = [];
  sharings: any = [];
  newUsers: Array<any> = [];
  updatedUsers: Array<any> = [];
  deletedUsers: Array<any> = [];
  sharedUsers: Array<any> = [];
  sharedObjects: any = [];
  changed = false;
  showCancelButton = false;
  mode = 'create';
  loading = false;
  contactTerm$ = new Subject<string>();

  roles = [
    {id: 1, name: 'view', display_name: 'View Only'},
    {id: 2, name: 'download', display_name: 'Can Download'},
    {id: 3, name: 'edit', display_name: 'Can Edit'},
    {id: 4, name: 'full', display_name: 'Full Access'}
  ];
  role = this.roles[0];

  subscription: Subscription;
  searchSubscription: Subscription;
  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(private apiBaseService: ApiBaseService, private store: Store<any>) {
    this.subscription = store.select('share').subscribe((state: any) => {
      this.selectedUsers = state.current.selectedContacts;
      this.sharings = state.current.sharedSharings;
      this.sharings.forEach(s => this.sharedUsers.push({ ...s.recipient, role: s.permission }));
      this.changed = state.changed;
      this.showCancelButton = state.showCancelButton;
      if (this.auto) {
        this.auto.value = this.selectedUsers;
        this.auto.onModelChange(this.auto.value);
        }
      });
    this.searchSubscription = this.contactTerm$.pipe(
      debounceTime(Constants.searchDebounceTime),
      distinctUntilChanged(),
      switchMap((term: any) => this.apiBaseService.get(`account/search?q=${term.query}`)))
      .subscribe((res: any) => {
        const selectedIds = this.selectedUsers.map(ct => ct.id);
        const sharedIds = this.sharings.map(ss => ss.recipient.id);
        this.users = res.data.filter(ct => !selectedIds.includes(ct.id) && !sharedIds.includes(ct.id));
      },
(error: any) => {
        console.log('error', error);
      }
    );

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    $(document).ready(function() {
      $('.dropdown').on('show.bs.dropdown', function() {
        alert('The dropdown is about to be shown.');
      });
      $('.dropdown').on('shown.bs.dropdown', function() {
        alert('The dropdown is now fully shown.');
      });
      $('.dropdown').on('hide.bs.dropdown', function(e) {
        alert('The dropdown is about to be hidden.');
      });
      $('.dropdown').on('hidden.bs.dropdown', function() {
        alert('The dropdown is now fully hidden.');
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  open() {
    this.newUsers = [];
    this.deletedUsers = [];
    this.users = [];
    this.modal.open();
    this.loading = true;
    if (this.sharedObjects.length === 1) {
      this.apiBaseService.post(`note/sharings/get_sharing_info_object`, {object_id: this.sharedObjects[0].id, object_type: this.sharedObjects[0].object_type}).subscribe((res: any) => {
        this.store.dispatch({type: fromShareModal.SET_SHARED_SHARINGS, payload: res.data});
        if (res.data.length > 0) {
          this.mode = 'edit';
        }
        this.loading = false;
      });
    } else {
      this.store.dispatch({type: fromShareModal.SET_SHARED_SHARINGS, payload: []});
    }
  }

  close() {
    this.modal.close();
  }

  selectUser(user: any) {
    this.store.dispatch({type: fromShareModal.ADD_SELECTED_CONTACT, payload: user});
    this.newUsers.push({...user, permission: this.role.name});
  }

  deselectUser(user: any) {
    this.store.dispatch({type: fromShareModal.REMOVE_SELECTED_CONTACT, payload: user});
    const removedIndex = this.newUsers.map((item: any) => {
      return item.id;
    }).indexOf(user.id);
    this.newUsers.splice(removedIndex, 1);
  }

  remove(sharing: any) {
    sharing = {...sharing, _destroy: true};
    this.store.dispatch({type: fromShareModal.UPDATE_SHARING, payload: sharing});
    this.deletedUsers.push(sharing.recipient);
  }

  cancel() {
    this.store.dispatch({type: fromShareModal.CANCEL_ACTIONS});
    this.resetUserLists();
  }

  cancelRemove(sharing: any) {
    sharing = {...sharing, _destroy: null};
    this.store.dispatch({type: fromShareModal.UPDATE_SHARING, payload: sharing});
  }

  changeRole(role: any, sharing: any = null) {
    if (!sharing) {
      this.role = role;
    } else if (role.name !== sharing.permission) {
      sharing = {...sharing, permission: role.name};
      this.store.dispatch({type: fromShareModal.UPDATE_SHARING, payload: sharing});
      const updatedIndex = this.updatedUsers.map((item: any) => {
        return item.id;
      }).indexOf(sharing.recipient.id);
      if (updatedIndex < 0) {
        this.updatedUsers.push({...sharing.recipient, permission: role.name});
      } else {
        if (sharing.permission === role.name) {
          this.updatedUsers.splice(updatedIndex, 1);
        } else {
          this.updatedUsers[updatedIndex].permission = role.name;
        }
      }
    }
  }

  get updating(): boolean {
    return (this.updatedUsers.length + this.deletedUsers.length) > 0 ? true : false;
  }

  save() {
    if (this.mode === 'create') {
      this.store.dispatch({type: fromShareModal.SAVE});
      this.apiBaseService.post(`note/sharings`, {
        objects: this.sharedObjects,
        sharings: this.sharings,
        users: this.newUsers
      }).subscribe((res: any) => {
        if (res.data.length > 0) {
          this.mode = 'edit';
        }
        this.store.dispatch({type: fromShareModal.SET_SHARED_SHARINGS, payload: res.data});
        this.store.dispatch({type: fromShareModal.SAVE});
        if(this.sharedObjects.length > 1) {
          this.modal.close();
        }
      });
    } else {
      // Only update single object
      this.store.dispatch({type: fromShareModal.SAVE});
      for (let object of this.sharedObjects) {
        this.apiBaseService.put(`note/sharings/${object.id}`, {
          object: object,
          sharings: this.sharings,
          users: this.newUsers,
          deleted_users: this.deletedUsers,
          updated_users: this.updatedUsers
        }).subscribe((res: any) => {
          this.store.dispatch({type: fromShareModal.SET_SHARED_SHARINGS, payload: res.data});
          this.store.dispatch({type: fromShareModal.SAVE});
          this.resetUserLists();
        });
      }
    }
  }

  resetUserLists() {
    this.newUsers = [];
    this.updatedUsers = [];
    this.deletedUsers = [];
  }
}
