import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts urlTransform into http:// or https://
 */
@Pipe({ name: 'hasMoreActions' })
export class HasMoreActionsPipe implements PipeTransform {
  transform(value: any): boolean {
    console.log('here');

    return (
      Object.keys(value).filter(k => {
        return value[k].inDropDown == true && value[k].active == true && value[k].mobile
      }).length !== 0
    );
  }
}
