import { Pipe, PipeTransform } from '@angular/core';

// dateUntilNow
@Pipe({name: 'timeFormat'})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string, format: string = null): string {
    let now = new Date();
    let date = new Date(value);
    let timeDiff = Math.abs(now.getTime() - date.getTime());
    // Time Only
    if (format == 'time_only') {
      return this.timeOnly(date);
    }
    return this.defaultFormat(timeDiff);
  }

  defaultFormat(timeDiff:any) {
    var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    if (diffDays == 0) {
      return 'Today';
    }
    return diffDays + ' days ago';
  }

  timeOnly(date:any) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
}
