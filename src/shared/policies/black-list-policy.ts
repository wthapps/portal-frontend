import { FileUtil } from '@shared/shared/utils/file/file.util';

// Max file size allowed
const MAX_SIZE_IN_MB = 35;

export class BlackListPolicy {
  policies: any;
  status = 'blacklist';
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
    const e = FileUtil.getExtension(file);
    const { type, size } = file;
    const fileType = type.includes('video')
      ? 'video'
      : type.includes('image') ? 'photo' : 'file';
    if (this.policies.some((item: any) => item === e)) {
      file.allow = false;
      file.validateText =
        'This file type is not permitted for sercurity reasons.';
      file.validateErrors = file.validateErrors
        ? [...file.validateErrors, this.status]
        : [this.status];
      return file;
    }
    if (size > FileUtil.mbyte_to_byte(MAX_SIZE_IN_MB)) {
      file.allow = false;
      file.validateText = `This ${fileType} you have selected is too large. The maximum file size is ${MAX_SIZE_IN_MB} MB.`;
      file.validateErrors = file.validateErrors
        ? [...file.validateErrors, this.status]
        : [this.status];
      return file;
    }
    return file;
  }
}
