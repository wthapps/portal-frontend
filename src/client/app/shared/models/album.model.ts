export class Album {
  id: number;
  name: string;
  description: string;
  owner: any;
  photo: any;

  constructor(fields: {
    id?: number,
    name?: string,
    description?: string,
    owner?: any,
    photo?: any,
  }) {
    if (fields) Object.assign(this, fields);
  }
}
