export class Album {
  id: number;
  name: string;
  name_album: string;
  description: string;

  constructor(fields: {
    id?: number,
    name?: string,
    name_album?: string,
    description?: string,
  }) {
    if (fields) Object.assign(this, fields);
  }
}
