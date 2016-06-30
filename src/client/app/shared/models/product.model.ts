export class Product {

  id: number;
  name: string;

  constructor(
    fields?: {
      id?: number,
      name?: string
    }
  ){
    if (fields) Object.assign(this, fields);
  }

}
