export class Photo {
  id: number;
  name: string;
  extension: string;
  dimensions: string;
  created_at: any;
  size: string;
  thumbnail_url: string;
  url: string;
  description: string;
  favorite: boolean;
  json_shares: any;

  constructor(fields: {
    id?: number,
    name?: string,
    extension?: string,
    dimensions?: string,
    created_at?: any,
    size?: string,
    thumbnail_url?: string,
    url?: string,
    description?: string,
    favorite?: boolean,
    json_shares?: any;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
