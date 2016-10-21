export class Form {
  id: string;
  show: boolean;
  constructor(fields: {
    id?: string,
    show?: boolean;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
