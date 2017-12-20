import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({name: 'timeFormat'})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string, format: string = 'default'): string {
    switch(format) {
      case 'day':
        return this.dayFormat(value);
      case 'second':
        return moment(value).fromNow();
      case 'time_only':
        return this.timeOnly(value);
      default:
        return this.defaultFormat(value);
    }
  }

  dayFormat(value: any) {
    return moment(value).calendar(moment(), {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      lastDay: '[Yesterday]',
      sameElse: 'MM DD YYYY'
    });
  }

  defaultFormat(value: any) {
    if (moment(value).isSame(moment(), 'day')) {
      return moment(value).fromNow();
    } else {
      return moment(value).calendar(moment(), {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        lastDay: '[Yesterday]',
        sameElse: 'MM DD YYYY'
      });
    }
  }

  timeOnly(value: any) {
    return moment(value).format('h:mm a');
  }
}
