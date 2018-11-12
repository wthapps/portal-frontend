import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert number to maximum threshold. Ex: 99 => 10+
 */
const DEFAULT_MAX = 10;

@Pipe({ name: 'maxCount' })
export class MaxCountPipe implements PipeTransform {

  transform(count: number, max: number = DEFAULT_MAX): any {
    return count > max ? `${max}+` : count;
  }
}
