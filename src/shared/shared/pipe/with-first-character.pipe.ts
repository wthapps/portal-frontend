import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addFirstCharacter'
})
export class AddFirstCharacterPipe implements PipeTransform {

  transform(valueArr: any): any {
    return valueArr.map((v: any) => {
      const alias = v.name.charAt(0).toLowerCase();
      v.first_character = (this.isAlphaOrParen(alias)) ? alias : '#';
      return v;
    });
  }

  private isAlphaOrParen(str) {
    return /^[a-zA-Z()]+$/.test(str);
  }
}
