import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ZContactService } from '../services/contact.service';
import { Constants } from '../../../shared/constant/config/constants';
import { CommonEventService } from '@shared/services/common-event/common-event.service';
import { Contact } from '@contacts/contact/contact.model';

@Component({
  selector: 'z-contact-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZContactSharedListComponent {
  @Input() data: Contact[];
  @Input() showHeader: any = true;
  @Input() isStranger = false;
  @Input() contactsSortBy = 'first_name';
  @Output() itemSelected: EventEmitter<Contact> = new EventEmitter<Contact>();

  // descending: boolean = false;
  desc$: Observable<boolean>;
  // currentSort: string = 'name';

  readonly tooltip: any = Constants.tooltip;

  constructor(public contactService: ZContactService,
              private commonEventService: CommonEventService) {
    this.desc$ = this.contactService.orderDesc$;
  }

  onChecked(item: Contact) {
    item.selected = this.contactService.toggleSelectedObjects(item);
  }

  onItemSelected(item: Contact) {
    this.itemSelected.emit(item);
  }

  onSelectedAll() {
    if (this.contactService.isSelectAll()) {
      this.contactService.sendListToItem(false);
      this.contactService.selectAllObjects(false);
    } else {
      this.contactService.sendListToItem(true);
      this.contactService.selectAllObjects(true);
    }
  }

  doActionsToolbar(e: any) {
    // this.commonEventService.broadcast({ channel: Constants.contactEvents.actionsToolbar, action: e.action, payload: this.data });
    this.commonEventService.broadcast({ channel: Constants.contactEvents.actionsToolbar, action: e.action, payload: e.payload });
  }

  trackByGroup(index, group) {
    // console.log('trackByGroup ...');
    return group ? group.key : '';
  }

  trackByItem(index, item) {
    return item ? item.id : '' ;
  }
}
