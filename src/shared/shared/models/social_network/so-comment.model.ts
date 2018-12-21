import { BaseInput } from '../base/base-input.model';
import { SoUser } from './so-user.model';
import { FromData } from '../base/interfaces/from-data';

export const CommentObjectType = {
  Post: 'SocialNetwork::Post',
  Comment: 'SocialNetwork::Comment',
  Photo: 'SocialNetwork::Photo'
};

export class SoComment extends BaseInput implements FromData {
  uuid = '';
  content = '';
  comments: Array<SoComment> = new Array<SoComment>();
  comment_count = 0;
  reactions: Array<any> = [];
  likes: Array<any> = [];
  like_count = 0;
  dislikes: Array<any> = [];
  dislike_count = 0;
  shares: Array<any> = [];
  // photos: Array<any> = [];
  photo: any = null;
  parent: any = null;
  parentId = '';
  parentType = ''; // value is SocialNetwork::Post or SocialNetwork::Comment
  owner: SoUser = new SoUser();
  showReplies = false;

  from(fields: any) {
    if (fields) {
      Object.assign(this, fields);
    }
    return this;
  }
}
