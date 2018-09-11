import { FileUtil } from '@shared/shared/utils/file/file.util';

export class SizePolicy {
  size: number;
  opts: any;
  constructor(size: any = 10000000, opts: any = {}) {
    this.size = size;
    this.opts = opts;
  }

  validate(file: any) {
    if (this.opts.only) {
      if (!file.type.match(this.opts.only)) {
        return file;
      }
    }
    if (file.size > this.size) {
      file.allow = false;
      file.allowErrors = file.allowErrors
        ? [...file.allowErrors, 'size']
        : ['size'];
      file.allowTitle = `This maximum for a file is ${this.size /
        1000000}MB, please make sure it small enough`;
    }
    return file;
  }
}
