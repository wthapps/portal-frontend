import { FileUtil } from '@shared/shared/utils/file/file.util';

const MAX_SIZE_IN_MB = 35;
export class SizePolicy {
  opts: any;
  fileType: any = 'File';
  private sizeInMb: number;

  constructor(sizeInMb: any = 35, opts: any = {}) {
    this.sizeInMb = sizeInMb;
    this.opts = opts;
  }

  validate(file: any) {
    if (this.opts.only) {
      if (!file.type.match(this.opts.only)) {
        return file;
      }
    }
    // if (file.type.match(/video/g)) {
    //   this.fileType = 'Video';
    // }
    if (file.size > FileUtil.mbyte_to_byte(this.sizeInMb)) {
      file.allow = false;
      file.validateErrors = file.validateErrors
        ? [...file.validateErrors, 'size']
        : ['size'];
      file.validateText = `This ${this.fileType.toLowerCase()} you have selected is too large. The maximum for file size is ${
        this.sizeInMb
      } MB.`;
      file.validateTitle = `${this.fileType} can\'t not be upload`;
    }
    return file;
  }
}
