import {AbstractControl} from '@angular/forms';

export class CustomValidator {

  public static emailFormat(c:AbstractControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    /*return EMAIL_REGEXP.test(c.value) ? null : {
       emailFormat: {
        valid: false
       }
     };*/
    return EMAIL_REGEXP.test(c.value) ? null : {'emailFormat': true};
  }
}
