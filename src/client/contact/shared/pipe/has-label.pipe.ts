import { Pipe, PipeTransform } from '@angular/core';
import { _wu } from '../../../core/shared/utils/utils';

declare let _: any;

@Pipe({name: 'contactHasLabel'})
export class ZContactHasLabel implements PipeTransform {
  transform(contact: any, name:any) {
    return _.some(contact.labels, ['name', name]);
  }
}
