import {Control} from '@angular/common';

interface IValidation {
  [key:string]:boolean;
}

export class CustomValidators {
  static emailFormat(control:Control):IValidation {
    let pattern:RegExp = /\S+@\S+\.\S+/;
    //let pattern:RegExp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return pattern.test(control.value) ? null : {'emailFormat': true};
  }

  static duplicated(control: Control) {
    const q = new Promise<IValidation>((resolve, reject) => {
      setTimeout(() => {
        //TODO Checking if you have an account
        if(control.value === 'admin@wthapps.com') {
          resolve({'duplicated': true});
        } else {
          resolve(null);
        }
      }, 1000);
    });
    return q;
  }

}
