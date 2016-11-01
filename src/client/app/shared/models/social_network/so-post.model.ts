export class SoPost {
  uuid: string;
  comments: any;
  description: string;
  owner: any;
  photos: Array<any>;
  tags: Array<any>;

  // Frontend additional
  displayCss: string;
  remainPhotos: number;

  constructor(fields: {
    uuid?: string,
    comments?: any;
    description?: string;
    owner?: any;
    photos?: Array<any>;
    displayCss?: string;
    remainPhotos?: number;
    tags?: Array<any>;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
