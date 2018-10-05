import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts urlTransform into http:// or https://
 */
@Pipe({ name: 'maxLength' })
export class MaxLengthPipe implements PipeTransform {
  transform(string: string = '', length: number): any {
    if (string.length > length) {
      string = string.substr(0, length);
      string += ' ...';
    }
    return string;
  }
}
