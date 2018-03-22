import { FileUtil } from "@shared/shared/utils/file/file.util";

export class FileUploadPolicy {
  static blackList = ['exe', 'msi', 'dmg', 'deb', 'run', 'bat', 'out'];

  static isAllow(file: any) {
    return this.allow(file).allow;
  }

  static allow(file: any) {
    let e = FileUtil.getExtension(file);
    file.allow = !this.blackList.some((item: any) => item == e);
    return file;
  }

  static allowMultiple(files: any) {
    if(!files || files.length < 1) {
      throw Error("files are empty");
    }
    return Object.keys(files).map((key: any) => this.allow(files[key]));
  }
}
