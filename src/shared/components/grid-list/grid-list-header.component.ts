import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../constant/config/constants';

declare var _: any;

@Component({
  selector: 'w-grid-list-header',
  templateUrl: 'grid-list-header.component.html',
  styleUrls: ['grid-list-header.component.scss']
})

export class WGridListHeaderComponent {
  @Input() data: any;
  @Input() view: string;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  field: any = 'Date';
  direction: any = 'asc';
  groupBy = 'Date';
  sliderVal: number = Constants.mediaSliderViewNumber.default;
  sliderMin: number = Constants.mediaSliderViewNumber.min;
  sliderMax: number = Constants.mediaSliderViewNumber.max;

  zoom(event: any) {
    this.sliderVal = event.value;
    this.event.emit({action: 'zoom', payload: { viewSize: event.value }});
  }


  sort(field: string, direction: string = 'asc', groupBy: string = '') {
    // if (this.view !== 'list') {
    //   this.field = 'Date';
    // }
    if (field === this.field) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      // return;
    } else {
      this.field = field;
    }

    if (this.field === 'Date' || this.field === 'Month' || this.field === 'Year') {
      this.event.emit({action: 'sort', payload: {queryParams: {sort: this.direction, sort_name: 'created_at'}}});
    } else {
      this.event.emit({action: 'sort',
        payload: {queryParams: {sort: this.direction, sort_name: this.field.toLowerCase()}}});
    }
  }

  changeView(view: string, groupBy: string) {
    this.groupBy = groupBy;
    this.event.emit({action: 'changeView', payload: { view: view, groupBy: groupBy.toLowerCase() }});
  }
}
