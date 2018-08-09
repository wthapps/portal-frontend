import { Component, Input, ViewEncapsulation, OnChanges } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ZContactService } from '../../services/contact.service';
import { Constants } from '../../../../shared/constant/config/constants';

@Component({
  selector: 'z-contact-shared-list-v1',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZContactSharedListV1Component implements OnChanges{
  @Input() data: any;
  @Input() showHeader: any = true;
  @Input() selectedAll = false;

  // descending: boolean = false;
  desc$: Observable<boolean>;
  currentSort = 'name';

  tooltip: any = Constants.tooltip;

  constructor(public contactService: ZContactService) {
    this.desc$ = this.contactService.orderDesc$;
  }

  ngOnChanges() {
    // if (this.data.every(d => d.selected)) this.selectedAll = true;
  }

  onSort(event: any) {
    if (this.currentSort === event) {
      this.contactService.changeSortOption();
    } else {
      this.contactService.changeSortOption('asc');
      this.currentSort = event;
    }
    return false;
  }

  onSelectedAll() {
    if (this.data.every(d => d.selected)) {
      this.contactService.selectedObjects = [];
      this.data = this.data.map(d => {d.selected = false; return d});
      this.selectedAll = false;
    } else {
      this.data = this.data.map(d => { d.selected = true; return d});
      this.contactService.selectedObjects = [...this.data];
      this.selectedAll = true;
    }
  }

  trackItem(index: any, item: any) {
    return item ? item.id : undefined;
  }
}
