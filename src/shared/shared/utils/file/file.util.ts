export class FileUtil {

  static getExtension(file: any) {
    console.log(file);
    if (!file.name) throw Error("file.name is not exist");
    return file.name.split('.').pop();
  }
}
