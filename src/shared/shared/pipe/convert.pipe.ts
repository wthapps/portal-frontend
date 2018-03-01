import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'convertByPattern'})
export class ConvertByPatternPipe implements PipeTransform {
  transform(collection: Array<any>, term: string, pattern: string, detectChange: any = 0) {
    if (!term || !pattern || term == '' || pattern == '') {
      return collection;
    }
    let newValue = Array<any>();
    for (let i = 0; i < collection.length; i++) {
      let ob = this.deepFind(collection[i], term, pattern);
      newValue.push(ob);
    }
    return newValue;
  }

  private deepFind(obj: any, path: any, pattern: string) {
    var paths = path.toString().split(/[\.\[\]]/);
    var current = obj;

    for (let i = 0; i < paths.length; ++i) {
      if (paths[i] !== '') {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          if (path == 'created_at') {
            let date = new Date(current[paths[i]]);
            current[paths[i] + '_converted'] = this.formatDate(date, pattern);
          }
          //  Write others code here
          //   .......
        }
      }
    }
    return current;
  }

  private formatDate(date: any, pattern: string) {
    let current = '';
    let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    if (pattern == 'date') {
      current = date.getDate() + '-' + monthNames[date.getMonth()] + '-' + date.getFullYear();
    }
    if (pattern == 'month') {
      current = monthNames[date.getMonth()] + '-' + date.getFullYear();
    }
    if (pattern == 'year') {
      current = date.getFullYear();
    }
    return current;
  }
}

