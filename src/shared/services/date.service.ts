import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  getTimeString(date:Date) {
    let s = '';
    if (date) {
      s = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
    return s;
  }

}
