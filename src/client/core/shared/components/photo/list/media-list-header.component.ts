import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../../config/constants';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-list-header',
  templateUrl: 'media-list-header.component.html',
  styleUrls: ['media-list-header.component.css']
})

export class MediaListHeaderComponent {
  @Input() data: any;
  @Input() viewOption: string;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  sortName: any = 'Date';
  sort: any = 'desc';

  sliderVal: number = Constants.mediaSliderViewNumber.default;
  sliderMin: number = Constants.mediaSliderViewNumber.min;
  sliderMax: number = Constants.mediaSliderViewNumber.max;

  handleChangeSliderVal(event: any) {
    this.sliderVal = event.value;
    this.outEvent.emit({action: 'slider', data: this.data, number: event.value});
  }

  setSortName(name: any) {
    this.sortName = name;
  }

  toggleSort() {
    if (this.sort == 'asc') {
      this.sort = 'desc';
    } else {
      this.sort = 'asc';
    }
  }

  doSort() {
    if (this.sortName == 'Date' || this.sortName == 'Month' || this.sortName == 'Year') {
      this.outEvent.emit({action: 'sort', data: {sort: this.sort, sort_name: 'created_at'}});
    } else {
      this.outEvent.emit({action: 'sort', data: {sort: this.sort, sort_name: this.sortName}});
    }
  }

  group(groupBy: any) {
    this.outEvent.emit({action: 'group', data: groupBy});
  }
}
