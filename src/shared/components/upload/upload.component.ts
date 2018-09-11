import {
  Component,
  Input,
  EventEmitter,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Constants } from '@wth/shared/constant';
import { FileReaderUtil } from '@shared/shared/utils/file/file-reader.util';
import { FileUploadPolicy } from '@shared/policies/file-upload.policy';
import * as Boom from 'boom';
import { BlackListPolicy } from '@shared/policies/black-list-policy';

@Component({
  selector: 'w-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WUploadComponent {
  @Input() mode: string = 'multiple';

  // file_extension	A file extension starting with the STOP character, e.g: .gif, .jpg, .png, .doc
  // audio/*	All sound files are accepted
  // video/*	All video files are accepted
  // image/*	All image files are accepted
  // media_type	A valid media type, with no parameters. Look at IANA Media Types for a complete list of standard media types
  @Input() accept: string = 'media_type';
  @Input() blacklist: any = ['exe', 'msi', 'dmg', 'deb', 'run', 'bat', 'out'];
  @Input() maxFileSize: any;

  @Output() uploadDone: EventEmitter<any> = new EventEmitter<any>();
  @Output() uploadHandler: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorHandler: EventEmitter<any> = new EventEmitter<any>();

  responses: Array<{ result: null, name: null, type: null }>

  existErrors: boolean = false;

  changeFiles(e: any) {
    // validate acceptable
    const errorFiles: any = []
    Object.keys(e.target.files).forEach(k => {
      if (!FileUploadPolicy.isAllow(e.target.files[k], [new BlackListPolicy])) {
        errorFiles.push(e.target.files[k]);
        this.existErrors = true;
      }
    });
    if (this.existErrors) {
      // reset error
      this.existErrors = false;
      // submit error
      this.errorHandler.emit({ ...Boom.notAcceptable('files are in blacklist').output.payload, files: errorFiles});
      return;
    }
    // continue if without error
    FileReaderUtil.readMultiple(e.target.files).then(progressEvents => {
      if (progressEvents && progressEvents.length > 0) {
        this.responses = progressEvents.map((event, key) => {
          return { result: event.target.result, name: e.target.files[key].name, type: e.target.files[key].type};
        })
        this.uploadHandler.emit(this.responses);
      }
    })
  }
}
