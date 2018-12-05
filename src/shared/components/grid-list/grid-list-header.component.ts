import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../constant/config/constants';
import { LocalStorageService } from 'angular-2-local-storage';

declare var _: any;

@Component({
  selector: 'w-grid-list-header',
  templateUrl: 'grid-list-header.component.html',
  styleUrls: ['grid-list-header.component.scss']
})

export class WGridListHeaderComponent {
  @Input() data: any;
  @Input() view: string;
  @Input() field: string;
  @Input() hideScale: boolean = false;
  @Input() direction: string;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  groupBy = 'Date';
  sliderVal: number = Constants.mediaSliderViewNumber.default;
  sliderMin: number = Constants.mediaSliderViewNumber.min;
  sliderMax: number = Constants.mediaSliderViewNumber.max;

  /**
   *
   */
  constructor(private localStorageService: LocalStorageService) {
    this.sliderVal = localStorageService.get('media_slider_val') || Constants.mediaSliderViewNumber.default;
  }

  zoom(event: any) {
    this.sliderVal = event.value;
    this.localStorageService.add('media_slider_val', this.sliderVal);
    this.event.emit({action: 'zoom', payload: { viewSize: event.value }});
  }


  sort(field: string, groupBy: string = '') {
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
      return;
    } else {
      this.event.emit({action: 'sort',
        payload: {queryParams: {sort: this.direction, sort_name: this.field}}});
    }
  }

  changeView(view: string, groupBy: string) {
    this.groupBy = groupBy;
    this.event.emit({action: 'changeView', payload: { view: view, groupBy: groupBy.toLowerCase() }});
  }
}
