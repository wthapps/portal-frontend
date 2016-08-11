export class Category {

  id: number;
  uuid: string;
  name: string;
  display_name: string;
  description: string;

  constructor(fields?: {
    id?: number,
    uuid?: string,
    name?: string,
    display_name?: string,
    description?: string
  }) {
    if (fields) Object.assign(this, fields);
    if (fields == undefined) this.name = '';

  }
}