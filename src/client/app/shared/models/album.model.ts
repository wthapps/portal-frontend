export class Album {
  id: number;
  name: string;
  description: string;
  owner: any;
  photos: any;
  created_at:any;

  constructor(fields: {
    id?: number,
    name?: string,
    description?: string,
    owner?: any,
    photos?: any,
    created_at?:any;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
