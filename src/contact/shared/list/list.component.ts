import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ZContactService } from '../services/contact.service';
import { Constants } from '../../../shared/constant/config/constants';
import { CommonEventService } from '@shared/services/common-event/common-event.service';

@Component({
  selector: 'z-contact-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZContactSharedListComponent {
  @Input() data: any;
  @Input() showHeader: any = true;

  // descending: boolean = false;
  desc$: Observable<boolean>;
  currentSort: string = 'name';

  tooltip: any = Constants.tooltip;

  constructor(public contactService: ZContactService,
              private commonEventService: CommonEventService) {
    this.desc$ = this.contactService.orderDesc$;
  }

  onSort(event: any) {
    if (this.currentSort == event) {
      // this.descending = !this.descending;
      this.contactService.changeSortOption();
    } else {
      this.contactService.changeSortOption('asc');
      this.currentSort = event;
    }
    return false;
  }

  onSelected(item: any) {
    item.selected = this.contactService.toggleSelectedObjects(item);
  }

  onSelectedAll() {
    if (this.contactService.isSelectAll()) {
      this.contactService.sendListToItem(false);
      this.contactService.selectAllObjects(false);
      // this.contactService.selectedObjects.length = 0;
    } else {
      this.contactService.sendListToItem(true);
      this.contactService.selectAllObjects(true);
    }
  }

  trackItem(index: any, item: any) {
    return item ? item.id : undefined;
  }

  doActionsToolbar(e: any) {
    // this.commonEventService.broadcast({ channel: Constants.contactEvents.actionsToolbar, action: e.action, payload: this.data });
    this.commonEventService.broadcast({ channel: Constants.contactEvents.actionsToolbar, action: e.action, payload: e.payload });
  }
}
