import { SoUser } from './so-user.model';
import { BaseInput } from '../base/base-input.model';

export class SoPost extends BaseInput implements FromData{
  uuid: string;
  description: string;
  owner: SoUser = new SoUser();
  comments: Array<any> = [];
  photos: Array<any> = [];
  tags: Array<any> = [];
  reactions: Array<any> = [];
  adult: boolean;
  privacy: string;
  disable_comment: boolean;
  disable_share: boolean;
  mute: boolean;

  from(fields) {
    if (fields) {
      Object.assign(this, fields)
    }
    return this;
  }
}
