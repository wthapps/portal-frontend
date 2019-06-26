import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'objectValues' })
export class ObjectValuesPipe implements PipeTransform {
  transform(object): any {
    return Object.values(object);
  }
}
