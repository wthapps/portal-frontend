import { Pipe, PipeTransform } from '@angular/core';
import { _wu } from '../../../core/shared/utils/utils';

declare let _: any;

@Pipe({name: 'contactHasGroup'})
export class ZContactHasGroup implements PipeTransform {
  transform(contact: any, name:any) {
    return _.some(contact.groups, ['name', name]);
  }
}
