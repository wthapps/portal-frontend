export class SoPost {
  uuid: string;
  comments: any;
  description: string;
  owner: any;
  photos: Array<any>;
  tags: Array<any>;
  adult: boolean;
  privacy: string;
  disable_comment: boolean;
  disable_share: boolean;
  mute: boolean;

  constructor(fields: {
    uuid?: string,
    comments?: any;
    description?: string;
    owner?: any;
    photos?: Array<any>;
    tags?: Array<any>;
    adult?: boolean;
    disable_comment?: boolean;
    disable_share?: boolean;
    mute?: boolean;
    privacy?: string;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
