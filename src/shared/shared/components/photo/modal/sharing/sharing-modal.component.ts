import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';


import { SharingService } from './sharing.service';
import { ApiBaseService, CommonEventService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
declare var $: any;
declare var _: any;

@Component({
  selector: 'sharing-modal',
  templateUrl: 'sharing-modal.component.html',
  styleUrls: ['sharing-modal.component.scss']
})
export class SharingModalComponent implements OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() selectedItems: any = [];
  @Input() type: string;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  mode: number = 0;
  operation: any = {
    read: 0,
    edit: 2,
    editing: 20,
    create: 1,
    creating: 10,
    delete: 9,
    deleting: 90
  };


  contacts: any = [];
  contactGroups: any = [];
  sharedContacts: any = [];

  textContacts: Array<any> = [];
  filteredContacts: any = [];

  selectedContacts: any = [];
  removedContacts: any = [];
  roles: any = [];
  role: any = {name: 'view', display_name: 'View'};
  hasChanged = false;
  deleting = false;
  sharing: any = null;

  contactTerm$ = new Subject<string>();

  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(
    private mediaSharingService: SharingService,
    private apiBaseService: ApiBaseService,
    private router: Router,
    private commonEventService: CommonEventService,
    private wthConfirmService: WthConfirmService,
    private toastsService: ToastsService
  ) {

    this.contactTerm$.pipe(
      debounceTime(Constants.searchDebounceTime),
      distinctUntilChanged(),
      switchMap((term: any) => this.mediaSharingService.getRecipients(term.query))
      ).subscribe((res: any) => {
          const selectedContactIds = this.selectedContacts.map(ct => ct.id);
          const sharedContactIds = this.sharedContacts.map(sc => sc.id);
          this.filteredContacts = res['data'].filter(ct => !selectedContactIds.includes(ct.id) && !sharedContactIds.includes(ct.id));
        }, (error: any) => {
          console.log('error', error);
        }
      );
  }

  ngOnDestroy() {
    this.contactTerm$.unsubscribe();
  }

  /**
   * Open sharing modal
   * @param options
   * @value
   */
  open(options: any) {
    this.mode = options.mode || this.operation.create;
    this.sharedContacts = options.recipients || [];
    this.selectedItems = options.selectedObjects || [];
    this.sharing = options.sharing || {
      name: '',
      role_id: 1,
      objects: [],
      recipients: []
    };

    if (this.selectedItems.length > 0 && this.selectedItems[0].object_type === 'album') {
      this.apiBaseService.get(`media/albums/${this.selectedItems[0].uuid}/share`)
        .subscribe(response => {
          this.sharing = response.data;
          this.mode = this.operation.edit;
          this.getRecipients();
        }, error => {
          this.mode = this.operation.create;
        });
    }

    this.modal.open(options).then((res: any) => {
      if (this.mode !== this.operation.create) {
        // this.getShared();
        this.getRecipients();
      }
      this.getRoles();
    });
  }

  close(options?: any) {
    // cancel removing items
    if (this.mode === this.operation.editing || this.mode === this.operation.deleting) {
      this.removedContacts = [];
      return;
    }
    this.modal.close().then();
  }

  getRoles() {
    if (!this.roles.length) {
      this.apiBaseService.get('common/roles', {module_name: 'Media'}).subscribe((response) => {
        this.roles = response.data.sort((a, b) => a.id - b.id);
        if (!!this.sharing) {
          this.role = this.roles.filter(r => r.id === this.sharing.role_id)[0];
        }
      });
    }
  }

  getShared() {
    let body = {objects: _.map(this.selectedItems, 'id')};

    this.mediaSharingService.getShared(body).take(1).subscribe((response: any) => {
      this.sharedContacts = response.data;
    });
  }

  getRecipients() {
    this.apiBaseService.get(`media/sharings/${this.sharing.uuid}/recipients`).subscribe((response) => {
      this.sharedContacts = response.data;
    });
  }

  changeRole(role: any) {
    if (this.role.id === role.id) {
      return;
    }
    this.role = this.roles.filter(r => r.id === role.id)[0];
    if (this.mode === this.operation.create) {
      this.hasChanged = this.selectedContacts.length > 0 ? true : false;
    } else {
      this.hasChanged = true;
    }
  }

  toggleRemoving(event: any, id: number) {
    event.preventDefault();
    let index = this.removedContacts.indexOf(id);
    if (index != -1) {
      this.removedContacts.splice(index, 1);
    } else {
      this.removedContacts.push(id);
    }

    this.setMode();
  }

  isDeletedItem(id: number): boolean {
    return this.removedContacts.indexOf(id) >= 0 ? true : false;
  }

  save() {
    let body: any;
    if (this.mode === this.operation.create && !this.selectedItems && this.selectedItems.length === 0) {
      return;
    }

    if (this.mode === this.operation.edit && !this.sharing) {
      return;
    }
    // create new sharing with selected items and recipients
    if (this.mode === this.operation.create) {
      if (this.selectedItems[0].object_type == 'album') {
        this.selectedItems.forEach((item: any) => {
          body = {
            role_id: this.role.id,
            objects: [item],
            recipients: _.map(this.selectedContacts, 'id')
          };
          this.mediaSharingService.create(body).take(1).subscribe((response: any) => {
            this.showMessage();
            this.sharedContacts.push(...this.selectedContacts);
              this.resetData();
              this.updateSelectedItems({contacts: this.sharedContacts});
              this.commonEventService.broadcast({channel: 'media:photo:update_recipients', payload: this.sharedContacts});
              this.modal.close();
            },
            (error: any) => {
              console.log('error', error);
            });
        });
      } else {
          body = {
            role_id: this.role.id,
            objects: _.map(this.selectedItems, (item: any) => {
              return {id: item.id, object_type: item.object_type};
            }),
            recipients: _.map(this.selectedContacts, 'id')
          };
        // Only subscribe to this action once`
        this.mediaSharingService.create(body).take(1).subscribe((response: any) => {
          this.showMessage();
          this.sharedContacts.push(...this.selectedContacts);
            this.resetData();
            this.updateSelectedItems({contacts: this.sharedContacts});
            this.commonEventService.broadcast({channel: 'media:photo:update_recipients', payload: this.sharedContacts});
            this.modal.close();
          },
          (error: any) => {
            console.log('error', error);
          });
      }


    } else if (this.mode === this.operation.edit) {
      let body = {
        id: this.sharing.id,
        role_id: this.role.id,
        recipients: _.xor(_.concat(_.map(this.sharedContacts, 'id'),
          _.map(this.selectedContacts, 'id')), this.removedContacts)
      };
      if (body.recipients.length === 0) {
        this.modal.close();
        this.event.emit({
              action: 'deleteMedia',
              payload: {
                selectedObjects: [this.sharing],
                header: 'Delete recipient',
                message: 'You are removing all of recipients on this sharing. This will also delete the shared permanently.'
              }
        });
      } else {
        this.apiBaseService.post(`media/sharings/update_attributes`, body).subscribe((res: any) => {
          this.showMessage('You have just updated share successful');
          this.sharedContacts = res.recipients;
          this.sharing.role_id = this.role.id;
          this.resetData();
          this.updateSelectedItems({contacts: this.sharedContacts});
          this.commonEventService.broadcast({channel: 'media:photo:update_recipients', payload: this.sharedContacts});
        });
      }
    }

    if (this.mode === this.operation.read) {
      this.modal.close().then(() =>
        console.log('Item shared')
      );
    }
  }

  // Update sharing info for selected items
  updateSelectedItems(properties: any) {
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (!_.isEmpty(this.selectedItems[i].json_shares)) {
        _.extend(this.selectedItems[i].json_shares, properties);
      } else {
        this.selectedItems[i].json_shares = properties;
      }
    }
  }

  cancel() {
    this.resetData();
  }

  selectContact(contact: any) {
    this.selectedContacts.push(contact);
    this.hasChanged = true;
    this.setMode();
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
    this.setMode();

  }

  searchContact(event: any) {
    this.filteredContacts = _.filter(this.contacts,
      (c: any) => {
        return c['name'].toLowerCase().indexOf(event.query) != -1;
      });
  }

  private resetData() {
    this.deleting = false;
    this.hasChanged = false;
    this.removedContacts = [];
    this.selectedContacts = [];
    this.textContacts = [];
    this.role = this.roles.filter(r => r.id === this.sharing.role_id)[0];
  }

  private setMode() {
    const count = this.removedContacts.length + this.selectedContacts.length;
    this.deleting = this.removedContacts.length > 0 ? true: false;
    if (this.mode === this.operation.create) {
      this.hasChanged = count > 0 ? true: false;
    } else {
      this.hasChanged = this.mode != this.operation.read ? true : false;
    }
  }

  private showMessage(message: string = 'You have just created share successful') {
    this.toastsService.success(message);
  }

}
