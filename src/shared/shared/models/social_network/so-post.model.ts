import { SoUser } from './so-user.model';
import { BaseInput } from '../base/base-input.model';
import { SoComment } from './so-comment.model';
import { FromData } from '../base/interfaces/from-data';
import { Constants } from '../../../constant/config/constants';

export class SoPost extends BaseInput implements FromData {
  uuid: string;
  description: string = '';
  owner: SoUser = new SoUser();
  comments: Array<SoComment> = new Array<SoComment>();
  parent_post: any ;
  photos: Array<any> = [];
  tags: Array<any> = [];
  tags_json: Array<any> = [];
  likes: Array<any> = [];
  dislikes: Array<any> = [];
  shares: Array<any> = [];
  reactions: Array<any> = [];
  adult: boolean = false;
  is_owner: boolean = false;
  // privacy: string = 'public';
  privacy: string = Constants.soPostPrivacy.public.data;
  custom_objects: Array<any> = [];
  disable_comment: boolean = false;
  disable_share: boolean = false;
  mute: boolean = false;
  like_count: number = 0;
  dislike_count: number = 0;
  share_count: number = 0;
  comment_count: number = 0;

  from(fields: any) {
    if (fields) {
      Object.assign(this, fields);
    }
    return this;
  }

  excludeComments() {
    delete this['comments'];
    return this;
  }

  isEmpty() {
    return !this.uuid;
  }
}