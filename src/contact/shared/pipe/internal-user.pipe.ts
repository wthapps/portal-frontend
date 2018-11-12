import { Pipe, PipeTransform } from '@angular/core';
import { _wu } from '../../../shared/shared/utils/utils';
import { _contact } from '../../shared/utils/contact.functions';

declare let _: any;

@Pipe({name: 'isContactInternal'})
export class ZContactInternalUser implements PipeTransform {
  transform(contact: any, name: any) {
    return _contact.isInternal(contact);
  }
}
