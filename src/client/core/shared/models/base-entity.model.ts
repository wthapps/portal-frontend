export abstract class BaseEntity {
  id: number;
  uuid: string;

  created_by: any;
  updated_by: any;
  [key: string]: any;

  constructor(attributes: any={}) {
    if (attributes) {
      Object.assign(this, attributes);
    }
  }
}
