import { Pipe, PipeTransform } from '@angular/core';

declare var _: any;

@Pipe({
  name: 'phoneCodeCountries'
})
export class phoneCodeCountriesPipe implements PipeTransform {

  transform(key: any, data: any): any {
    let phoneName = key.split(" (+");
    let phoneCode = _.find(data, ['name', phoneName[0]]);
    return '<div class="clearfix">' +
      '<img class="pull-left" width="30" src="assets/images/flags/' + phoneCode.code.toLowerCase() + '.svg" alt="">' +
      '<span class="pull-left">' + phoneCode.name + '</span>' +
      '<span class="pull-right">' + '(' + phoneCode.dial_code + ')' + '</span>' +
      '</div>';
  }
}

@Pipe({
  name: 'phoneCodeFlag'
})
export class phoneCodeFlagPipe implements PipeTransform {

  transform(key: any, data: any): any {
    if (data) {
      let phoneName = key.split(" (+");
      let phoneCode = _.find(data, ['name', phoneName[0]]);
      return phoneCode.code.toLowerCase();
    }
  }
}
