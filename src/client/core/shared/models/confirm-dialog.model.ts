
export class ConfirmDialogModel {
  label: any;

  constructor(fields: {
    label?: any,
  }) {
    if (fields) Object.assign(this, fields);
  }
}
