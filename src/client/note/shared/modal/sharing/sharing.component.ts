import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { Constants } from '../../../../core/shared/config/constants';
import { ZMediaSharingService } from '../../../../core/shared/components/photo/modal/sharing/sharing.service';
import { Store } from '@ngrx/store';
import * as fromShareModal from '../../reducers/share-modal';
import { AutoComplete } from 'primeng/primeng';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-modal-sharing',
  templateUrl: 'sharing.component.html',
  styleUrls: ['sharing.component.css']
})

export class ZNoteSharedModalSharingComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
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
  sharedContacts: any = [];
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
              private mediaSharingService: ZMediaSharingService) {
    this.subscription = store.select('share').subscribe((state: any) => {
      this.selectedContacts = state.current.selectedContacts;
      this.sharedContacts = state.current.sharedContacts;
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
        this.store.dispatch({type: fromShareModal.SET_SHARED_CONTACTS, payload: res.data});
        if (res.data.length > 0) {
          this.mode = 'edit';
        }
      });
    } else {
      this.store.dispatch({type: fromShareModal.SET_SHARED_CONTACTS, payload: []});
    }
  }

  close() {
    this.modal.close();
  }

  selectContact(contact: any) {
    this.store.dispatch({type: fromShareModal.ADD_SELECTED_CONTACT, payload: contact});
  }

  remove(contact: any) {
    this.store.dispatch({type: fromShareModal.REMOVE_SHARED_CONTACT, payload: contact});
  }

  removeSelected(contact: any) {
    this.store.dispatch({type: fromShareModal.REMOVE_SELECTED_CONTACT, payload: contact});
  }

  cancel() {
    this.store.dispatch({type: fromShareModal.CANCEL_ACTIONS});
  }

  cancelRemove(contact: any) {
    this.store.dispatch({type: fromShareModal.CANCEL_REMOVE_SHARED_CONTACT, payload: contact});
  }

  save() {
    if(this.mode == 'create') {
      this.store.dispatch({type: fromShareModal.SAVE});
      this.apiBaseService.post(`note/sharings`, {objects: this.sharedObjects, recipients: this.sharedContacts}).subscribe((res: any) => {
        if (res.data.length > 0) {
          this.mode = 'edit';
        }
      });
    } else {
      // Only update single object
      this.store.dispatch({type: fromShareModal.SAVE});
      for (let object of this.sharedObjects) {
        this.apiBaseService.put(`note/sharings/${object.id}`, {object: object, recipients: this.sharedContacts}).subscribe((res: any) => {
          this.store.dispatch({type: fromShareModal.SET_SHARED_CONTACTS, payload: res.data});
          this.store.dispatch({type: fromShareModal.SAVE});
        });
      }
    }
  }
}
