export class WTab {
  name: string;
  link: string;
  icon: string;
  number: number;
  type: string;

  constructor(fields?: {
    name?: string,
    link?: string,
    icon?: string,
    number?: number,
    type?: string
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
