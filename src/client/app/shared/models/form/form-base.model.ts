import {FormElement} from "./form-element.model";
export class FormBase {
  title: string;
  fields: Array<FormElement>;

  constructor(fields: {
    title: string;
    fields: Array<FormElement>;
  }) {
    if (fields) Object.assign(this, fields);
  }
}
