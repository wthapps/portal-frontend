export class TagInput {
  value: string;
  display: string;

  constructor(fields: {
    value: string,
    display: string
  }) {
    if (fields) Object.assign(this, fields);
  }
}
