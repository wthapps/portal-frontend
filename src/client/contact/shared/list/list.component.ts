import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ZContactService } from '../services/contact.service';
import { Constants } from '../../../core/shared/config/constants';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ZContactSharedListComponent {
  @Input() data: any;

  // descending: boolean = false;
  desc$: Observable<boolean>;
  currentSort: string = 'name';

  tooltip: any = Constants.tooltip;

  constructor(public contactService: ZContactService) {
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
    // this.data = _.orderBy(this.data, [this.currentSort], [(this.descending ? 'desc' : 'asc')]);


    return false;
  }

  onSelectedAll() {
    if (this.contactService.isSelectAll()) {
      this.contactService.sendListToItem(false);
      this.contactService.selectedObjects.length = 0;
    } else {
      this.contactService.sendListToItem(true);
      this.contactService.selectedObjects.length = 0;

      _.map(this.data, (v: any)=> {
        this.contactService.selectedObjects.push(v);
      });
    }
  }

  trackItem(index: any, item: any) {
    return item ? item.id : undefined;
  }

}
