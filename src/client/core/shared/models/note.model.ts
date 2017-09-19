import { User } from './user.model';
export class Note {
  id: number;
  uuid: string;
  name: string;
  description: string;
  content: string;
  type: any;
  date: string;
  owner: User;

  constructor(fields: {
    id?: number,
    uuid?: string,
    name?: string,
    description?: string,
    content?: string,
    type?: any,
    date?: string,
    owner?: User,
  }) {
    if (fields) Object.assign(this, fields);
  }
}
