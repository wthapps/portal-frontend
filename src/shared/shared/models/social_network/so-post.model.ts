import { SoUser } from './so-user.model';
import { BaseInput } from '../base/base-input.model';
import { SoComment } from './so-comment.model';
import { FromData } from '../base/interfaces/from-data';
import { Constants } from '../../../constant/config/constants';

export class SoPost extends BaseInput implements FromData {
  uuid: string;
  description = '';
  owner: SoUser = new SoUser();
  comments: Array<SoComment> = new Array<SoComment>();
  parent_post: any ;
  photos: Array<any> = [];
  resources: Array<any> = []; // include photos and videos
  tags: Array<any> = [];
  tags_json: Array<any> = [];
  likes: Array<any> = [];
  dislikes: Array<any> = [];
  shares: Array<any> = [];
  reactions: Array<any> = [];
  adult = false;
  is_owner = false;
  // privacy: string = 'public';
  privacy: string = Constants.soPostPrivacy.public.data;
  custom_objects: Array<any> = [];
  disable_comment = false;
  disable_share = false;
  mute = false;
  like_count = 0;
  dislike_count = 0;
  shared_count = 0;
  comment_count = 0;

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
