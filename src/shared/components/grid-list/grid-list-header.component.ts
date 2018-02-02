import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../constant/config/constants';

declare var _: any;

@Component({
  selector: 'grid-list-header',
  templateUrl: 'grid-list-header.component.html',
  styleUrls: ['grid-list-header.component.scss']
})

export class GridListHeaderComponent {
  @Input() data: any;
  @Input() viewOption: string;
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  field: any = 'Date';
  direction: any = 'asc';

  sliderVal: number = Constants.mediaSliderViewNumber.default;
  sliderMin: number = Constants.mediaSliderViewNumber.min;
  sliderMax: number = Constants.mediaSliderViewNumber.max;

  zoom(event: any) {
    this.sliderVal = event.value;
    this.events.emit({action: 'zoom', data: this.data, number: event.value});
  }


  sort(field: string, direction: string = '', groupBy: string = '') {
    if (this.viewOption !== 'list') {
      this.field = 'Date';
    }
    if (field === this.field) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
      // return;
    } else {
      this.field = field;
    }


    if (this.field === 'Date' || this.field === 'Month' || this.field === 'Year') {
      this.events.emit({action: 'sort', data: {sort: this.direction, sort_name: 'created_at'}});
    } else {
      this.events.emit({action: 'sort', data: {sort: this.direction, sort_name: this.field}});
    }
  }

  group(groupBy: any) {
    this.events.emit({action: 'group', data: groupBy});
  }
}
