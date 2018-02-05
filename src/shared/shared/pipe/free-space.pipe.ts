import { Pipe, PipeTransform } from '@angular/core';

/*
 * Changes the case of the first letter of a given number of words in a string.
 */

@Pipe({name: 'freeSpace', pure: false})
export class FreeSpacePipe implements PipeTransform {
  transform(input: string): string {
    return input.replace(/ /g,'');
  }
}
