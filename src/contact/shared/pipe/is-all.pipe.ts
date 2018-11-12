import { Pipe, PipeTransform } from '@angular/core';
import { _wu } from '../../../shared/shared/utils/utils';
import { _contact } from '../../shared/utils/contact.functions';

declare let _: any;

@Pipe({name: 'isAll'})
export class ZContactIsAll implements PipeTransform {
  transform(data: any, name: string, detect: any) {
    if (!data || data.length === 0) return false;
    if (name === 'contact') return data.every(ob => !ob.settings);
    if (name === 'user') return data.every(ob => ob.settings);
    return false;
  }
}
