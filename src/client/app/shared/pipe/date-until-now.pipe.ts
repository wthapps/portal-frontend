import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dateUntilNow'})
export class DateUntilNowPipe implements PipeTransform {
  transform(value: string, exponent: string): string {
    let now = new Date();
    let date = new Date(value);
    var timeDiff = Math.abs(now.getTime() - date.getTime());
    var diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    if (diffDays == 0) {
      return 'Today';
    }
    return diffDays + ' days ago';
  }
}
