export default class TextLengthValidatior {
  length: any;
  constructor(length) {
    this.length = length;
  }
  validate(object, length = this.length) {
    let status: any = { error: false };
    if (object.text.length > length) {
      status = { error: true, message: 'text excess limit' };
    }
    return status;
  }
}
