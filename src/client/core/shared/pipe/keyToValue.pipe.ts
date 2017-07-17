/**
 * converting 'work_out' to 'Work Out'
 *
 * obj: any = [
 {
   type: 'work_out',
   name: 'Work Out'
 }
 ];

 * {{'work' | keyToValue:obj:'type':'name'}}
 *
 */


import { Pipe, PipeTransform } from '@angular/core';

declare var _: any;

@Pipe({
  name: 'keyToValue'
})
export class KeyToValuePipe implements PipeTransform {

  transform(key: any, obj: any, objKey: any, objValue: any): any {
    // console.log(key, obj, objKey, objValue);

    let newObj: any = _.find(obj, [objKey, key]);
    if (newObj && newObj[objValue]) {
      return newObj[objValue];
    }
    return "";
  }
}
