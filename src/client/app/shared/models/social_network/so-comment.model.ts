import { BaseInput } from '../base/base-input.model';
import { SoUser } from './so-user.model';

export class SoComment extends BaseInput implements FromData{
  content: string = '';
  replies: Array<SoComment> = new Array<SoComment>();
  reactions: Array<any> = [];
  owner: SoUser = new SoUser();

  from(fields) {
    if (fields) {
      Object.assign(this, fields)
    }
    return this;
  }
}
