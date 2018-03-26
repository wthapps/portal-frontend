export class UrlConverterUtil {

  static objectToUrl(object: any) {
    if (typeof object == 'object') {
      let str: string = '';
      for (let param in object) {
        str += param + '=' + object[param] + '&';
      }
      str = str.slice(0, -1);
      return '?' + str;
    } else {
      return object;
    }
  }
}
