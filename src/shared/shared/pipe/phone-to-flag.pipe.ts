import { Pipe, PipeTransform } from '@angular/core';

declare var _: any;

@Pipe({
  name: 'phoneCodeCountries'
})
export class PhoneCodeCountriesPipe implements PipeTransform {
  transform(key: any, data: any): any {
    if (key) {
      const phoneName = key.split(' (+');
      const phoneCode = _.find(data, ['name', phoneName[0]]);
      return (
        '<div class="clearfix">' +
        `<img class=\"pull-left\" width='30' src='assets/images/flags/` +
        phoneCode.code.toLowerCase() +
        `.svg' alt=''>` +
        '<span class="pull-left">' +
        phoneCode.name +
        '</span>' +
        '<span class="pull-right">' +
        '(' +
        phoneCode.dial_code +
        ')' +
        '</span>' +
        '</div>'
      );
    }
  }
}

/**
 * <img *ngIf="countriesCode" src="assets/images/flags/{{item.country_alpha_code | phoneCodeFlag:countriesCode}}.svg">
 */

@Pipe({
  name: 'phoneCodeFlag'
})
export class PhoneCodeFlagPipe implements PipeTransform {
  transform(key: any, data: any): any {
    if (data) {
      if (key) {
        const phoneName = key.split(' (+');
        const phoneCode = _.find(data, ['name', phoneName[0]]);
        if (phoneCode && phoneCode.code) {
          return phoneCode.code.toLowerCase();
        }
        return null;
      }
    }
  }
}

@Pipe({
  name: 'phoneDialCode'
})
export class PhoneDialCodePipe implements PipeTransform {
  transform(key: any): string {
    if (key) {
      return `(+${key.split(' (+')[1]}`;
    } else {
      return '';
    }
  }
}

const PHONE_CODE_REGEX = /\([^\)]*\)/;

// Aghanistan (+83) => +83
@Pipe({
  name: 'phoneCodeOnlyFlag'
})
export class PhoneCodeOnlyFlagPipe implements PipeTransform {
  transform(key: any): any {
    if (!key) return '';
    const matches = key.match(PHONE_CODE_REGEX);
    return matches ? matches[0] : '';
  }
}

@Pipe({
  name: 'phoneCodeToDisplayCode'
})
export class PhoneCodeToDisplayCodePipe implements PipeTransform {
  transform(key: any, data: any): any {
    const phoneCode = _.find(data, ['code', key.toUpperCase()]);
    return (
      '<div class="clearfix">' +
      "<img class=\"pull-left\" width='30' src='assets/images/flags/" +
      phoneCode.code.toLowerCase() +
      ".svg' alt=''>" +
      '<span class="pull-left">' +
      phoneCode.name +
      '</span>' +
      '<span class="pull-right">' +
      '(' +
      phoneCode.dial_code +
      ')' +
      '</span>' +
      '</div>'
    );
  }
}
