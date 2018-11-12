import { FileInput } from 'uppy';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';

export class FileInputCustom extends FileInput {
  uppy: any;
  opts: any;
  id: any;
  input: any;
  commonEventService: any;
  constructor(uppy, opts) {
    super(uppy, opts);
    this.commonEventService = opts.commonEventService;
    this.opts = opts;
  }

  handleInputChange(ev) {
    let files = Object.keys(ev.target.files).map(k => ev.target.files[k]);
    const filesAddedPolicy = FileUploadPolicy.allowMultiple(
      files,
      this.opts.policies
    );
    const filesNotAllow = filesAddedPolicy.filter(file => file.allow === false);
    const filesAllow = filesAddedPolicy.filter(file => file.allow === true);
    if (filesNotAllow.length > 0) {
      this.commonEventService.broadcast({
        channel: 'LockMessage',
        payload: filesNotAllow
      });
    }

    filesAllow.forEach(file => {
      try {
        this.uppy.addFile({
          source: this.id,
          name: file.name,
          type: file.type,
          data: file
        });
      } catch (err) {
        // console.log(err);
        // Nothing, restriction errors handled in Core
      }
    });
  }
}
