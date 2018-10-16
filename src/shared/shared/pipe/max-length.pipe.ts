import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts urlTransform into http:// or https://
 */
@Pipe({ name: 'maxLength' })
export class MaxLengthPipe implements PipeTransform {
  transform(str: string = '', length: number): any {
    if (str && str.length > length) {
      str = str.substr(0, length);
      str += ' ...';
    }
    return str;
  }
}
