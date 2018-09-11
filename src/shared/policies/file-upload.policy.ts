import { FileUtil } from '@shared/shared/utils/file/file.util';
import { BlackListPolicy } from '@shared/policies/black-list-policy';
import { SizePolicy } from '@shared/policies/size-policy';

export class FileUploadPolicy {
  static isAllow(file: any, policies: any) {
    return this.allow(file, policies).allow;
  }

  static allow(file: any, policies: any) {
    file.allow = true;
    file.allowErrors = [];
    policies.forEach(p => p.validate(file));
    return file;
  }

  static allowMultiple(files: any, policies: any) {
    if (!files || files.length < 1) {
      throw Error('files are empty');
    }
    return Object.keys(files).map((key: any) =>
      this.allow(files[key], policies)
    );
  }
}
