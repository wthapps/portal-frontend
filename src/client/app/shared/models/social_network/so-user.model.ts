import { BaseInput } from '../base/base-input.model';

export class SoUser extends BaseInput implements FromData{
  uuid: string = '';
  nickname: string = '';

  from(fields) {
    if (fields) {
      Object.assign(this, fields)
    }
    return this;
  }
}
