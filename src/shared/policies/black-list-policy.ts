import { FileUtil } from '@shared/shared/utils/file/file.util';

export class BlackListPolicy {
  policies: any;
  status: string = 'blacklist';
  opts: any;

  constructor(
    policies = ['exe', 'msi', 'dmg', 'deb', 'run', 'bat', 'out'],
    opts: any = {}
  ) {
    this.policies = policies;
    this.opts = opts;
  }

  validate(file: any) {
    if (this.opts.only) {
      if (!file.type.match(this.opts.only)) {
        return file;
      }
    }
    let e = FileUtil.getExtension(file);
    if (this.policies.some((item: any) => item == e)) {
      file.allow = false;
      file.allowTitle =
        'This file type is not permitted for sercurity reasons.';
      file.allowErrors = file.allowErrors
        ? [...file.allowErrors, this.status]
        : [this.status];
    }
    return file;
  }
}
