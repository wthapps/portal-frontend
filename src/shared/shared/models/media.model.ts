export class Media {
  id: number;
  name: string;
  description: string;
  owner: any;
  photos: any;
  photo_number: number;
  created_at: any;
  photo_default: any;
  favorite: boolean;
  tags: any = [];
  tags_json: any = [];

  extension: string;
  dimensions: string;
  size: string;
  thumbnail_url: string;
  url: string;
  json_shares: any;
  content_type: string;
  object_type: string;

  constructor(fields: {
    id?: number,
    name?: string,
    description?: string,
    owner?: any,
    photos?: any,
    photo_number?: number,
    created_at?: any,
    photo_default?: any,
    favorite?: boolean,
    tags?: any,
    tags_json?: any,

    extension?: string,
    dimensions?: string,
    size?: string,
    thumbnail_url?: string,
    url?: string,
    json_shares?: any,
    content_type?: string,
    object_type?: string
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
