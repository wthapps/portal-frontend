export class Media {
  id: number;
  name: string;
  model: string;
  uuid: string;
  description: string;
  owner: any;
  photos: any;
  photo_number: number;
  created_at: any;
  photo_default: any;
  object_type: string;
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
  child_count: number;

  constructor(fields: {
    id?: number,
    name?: string,
    description?: string,
    owner?: any,
    photos?: any,
    photo_number?: number,
    created_at?: any,
    photo_default?: any,
    object_type?: string,
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
    child_count?: number
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
