import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trim' })
export class TrimPipe implements PipeTransform {
  transform(str: string) {
    return str ? str.trim() : '';
  }
}
