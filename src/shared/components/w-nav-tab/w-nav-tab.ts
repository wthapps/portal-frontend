export class WTab {
  name: string;
  link: string;
  icon: string;
  type: string;

  constructor(fields?: {
    name?: string,
    link?: string,
    icon?: string,
    type?: string,
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
