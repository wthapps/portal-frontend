import { Pipe, PipeTransform } from '@angular/core';

/*
 *
 */
@Pipe({name: 'showLength'})
export class ShowLengthTransformPipe implements PipeTransform {
  transform(value: string, args: string[]): any {
    if (value) {
      // console.log(value);
      let value_length = value;
      return value_length.length;
    } else {
      return 0;
    }
  }
}
