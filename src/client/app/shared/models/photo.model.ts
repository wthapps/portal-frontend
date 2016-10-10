export class Photo {
  id: number;
  name: string;
  name_photo: string;
  extension: string;
  dimensions: string;
  created_at: string;
  size: string;
  thumbnail_url: string;
  url: string;

  constructor(fields: {
    id?: number,
    name?: string,
    name_photo?: string,
    extension?: string,
    dimensions?: string,
    created_at?: string,
    size?: string,
    thumbnail_url?: string,
    url?: string,
  }) {
    if (fields) Object.assign(this, fields);
  }
}
