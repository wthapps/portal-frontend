import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'groupByMonthYear'})
export class GroupByMonthYearPipe implements PipeTransform {
  transform(collection: Array<any>, term: string) {

    let newValue = Array<any>();
    for (let i = 0; i < collection.length; i++) {
      let keyVal = GroupByMonthYearPipe.deepFind(collection[i], term);
      let index = newValue.findIndex(myObj => myObj.key == keyVal);
      if (index >= 0) {
        newValue[index].value.push(collection[i]);
      } else {
        newValue.push({key: keyVal, value: [collection[i]]});
      }
    }
    return newValue;

  }

  static deepFind(obj: any, path: any) {

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
          current = monthNames[date.getMonth()] + '-' + date.getFullYear();
        }
      }
    }
    return current;

  }
}

