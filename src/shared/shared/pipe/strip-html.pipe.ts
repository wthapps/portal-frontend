import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts urlTransform into http:// or https://
 */
@Pipe({ name: 'stripHtml' })
export class StripHtmlPipe implements PipeTransform {
  transform(myString: string): any {
    return myString.replace(/<(?:.|\n)*?>/gm, '');
  }
}
