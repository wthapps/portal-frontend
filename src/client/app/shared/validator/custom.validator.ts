import {
  AbstractControl,
  FormGroup
} from '@angular/forms';

export class CustomValidator {

  public static emailFormat(c: AbstractControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    /*return EMAIL_REGEXP.test(c.value) ? null : {
     emailFormat: {
     valid: false
     }
     };*/
    return EMAIL_REGEXP.test(c.value) ? null : {'emailFormat': true};
  }

  public static urlFormat(c: AbstractControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    /*return EMAIL_REGEXP.test(c.value) ? null : {
     emailFormat: {
     valid: false
     }
     };*/
    return true;// EMAIL_REGEXP.test(c.value) ? null : {'emailFormat': true};
  }
  // refs Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet and 1 Number:
  public static passwordCheck(c: AbstractControl) {
    let PASS_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i;
    return PASS_REGEXP.test(c.value) ? null : {'passwordCheck': true};
  }

  /**
   (                   # Start of group
   (?=.*\d)        #   must contain at least one digit
   (?=.*[a-z])     #   must contain at least one lowercase character
   (?=.*[A-Z])     #   must contain at least one uppercase character
   (?=.*\W)        #   must contain at least one special symbol
   .            #     match anything with previous condition checking
   {8,8}      #        length at least 8 characters and also maximum of 8
   )                   # End of group
   */
  public static lowercaseUppercase(c: AbstractControl) {
    let REGEXP = /(?=.*[a-z])(?=.*[A-Z])/;
    return REGEXP.test(c.value) ? null : {'lowercaseUppercase': true};
  }

  public static specialSymbol(c: AbstractControl) {
    let REGEXP = /(?=.*\W)/;
    return REGEXP.test(c.value) ? null : {'specialSymbol': true};
  }

  public static number(c: AbstractControl) {
    let REGEXP = /(?=.*\d)/;
    return REGEXP.test(c.value) ? null : {'number': true};
  }

  public static specialSymbolOrNumber(c: AbstractControl) {
    let REGEXP = /(?=.*\d)|(?=.*\W)/;
    return REGEXP.test(c.value) ? null : {'specialSymbolOrNumber': true};
  }


  public static passwordsEqual(firstField: string, secondField: string) {
    return (c: FormGroup) => {
      return (c.controls && c.controls[firstField].value == c.controls[secondField].value) ? null : {'passwordsEqual': true};
    };
  }

  public static ipHostFormat(c: AbstractControl) {
    if (c.value.length === 0) {
      return null;
    }

    //Ref: http://jsfiddle.net/AJEzQ/
    // tslint:disable-next-line
    let pattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    return pattern.test(c.value) ? null : {'ipHostFormat': true};
  }
}
