import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts urlTransform into http:// or https://
 */
@Pipe({ name: 'arrayLength' })
export class ArrayLengthPipe implements PipeTransform {
  transform(collection: Object[]): any {
    return collection.length;
  }
}
