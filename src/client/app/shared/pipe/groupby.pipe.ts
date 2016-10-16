import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
  // transform(value: Array<any>, field: string): Array<any> {
  //   console.log(value, field);
  //   return [];
  // }
  transform( collection: Object[] , term: string ) {

    let newValue = Array<any>();

    for (let i = 0; i < collection.length; i++) {
      let keyVal = GroupByPipe.deepFind(collection[i], term);
      let index = newValue.findIndex(myObj => myObj.key == keyVal);
      if (index >= 0) {
        newValue[index].value.push(collection[i]);
      } else {
        newValue.push({key: keyVal, value: [collection[i]]});
      }
    }
    return newValue;

  }

  static deepFind(obj:any, path:any) {

    var paths = path.toString().split(/[\.\[\]]/);
    var current = obj;

    for (let i = 0; i < paths.length; ++i) {
      if (paths[i] !== "") {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
    }
    return current;

  }
}

