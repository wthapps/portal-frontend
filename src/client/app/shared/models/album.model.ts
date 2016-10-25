export class Album {
  id: number;
  name: string;
  description: string;
  owner: any;
  photos: any;
  created_at:any;
  photo_default:any;

  constructor(fields: {
    id?: number,
    name?: string,
    description?: string,
    owner?: any,
    photos?: any,
    created_at?:any;
    photo_default?:any;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
