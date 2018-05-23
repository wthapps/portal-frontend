export class JsonConverterUtil {

  static objectToString(object: any) {
    if (typeof object == 'object') {
      object = JSON.stringify(object);
    }
    return object;
  }
}
