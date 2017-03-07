import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts urlTransform into http:// or https://
 */
@Pipe({ name: 'urlTransform' })
export class UrlTransformPipe implements PipeTransform {
  transform(value: string, args: string[]): any {

    if (value.indexOf('http://') !== 0 || value.indexOf('https://') !== 0) {
      value = 'http://' + value;
    }
    return value;

  }
}
