import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { Constants } from '@shared/constant/config/constants';
import { SharingService } from '@shared/../../../../media/shared/modal/sharing/sharing.service';
import { Store } from '@ngrx/store';
import * as fromShareModal from '../../reducers/share-modal';
import { AutoComplete } from 'primeng/primeng';


declare var $: any;

@Component({
  selector: 'z-note-shared-modal-sharing',
  templateUrl: 'sharing.component.html',
  styleUrls: ['sharing.component.scss']
})

export class ZNoteSharedModalSharingComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('auto') auto: AutoComplete;

  operation: any = {
    read: 0,
    edit: 2,
    editing: 20,
    create: 1,
    creating: 10,
    delete: 9,
    deleting: 90
  };

  filteredContacts: any = [];
  selectedContacts: any = [];
  sharedSharings: any = [];
  sharedObjects: any = [];
  subscription: any;
  changed: boolean = false;
  showCancelButton: boolean = false;
  mode: string = 'create';

  contactTerm$ = new Subject<string>();

  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(private commonEventService: CommonEventService,
              private apiBaseService: ApiBaseService,
              private store: Store<any>,
              private mediaSharingService: SharingService) {
    this.subscription = store.select('share').subscribe((state: any) => {
      this.selectedContacts = state.current.selectedContacts;
      this.sharedSharings = state.current.sharedSharings;
      this.changed = state.changed;
      this.showCancelButton = state.showCancelButton;
      if(this.auto) {
        this.auto.value = this.selectedContacts;
        this.auto.onModelChange(this.auto.value);
      }
    });
    this.contactTerm$
      .debounceTime(Constants.searchDebounceTime)
      .distinctUntilChanged()
      .switchMap((term: any) => this.mediaSharingService.getContacts(term.query))
      .subscribe((res: any) => {
          console.log(res)

          this.filteredContacts = [];
          for(let i in res.data) {
            if(res.data[i].wthapps_user) {
              this.filteredContacts.push(res.data[i].wthapps_user);
            }
          }
        }, (error: any)=> {
          console.log('error', error);
        }
      );

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  open() {
    this.modal.open();
    if (this.sharedObjects.length == 1) {
      this.apiBaseService.post(`note/sharings/get_sharing_info_object`, {object_id: this.sharedObjects[0].id, object_type: this.sharedObjects[0].object_type}).subscribe((res: any) => {
        this.store.dispatch({type: fromShareModal.SET_SHARED_SHARINGS, payload: res.data});
        if (res.data.length > 0) {
          this.mode = 'edit';
        }
      });
    } else {
      this.store.dispatch({type: fromShareModal.SET_SHARED_SHARINGS, payload: []});
    }
  }

  close() {
    this.modal.close();
  }

  selectContact(contact: any) {
    this.store.dispatch({type: fromShareModal.ADD_SELECTED_CONTACT, payload: contact});
  }

  remove(sharing: any) {
    sharing = {...sharing, _destroy: true};
    this.store.dispatch({type: fromShareModal.UPDATE_SHARING, payload: sharing});
  }

  removeSelected(contact: any) {
    this.store.dispatch({type: fromShareModal.REMOVE_SELECTED_CONTACT, payload: contact});
  }

  cancel() {
    this.store.dispatch({type: fromShareModal.CANCEL_ACTIONS});
  }

  cancelRemove(sharing: any) {
    sharing = {...sharing, _destroy: null};
    this.store.dispatch({type: fromShareModal.UPDATE_SHARING, payload: sharing});
  }

  changePermission(sharing: any, permission: any) {
    sharing = {...sharing, permission: permission};
    this.store.dispatch({type: fromShareModal.UPDATE_SHARING, payload: sharing});
  }

  save() {
    if(this.mode == 'create') {
      this.store.dispatch({type: fromShareModal.SAVE});
      this.apiBaseService.post(`note/sharings`, {objects: this.sharedObjects, sharings: this.sharedSharings}).subscribe((res: any) => {
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
        this.apiBaseService.put(`note/sharings/${object.id}`, {object: object, sharings: this.sharedSharings}).subscribe((res: any) => {
          this.store.dispatch({type: fromShareModal.SET_SHARED_SHARINGS, payload: res.data});
          this.store.dispatch({type: fromShareModal.SAVE});
        });
      }
    }
  }
}
