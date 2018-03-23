import { FileUtil } from "@shared/shared/utils/file/file.util";

export class FileUploadPolicy {
  static blackList = ['exe', 'msi', 'dmg', 'deb', 'run', 'bat', 'out'];

  static isAllow(file: any, policies: any = this.blackList) {
    return this.allow(file, policies).allow;
  }

  static allow(file: any, policies: any = this.blackList) {
    let e = FileUtil.getExtension(file);
    file.allow = !this.blackList.some((item: any) => item == e);
    return file;
  }

  static allowMultiple(files: any, policies: any = this.blackList) {
    if(!files || files.length < 1) {
      throw Error("files are empty");
    }
    return Object.keys(files).map((key: any) => this.allow(files[key]));
  }
}
