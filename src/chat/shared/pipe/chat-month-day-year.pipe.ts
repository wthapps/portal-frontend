import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'groupByDayMonthYear'})
export class ChatMonthDayYearPipe implements PipeTransform {
  currentDate:any;
  groupId:any;

  transform(message: any, term: string) {
    let date = this.deepFind(message, term);
    if(date != this.currentDate || this.groupId != message.group_id) {
      this.groupId = message.group_id;
      this.currentDate = date;
      return this.currentDate;
    }
    return null;
  }

  private deepFind(obj: any, path: any) {

    var paths = path.toString().split(/[\.\[\]]/);
    var current = obj;

    for (let i = 0; i < paths.length; ++i) {
      if (paths[i] !== '') {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          // current = current[paths[i]];
          let date = new Date(current[paths[i]]);
          let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          // Nov 21 2016
          current = monthNames[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
        }
      }
    }
    return current;

  }
}

