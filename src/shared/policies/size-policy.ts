import { FileUtil } from '@shared/shared/utils/file/file.util';

export class SizePolicy {
  size: number;
  opts: any;
  fileType: any = 'file';
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
    if (file.type.match(/video/g)) {
      this.fileType = 'Video';
    }
    if (file.size > this.size) {
      file.allow = false;
      file.validateErrors = file.validateErrors
        ? [...file.validateErrors, 'size']
        : ['size'];
      file.validateText = `This ${this.fileType.toLowerCase()} you have selected is too large. The maximum for file size is ${this
        .size / 1000000}MB.`;
      file.validateTitle = `${this.fileType} can\'t not be upload`;
    }
    return file;
  }
}
