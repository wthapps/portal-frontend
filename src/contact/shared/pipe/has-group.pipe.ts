import { Pipe, PipeTransform } from '@angular/core';

declare let _: any;

@Pipe({name: 'contactHasGroup'})
export class ZContactHasGroup implements PipeTransform {
  transform(contact: any, name: string) {
    return _.some(contact.groups, ['name', name]);
  }
}
