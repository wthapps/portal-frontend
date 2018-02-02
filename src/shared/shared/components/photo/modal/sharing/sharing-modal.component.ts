import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ZMediaSharingService } from './sharing.service';
import { Constants } from '../../../../../constant/config/constants';
import { ApiBaseService } from '../../../../../services/apibase.service';
import { Router } from '@angular/router';
import { WthConfirmService } from '../../../confirmation/wth-confirm.service';
import { CommonEventService } from '../../../../../services/common-event/common-event.service';

declare var $: any;
declare var _: any;

@Component({
  selector: 'sharing-modal',
  templateUrl: 'sharing-modal.component.html',
  styleUrls: ['sharing-modal.component.scss']
})
export class SharingModalComponent implements OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
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
  hasChanged: boolean = false;
  sharing: any;

  contactTerm$ = new Subject<string>();

  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(private mediaSharingService: ZMediaSharingService,
    private apiBaseService: ApiBaseService,
    private router: Router,
    private commonEventService: CommonEventService,
    private wthConfirmService: WthConfirmService) {

    this.contactTerm$
      .debounceTime(Constants.searchDebounceTime)
      .distinctUntilChanged()
      .switchMap((term: any) => this.mediaSharingService.getContacts(term.query))
      .subscribe((res: any) => {
          this.filteredContacts = res['data'];
        }, (error: any)=> {
          console.log('error', error);
        }
      );
  }

  ngOnDestroy() {
    this.contactTerm$.unsubscribe();
  }

  open(options: any) {
    if(options.sharing) {
      this.modal.open();
      this.sharedContacts = options.recipients;
      this.sharing = options.sharing;
    } else {
      this.selectedItems = options['selectedObjects'];
      this.modal.open(options).then((res: any) => this.getShared());
    }
  }

  close(options?: any) {
    // cancel removing items
    if (this.mode == this.operation.editing || this.mode == this.operation.deleting) {
      this.removedContacts = [];
      this.mode = this.operation.read;
      return;
    }
    this.modal.close().then();
  }

  getShared() {
    let body = {objects: _.map(this.selectedItems, 'id')};

    this.mediaSharingService.getShared(body).take(1).subscribe((response: any) => {
      this.sharedContacts = response.data;
    });
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
    console.log(this.mode)
    // create new sharing with selected contacts
    if (this.mode == this.operation.creating) {
      let body = {
        objects: _.map(this.selectedItems, (item: any) => {
          return {id: item.id, object_type: item.object_type};
        }),
        recipients: _.map(this.selectedContacts, 'id')
      };

      // Only subscribe to this action once`
      this.mediaSharingService.add(body).take(1).subscribe((response: any) => {
          this.sharedContacts.push(...this.selectedContacts);
          this.resetData();
          this.updateSelectedItems({contacts: this.sharedContacts});
        },
        (error: any) => {
          console.log('error', error);
        });
    }

    if (!this.sharing && this.mode == this.operation.editing) {

      let body = {
        multiple: true,
        objects: _.map(this.selectedItems, 'id'),
        recipients: _.xor(_.concat(_.map(this.sharedContacts, 'id'),
          _.map(this.selectedContacts, 'id')), this.removedContacts)
      };

      this.mediaSharingService.update(body).take(1).subscribe(
        (response: any) => {
          this.sharedContacts = response.data;
          this.resetData();
          this.updateSelectedItems({contacts: this.sharedContacts});
          this.event.emit({action: 'media:photo:update_recipients', payload: {data: this.sharedContacts}});
        },
        (error: any) => {
          console.log('error', error);
        });
    }

    if (this.sharing && this.mode == this.operation.editing) {
      let body = {
        id: this.sharing.id,
        recipients: _.xor(_.concat(_.map(this.sharedContacts, 'id'),
          _.map(this.selectedContacts, 'id')), this.removedContacts)
      };
      if (body.recipients.length == 0) {
        this.modal.close();
        this.wthConfirmService.confirm({
          header: "Stop sharing & delete",
          message: "You removed all members from this sharing. If you stop sharing now, you'll delete it permanently. You photos remain in your library.",
          accept: () => {
            this.apiBaseService.post(`media/sharings/destroy`, {ids: [this.sharing.id]}).subscribe((res: any) => {
              this.router.navigate([{outlets: {detail: null}}]);
              setTimeout(() => {this.router.navigate([], {queryParams: {r: new Date().getTime()}})}, 200);
            });
          }
        })

      } else {
        this.apiBaseService.post(`media/sharings/update_attributes`, body).subscribe((res: any) => {
          this.sharedContacts = res.recipients;
          this.resetData();
          this.updateSelectedItems({contacts: this.sharedContacts});
          this.commonEventService.broadcast({channel: 'media:photo:update_recipients', payload: this.sharedContacts});
        });
      }
    }

    if (this.mode == this.operation.read) {
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
    this.mode = this.operation.read;
    this.hasChanged = false;
    this.removedContacts = [];
    this.selectedContacts = [];
    this.textContacts = [];
  }

  private setMode() {
    let count = this.removedContacts.length + this.selectedContacts.length;
    if (count == 0) {
      this.mode = this.operation.read;
    } else if (count > 0) {
      this.mode = this.selectedContacts.length > 0 ? this.operation.creating : this.operation.editing;
    }
    this.hasChanged = this.mode != this.operation.read ? true : false;
  }

}
