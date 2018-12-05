export class FileUtil {
  static getExtension(file) {
    if (!file.name) {
      throw Error('file.name is not exist');
    }
    return file.name.split('.').pop();
  }

  static mbyte_to_byte(mb) {
    return mb * 1024 * 1024;
  }
}
